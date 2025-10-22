// lib/services/responseService.js - FIXED Invalid Date Issue
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary, validateFile } from "./fileService";

/**
 * Remove undefined values from an object recursively
 */
function removeUndefinedValues(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues).filter((item) => item !== undefined);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === "object") {
        cleaned[key] = removeUndefinedValues(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

/**
 * Process and upload files in form answers with proper error handling
 */
async function processFileUploads(answers, onProgress = null) {
  const processedAnswers = { ...answers };
  const uploadPromises = [];
  const errors = [];

  for (const [key, value] of Object.entries(answers)) {
    if (value instanceof File) {
      // Validate file first
      const validation = validateFile(value);
      if (!validation.valid) {
        errors.push({ field: key, error: validation.error });
        continue;
      }

      // Upload file to Cloudinary with error handling
      const uploadPromise = uploadToCloudinary(value, (progress) => {
        if (onProgress) {
          onProgress(key, progress);
        }
      })
        .then((uploadResult) => {
          // Clean the upload result to remove any undefined values
          processedAnswers[key] = removeUndefinedValues(uploadResult);
        })
        .catch((error) => {
          console.error(`Error uploading file for field ${key}:`, error);
          errors.push({ field: key, error: error.message });
        });

      uploadPromises.push(uploadPromise);
    }
  }

  // Wait for all uploads to complete
  await Promise.all(uploadPromises);

  // If there were errors, throw them
  if (errors.length > 0) {
    const errorMsg = errors.map((e) => `${e.field}: ${e.error}`).join("; ");
    throw new Error(`File upload failed: ${errorMsg}`);
  }

  return processedAnswers;
}

/**
 * Submit a form response with improved error handling
 */
export async function submitResponse(
  formId,
  userId,
  answers,
  metadata = {},
  onUploadProgress = null
) {
  try {
    // Validate inputs
    if (!formId) {
      throw new Error("Form ID is required");
    }

    if (!answers || Object.keys(answers).length === 0) {
      throw new Error("No answers provided");
    }

    // Process file uploads first
    const processedAnswers = await processFileUploads(
      answers,
      onUploadProgress
    );

    // Build response data
    const responseData = {
      formId,
      userId: userId || "anonymous",
      answers: processedAnswers,
      metadata: {
        ...metadata,
        submittedFrom:
          typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        submittedAt: new Date().toISOString(),
      },
      submittedAt: new Date().toISOString(),
      status: "completed",
    };

    // Clean the entire response data to remove any undefined values
    const cleanedResponseData = removeUndefinedValues(responseData);

    // Save to Firestore
    const responseRef = await addDoc(
      collection(db, "responses"),
      cleanedResponseData
    );

    // Update form response count
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, {
      responseCount: increment(1),
      lastResponseAt: serverTimestamp(),
    });

    return { success: true, id: responseRef.id };
  } catch (error) {
    console.error("Error submitting response:", error);
    throw error;
  }
}

/**
 * Check if user can submit the form
 */
export async function canUserSubmit(formId, userId, settings = {}) {
  try {
    // Check max submissions
    if (settings.maxSubmissions) {
      const responsesQuery = query(
        collection(db, "responses"),
        where("formId", "==", formId)
      );
      const snapshot = await getDocs(responsesQuery);
      if (snapshot.size >= settings.maxSubmissions) {
        return {
          canSubmit: false,
          reason: "This form has reached its maximum number of responses",
        };
      }
    }

    // Check if user already submitted (if multiple responses not allowed)
    if (!settings.allowMultipleResponses && userId && userId !== "anonymous") {
      const userResponsesQuery = query(
        collection(db, "responses"),
        where("formId", "==", formId),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(userResponsesQuery);
      if (!snapshot.empty) {
        return {
          canSubmit: false,
          reason: "You have already submitted a response to this form",
        };
      }
    }

    return { canSubmit: true };
  } catch (error) {
    console.error("Error checking submission permission:", error);
    return { canSubmit: true }; // Allow by default if check fails
  }
}

/**
 * Get all responses for a form
 */
export async function getFormResponses(formId) {
  try {
    const responsesQuery = query(
      collection(db, "responses"),
      where("formId", "==", formId),
      orderBy("submittedAt", "desc")
    );

    const snapshot = await getDocs(responsesQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw error;
  }
}

/**
 * Get a single response by ID
 */
export async function getResponseById(responseId) {
  try {
    const responseDoc = await getDoc(doc(db, "responses", responseId));
    if (responseDoc.exists()) {
      return { id: responseDoc.id, ...responseDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching response:", error);
    throw error;
  }
}

/**
 * Delete a response
 */
export async function deleteResponse(responseId, formId) {
  try {
    // Delete the response document
    await deleteDoc(doc(db, "responses", responseId));

    // Decrement response count on form
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, {
      responseCount: increment(-1),
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting response:", error);
    throw error;
  }
}

/**
 * Helper function to safely format Firestore timestamp
 */
function formatTimestamp(timestamp, fallback = "N/A") {
  try {
    // Check if it's a Firestore Timestamp with toDate method
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }

    // Check if it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }

    // Check if it's an ISO string
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    }

    // If all else fails, return fallback
    return fallback;
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return fallback;
  }
}

/**
 * Export responses to CSV format - FIXED
 */
export async function exportResponsesToCSV(formId, formFields) {
  try {
    const responses = await getFormResponses(formId);

    if (responses.length === 0) {
      return null;
    }

    // Filter out layout-only fields
    const dataFields = formFields.filter(
      (f) =>
        !["section_heading", "divider", "description_text"].includes(f.type)
    );

    // Create CSV headers
    const headers = [
      "Response ID",
      "User Name",
      "User Email",
      "Submitted At",
      ...dataFields.map((f) => f.label),
    ];

    // Create CSV rows
    const rows = responses.map((response) => {
      const row = [
        response.id,
        response.metadata?.userName || "Anonymous",
        response.metadata?.userEmail || "N/A",
        // FIXED: Use the helper function to safely format timestamp
        formatTimestamp(response.submittedAt || response.metadata?.submittedAt),
      ];

      // Add answer for each field
      dataFields.forEach((field) => {
        const answer = response.answers?.[field.id];

        // Handle different answer types
        if (answer === undefined || answer === null || answer === "") {
          row.push("(No answer)");
        } else if (Array.isArray(answer)) {
          // Checkboxes
          row.push(answer.join(", "));
        } else if (typeof answer === "object" && answer.fileName) {
          // File upload - Include URL
          const fileInfo = `${answer.fileName} (${
            answer.url || "URL not available"
          })`;
          row.push(fileInfo);
        } else {
          row.push(String(answer));
        }
      });

      return row;
    });

    // Combine headers and rows with proper CSV escaping
    const csvContent = [
      headers.map((h) => escapeCsvCell(h)).join(","),
      ...rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(",")),
    ].join("\n");

    return csvContent;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw error;
  }
}

/**
 * Helper function to properly escape CSV cells
 */
function escapeCsvCell(cell) {
  const str = String(cell);
  // If cell contains comma, newline, or quote, wrap in quotes and escape quotes
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
