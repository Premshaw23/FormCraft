// app/(dashboard)/forms/[id]/edit/page.js
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFormById, updateForm } from "@/lib/services/formService";
import FormBuilderLayout from "@/components/form-builder/FormBuilderLayout";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function FormEditPage({ params }) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load form data
  useEffect(() => {
    const loadForm = async () => {
      if (!user?.uid) {
        console.log("No user found, waiting...");
        return;
      }

      try {
        console.log("Loading form:", formId, "for user:", user.uid);
        const formData = await getFormById(formId);

        if (!formData) {
          toast.error("Form not found");
          router.push("/dashboard");
          return;
        }

        // Check if user owns this form (check both userId and creatorId)
        if (formData.userId !== user.uid && formData.creatorId !== user.uid) {
          console.error(
            "Permission denied. Form user:",
            formData.userId,
            "Current user:",
            user.uid
          );
          toast.error("You do not have permission to edit this form");
          router.push("/dashboard");
          return;
        }

        console.log("Form loaded successfully:", formData);
        setForm(formData);
      } catch (error) {
        console.error("Error loading form:", error);

        // Check if it's a permissions error
        if (
          error.message.includes("permissions") ||
          error.message.includes("Missing or insufficient")
        ) {
          toast.error(
            "Permission denied. Please check your Firestore security rules."
          );
        } else {
          toast.error("Failed to load form");
        }

        // Redirect to dashboard after error
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    // Wait for auth to be ready
    if (!authLoading && user && formId) {
      loadForm();
    } else if (!authLoading && !user) {
      // No user logged in
      toast.error("Please log in to edit forms");
      router.push("/login");
    }
  }, [formId, user, authLoading, router]);

  // Auto-save function
  const handleSave = async (updates) => {
    setSaving(true);

    try {
      await updateForm(formId, {
        ...updates,
        updatedAt: new Date(),
      });

      setForm((prev) => ({ ...prev, ...updates }));
      setLastSaved(new Date());

      // Don't show toast for every autosave to avoid spam
      // toast.success('Saved');
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Update form field
  const handleUpdateField = (fieldId, updates) => {
    const updatedFields = form.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    handleSave({ fields: updatedFields });
  };

  // Add new field
  const handleAddField = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType.id,
      ...fieldType.defaultConfig,
    };

    const updatedFields = [...form.fields, newField];
    handleSave({ fields: updatedFields });

    toast.success(`${fieldType.label} added`);
  };

  // Delete field
  const handleDeleteField = (fieldId) => {
    const updatedFields = form.fields.filter((field) => field.id !== fieldId);
    handleSave({ fields: updatedFields });
    toast.success("Field deleted");
  };

  // Duplicate field
  const handleDuplicateField = (fieldId) => {
    const fieldToDuplicate = form.fields.find((f) => f.id === fieldId);
    if (!fieldToDuplicate) return;

    const duplicatedField = {
      ...fieldToDuplicate,
      id: `field_${Date.now()}`,
      label: `${fieldToDuplicate.label} (Copy)`,
    };

    const fieldIndex = form.fields.findIndex((f) => f.id === fieldId);
    const updatedFields = [
      ...form.fields.slice(0, fieldIndex + 1),
      duplicatedField,
      ...form.fields.slice(fieldIndex + 1),
    ];

    handleSave({ fields: updatedFields });
    toast.success("Field duplicated");
  };

  // Reorder fields
  const handleReorderFields = (startIndex, endIndex) => {
    const result = Array.from(form.fields);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    handleSave({ fields: result });
  };

  // Update form metadata
  const handleUpdateMetadata = (updates) => {
    handleSave(updates);
  };

  // Update form settings
  const handleUpdateSettings = (settings) => {
    handleSave({ settings });
  };

  // Update form theme
  const handleUpdateTheme = (theme) => {
    handleSave({ theme });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading form builder...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <FormBuilderLayout
      form={form}
      saving={saving}
      lastSaved={lastSaved}
      onAddField={handleAddField}
      onUpdateField={handleUpdateField}
      onDeleteField={handleDeleteField}
      onDuplicateField={handleDuplicateField}
      onReorderFields={handleReorderFields}
      onUpdateMetadata={handleUpdateMetadata}
      onUpdateSettings={handleUpdateSettings}
      onUpdateTheme={handleUpdateTheme}
    />
  );
}
