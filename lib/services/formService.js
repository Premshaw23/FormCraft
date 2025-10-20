// lib/services/formService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Collection reference
const FORMS_COLLECTION = "forms";
const RESPONSES_COLLECTION = "responses";

/**
 * Fetch all forms for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} Array of form objects
 */
export const getUserForms = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Create query
    const formsRef = collection(db, FORMS_COLLECTION);
    const q = query(
      formsRef,
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );

    // Execute query
    const querySnapshot = await getDocs(q);

    // Map documents to array
    const forms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return forms;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw new Error("Failed to fetch forms: " + error.message);
  }
};


/**
 * Fetch a single form by ID
 * @param {string} formId - The form's ID
 * @returns {Promise<Object>} Form object
 */
export const getFormById = async (formId) => {
  try {
    if (!formId) {
      throw new Error("Form ID is required");
    }

    const formRef = doc(db, FORMS_COLLECTION, formId);
    const formSnap = await getDoc(formRef);

    if (!formSnap.exists()) {
      throw new Error("Form not found");
    }

    return {
      id: formSnap.id,
      ...formSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching form:", error);
    throw new Error("Failed to fetch form: " + error.message);
  }
};



/**
 * Create a new form
 * @param {string} userId - The user's ID
 * @param {Object} formData - Form data object
 * @returns {Promise<Object>} Created form with ID
 */
// lib/services/formService.js
export const createForm = async (userId, formData = {}) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Default form structure
    const newForm = {
      userId,
      creatorId: userId, // Add this for security rules compatibility
      title: formData.title || "Untitled Form",
      description: formData.description || "",
      status: formData.status || "draft",
      fields: formData.fields || [],
      settings: {
        submitButtonText: "Submit",
        confirmationMessage: "Thank you for your submission!",
        maxSubmissions: null,
        allowMultipleResponses: true,
        requireAuth: true,
        showProgressBar: false,
        ...formData.settings,
      },
      theme: {
        primaryColor: "#8b5cf6",
        backgroundColor: "#1e293b",
        fontFamily: "Inter",
        ...formData.theme,
      },
      responseCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add to Firestore
    const formsRef = collection(db, FORMS_COLLECTION);
    const docRef = await addDoc(formsRef, newForm);

    // Return just the ID string
    return docRef.id;
  } catch (error) {
    console.error("Error creating form:", error);
    throw new Error("Failed to create form: " + error.message);
  }
};


/**
 * Update an existing form
 * @param {string} formId - The form's ID
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object>} Updated form
 */
export const updateForm = async (formId, updates) => {
  try {
    if (!formId) {
      throw new Error("Form ID is required");
    }

    const formRef = doc(db, FORMS_COLLECTION, formId);

    // Add updated timestamp
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // Update document
    await updateDoc(formRef, updateData);

    // Fetch and return updated form
    const updatedForm = await getFormById(formId);
    return updatedForm;
  } catch (error) {
    console.error("Error updating form:", error);
    throw new Error("Failed to update form: " + error.message);
  }
};



/**
 * Delete a form and all its responses
 * @param {string} formId - The form's ID
 * @returns {Promise<void>}
 */
export const deleteForm = async (formId) => {
  try {
    if (!formId) {
      throw new Error("Form ID is required");
    }

    // Delete the form document
    const formRef = doc(db, FORMS_COLLECTION, formId);
    await deleteDoc(formRef);

    // TODO: Also delete all responses for this form
    // We'll implement this in the responses service

    return true;
  } catch (error) {
    console.error("Error deleting form:", error);
    throw new Error("Failed to delete form: " + error.message);
  }
};


/**
 * Duplicate an existing form
 * @param {string} formId - The form's ID to duplicate
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} Duplicated form
 */
export const duplicateForm = async (formId, userId) => {
  try {
    if (!formId || !userId) {
      throw new Error("Form ID and User ID are required");
    }

    // Get original form
    const originalForm = await getFormById(formId);

    // Create copy with new data
    const duplicatedFormData = {
      ...originalForm,
      title: `Copy of ${originalForm.title}`,
      status: "draft",
      responseCount: 0,
      userId, // Ensure it belongs to current user
    };

    // Remove the ID from original form data
    delete duplicatedFormData.id;
    delete duplicatedFormData.createdAt;
    delete duplicatedFormData.updatedAt;

  // Create new form and return the full form object (with id)
  const newFormId = await createForm(userId, duplicatedFormData);

  // Fetch the newly created form document so callers receive a full object
  const createdForm = await getFormById(newFormId);

  return createdForm;
  } catch (error) {
    console.error("Error duplicating form:", error);
    throw new Error("Failed to duplicate form: " + error.message);
  }
};


/**
 * Get statistics for user's forms
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} Stats object
 */
export const getFormStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get all forms
    const forms = await getUserForms(userId);

    // Calculate stats
    const stats = {
      total: forms.length,
      published: forms.filter(f => f.status === "published").length,
      drafts: forms.filter(f => f.status === "draft").length,
      archived: forms.filter(f => f.status === "archived").length,
      totalResponses: forms.reduce((sum, form) => sum + (form.responseCount || 0), 0),
    };

    return stats;
  } catch (error) {
    console.error("Error getting form stats:", error);
    throw new Error("Failed to get stats: " + error.message);
  }
};


/**
 * Publish a form (change status to published)
 * @param {string} formId - The form's ID
 * @returns {Promise<Object>} Updated form
 */
export const publishForm = async (formId) => {
  try {
    return await updateForm(formId, { status: "published" });
  } catch (error) {
    console.error("Error publishing form:", error);
    throw new Error("Failed to publish form: " + error.message);
  }
};

/**
 * Unpublish a form (change status to draft)
 * @param {string} formId - The form's ID
 * @returns {Promise<Object>} Updated form
 */
export const unpublishForm = async (formId) => {
  try {
    return await updateForm(formId, { status: "draft" });
  } catch (error) {
    console.error("Error unpublishing form:", error);
    throw new Error("Failed to unpublish form: " + error.message);
  }
};



/**
 * Archive a form
 * @param {string} formId - The form's ID
 * @returns {Promise<Object>} Updated form
 */
export const archiveForm = async (formId) => {
  try {
    return await updateForm(formId, { status: "archived" });
  } catch (error) {
    console.error("Error archiving form:", error);
    throw new Error("Failed to archive form: " + error.message);
  }
};

/**
 * Unarchive a form
 * @param {string} formId - The form's ID
 * @returns {Promise<Object>} Updated form
 */
export const unarchiveForm = async (formId) => {
  try {
    return await updateForm(formId, { status: "draft" });
  } catch (error) {
    console.error("Error unarchiving form:", error);
    throw new Error("Failed to unarchive form: " + error.message);
  }
};