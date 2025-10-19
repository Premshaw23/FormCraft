// lib/services/responseService.js - FIXED FILE UPLOAD
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

/**
 * Convert File objects to metadata before saving to Firestore
 * Firestore doesn't support File objects, only primitives
 */
function sanitizeAnswers(answers) {
  const sanitized = {};

  for (const [key, value] of Object.entries(answers)) {
    // Handle File objects
    if (value instanceof File) {
      sanitized[key] = {
        fileName: value.name,
        fileSize: value.size,
        fileType: value.type,
        // Note: Actual file upload to Storage would happen here
        // For now, we just store metadata
        uploadStatus: "pending", // Would be "uploaded" after Storage upload
      };
    }
    // Handle arrays (for checkboxes)
    else if (Array.isArray(value)) {
      sanitized[key] = value;
    }
    // Handle regular values
    else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Submit a form response
 */
export async function submitResponse(formId, userId, answers, metadata = {}) {
  try {
    // FIXED: Sanitize answers to remove File objects
    const sanitizedAnswers = sanitizeAnswers(answers);

    const responseData = {
      formId,
      userId: userId || "anonymous",
      answers: sanitizedAnswers, // Use sanitized version
      metadata: {
        ...metadata,
        submittedFrom:
          typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
      submittedAt: serverTimestamp(),
      status: "completed",
    };

    // Add response to Firestore
    const responseRef = await addDoc(collection(db, "responses"), responseData);

    // Increment response count on form
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, {
      responseCount: increment(1),
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
 * Export responses to CSV format
 */
export async function exportResponsesToCSV(formId, formFields) {
  try {
    const responses = await getFormResponses(formId);

    if (responses.length === 0) {
      return null;
    }

    // Create CSV headers
    const headers = [
      "Response ID",
      "User Name",
      "User Email",
      "Submitted At",
      ...formFields
        .filter(
          (f) =>
            !["section_heading", "divider", "description_text"].includes(f.type)
        )
        .map((f) => f.label),
    ];

    // Create CSV rows
    const rows = responses.map((response) => {
      const row = [
        response.id,
        response.metadata?.userName || "Anonymous",
        response.metadata?.userEmail || "N/A",
        response.submittedAt?.toDate
          ? new Date(response.submittedAt.toDate()).toLocaleString()
          : "N/A",
      ];

      // Add answer for each field
      formFields.forEach((field) => {
        if (
          ["section_heading", "divider", "description_text"].includes(
            field.type
          )
        ) {
          return;
        }

        const answer = response.answers?.[field.id];

        // Handle different answer types
        if (answer === undefined || answer === null || answer === "") {
          row.push("(No answer)");
        } else if (Array.isArray(answer)) {
          // Checkboxes
          row.push(answer.join(", "));
        } else if (typeof answer === "object" && answer.fileName) {
          // File upload metadata
          row.push(`File: ${answer.fileName}`);
        } else {
          row.push(String(answer));
        }
      });

      return row;
    });

    // Combine headers and rows
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return csvContent;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw error;
  }
}
