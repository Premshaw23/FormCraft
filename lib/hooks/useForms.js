// lib/hooks/useForms.js
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserForms,
  createForm,
  updateForm,
  deleteForm,
  duplicateForm,
  getFormStats,
  publishForm,
  unpublishForm,
  archiveForm,
} from "@/lib/services/formService";
import toast from "react-hot-toast";

export function useForms() {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    totalResponses: 0,
  });

  // Fetch forms on mount
  useEffect(() => {
    if (user) {
      fetchForms();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fetch all forms
  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);

      const userForms = await getUserForms(user.uid);
      setForms(userForms);

      // Calculate stats
      const userStats = await getFormStats(user.uid);
      setStats(userStats);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError(err.message);
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  // Create new form
  const handleCreateForm = async (formData) => {
    try {
      const newForm = await createForm(user.uid, formData);
      setForms((prev) => [newForm, ...prev]);
      toast.success("Form created successfully!");
      return newForm;
    } catch (err) {
      console.error("Error creating form:", err);
      toast.error("Failed to create form");
      throw err;
    }
  };

  // Update form
  const handleUpdateForm = async (formId, updates) => {
    try {
      const updatedForm = await updateForm(formId, updates);
      setForms((prev) =>
        prev.map((form) => (form.id === formId ? updatedForm : form))
      );
      toast.success("Form updated successfully!");
      return updatedForm;
    } catch (err) {
      console.error("Error updating form:", err);
      toast.error("Failed to update form");
      throw err;
    }
  };

  // Delete form
  const handleDeleteForm = async (formId) => {
    try {
      await deleteForm(formId);
      setForms((prev) => prev.filter((form) => form.id !== formId));
      toast.success("Form deleted successfully!");
    } catch (err) {
      console.error("Error deleting form:", err);
      toast.error("Failed to delete form");
      throw err;
    }
  };

  // Duplicate form
  const handleDuplicateForm = async (formId) => {
    try {
      const duplicated = await duplicateForm(formId, user.uid);
      setForms((prev) => [duplicated, ...prev]);
      toast.success("Form duplicated successfully!");
      return duplicated;
    } catch (err) {
      console.error("Error duplicating form:", err);
      toast.error("Failed to duplicate form");
      throw err;
    }
  };

  // Publish form
  const handlePublishForm = async (formId) => {
    try {
      const published = await publishForm(formId);
      setForms((prev) =>
        prev.map((form) => (form.id === formId ? published : form))
      );
      toast.success("Form published successfully!");
      return published;
    } catch (err) {
      console.error("Error publishing form:", err);
      toast.error("Failed to publish form");
      throw err;
    }
  };

  // Archive form
  const handleArchiveForm = async (formId) => {
    try {
      const archived = await archiveForm(formId);
      setForms((prev) =>
        prev.map((form) => (form.id === formId ? archived : form))
      );
      toast.success("Form archived successfully!");
      return archived;
    } catch (err) {
      console.error("Error archiving form:", err);
      toast.error("Failed to archive form");
      throw err;
    }
  };

  return {
    forms,
    loading,
    error,
    stats,
    refetch: fetchForms,
    createForm: handleCreateForm,
    updateForm: handleUpdateForm,
    deleteForm: handleDeleteForm,
    duplicateForm: handleDuplicateForm,
    publishForm: handlePublishForm,
    archiveForm: handleArchiveForm,
  };
}
