// lib/services/draftService.js - Auto-save draft functionality
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

/**
 * Save draft to Firestore with throttling
 */
export async function saveDraft(formId, userId, formData, metadata = {}) {
  try {
    const draftId = `${formId}_${userId || "anonymous"}`;
    const draftRef = doc(db, "drafts", draftId);

    const draftData = {
      formId,
      userId: userId || "anonymous",
      formData,
      metadata: {
        ...metadata,
        lastSaved: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
      updatedAt: new Date().toISOString(),
    };

    await setDoc(draftRef, draftData);
    return { success: true, savedAt: draftData.updatedAt };
  } catch (error) {
    console.error("Error saving draft:", error);
    // Don't throw error - silently fail for drafts
    return { success: false, error: error.message };
  }
}

/**
 * Load draft from Firestore
 */
export async function loadDraft(formId, userId) {
  try {
    const draftId = `${formId}_${userId || "anonymous"}`;
    const draftRef = doc(db, "drafts", draftId);
    const draftDoc = await getDoc(draftRef);

    if (draftDoc.exists()) {
      return {
        exists: true,
        data: draftDoc.data(),
      };
    }

    return { exists: false };
  } catch (error) {
    console.error("Error loading draft:", error);
    return { exists: false };
  }
}

/**
 * Delete draft after successful submission
 */
export async function deleteDraft(formId, userId) {
  try {
    const draftId = `${formId}_${userId || "anonymous"}`;
    const draftRef = doc(db, "drafts", draftId);
    await deleteDoc(draftRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return { success: false };
  }
}

/**
 * Throttle function to limit save frequency
 */
export function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    clearTimeout(timeoutId);

    if (timeSinceLastExec >= delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - timeSinceLastExec);
    }
  };
}
