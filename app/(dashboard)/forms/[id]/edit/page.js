// app/(dashboard)/forms/[id]/edit/page.js - FIXED VERSION (No Errors)
"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
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

  // Refs for debouncing
  const saveTimeoutRef = useRef(null);
  const pendingChangesRef = useRef(null);

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

        // Check if user owns this form
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

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && formId) {
      loadForm();
    } else if (!authLoading && !user) {
      toast.error("Please log in to edit forms");
      router.push("/login");
    }
  }, [formId, user, authLoading, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Save any pending changes before unmounting
      if (pendingChangesRef.current) {
        updateForm(formId, {
          ...pendingChangesRef.current,
          updatedAt: new Date(),
        }).catch(console.error);
      }
    };
  }, [formId]);

  // Immediate save function (for Firestore)
  const saveToFirestore = useCallback(
    async (updates) => {
      try {
        await updateForm(formId, {
          ...updates,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
        pendingChangesRef.current = null;
      } catch (error) {
        console.error("Error saving form:", error);
        toast.error("Failed to save changes");
      } finally {
        setSaving(false);
      }
    },
    [formId]
  );

  // Debounced save function
  const debouncedSave = useCallback(
    (updates) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Store pending changes
      pendingChangesRef.current = {
        ...pendingChangesRef.current,
        ...updates,
      };

      setSaving(true);

      // Set new timeout for 1.5 seconds
      saveTimeoutRef.current = setTimeout(() => {
        saveToFirestore(pendingChangesRef.current);
      }, 1500);
    },
    [saveToFirestore]
  );

  // Update form immediately in state, debounce Firestore save
  const handleSave = useCallback(
    (updates) => {
      // Update local state immediately for instant UI feedback
      setForm((prev) => ({ ...prev, ...updates }));

      // Debounce the Firestore save
      debouncedSave(updates);
    },
    [debouncedSave]
  );

  // Update form field
  const handleUpdateField = useCallback(
    (fieldId, updates) => {
      setForm((prev) => {
        if (!prev) return prev;

        const updatedFields = prev.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        );

        // Debounce save for field updates
        debouncedSave({ fields: updatedFields });

        return { ...prev, fields: updatedFields };
      });
    },
    [debouncedSave]
  );

  // Add new field (immediate save - not debounced)
  const handleAddField = useCallback(
    async (fieldType) => {
      if (!form) return;

      const newField = {
        id: `field_${Date.now()}`,
        type: fieldType.id,
        ...fieldType.defaultConfig,
      };

      const updatedFields = [...form.fields, newField];

      // Update UI immediately
      setForm((prev) => ({ ...prev, fields: updatedFields }));

      // Save immediately (don't debounce for adding fields)
      setSaving(true);
      try {
        await updateForm(formId, {
          fields: updatedFields,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
        toast.success(`${fieldType.label} added`);
      } catch (error) {
        console.error("Error adding field:", error);
        toast.error("Failed to add field");
      } finally {
        setSaving(false);
      }
    },
    [form, formId]
  );

  // Delete field (immediate save)
  const handleDeleteField = useCallback(
    async (fieldId) => {
      if (!form) return;

      const updatedFields = form.fields.filter((field) => field.id !== fieldId);

      setForm((prev) => ({ ...prev, fields: updatedFields }));

      setSaving(true);
      try {
        await updateForm(formId, {
          fields: updatedFields,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
        toast.success("Field deleted");
      } catch (error) {
        console.error("Error deleting field:", error);
        toast.error("Failed to delete field");
      } finally {
        setSaving(false);
      }
    },
    [form, formId]
  );

  // Duplicate field (immediate save)
  const handleDuplicateField = useCallback(
    async (fieldId) => {
      if (!form) return;

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

      setForm((prev) => ({ ...prev, fields: updatedFields }));

      setSaving(true);
      try {
        await updateForm(formId, {
          fields: updatedFields,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
        toast.success("Field duplicated");
      } catch (error) {
        console.error("Error duplicating field:", error);
        toast.error("Failed to duplicate field");
      } finally {
        setSaving(false);
      }
    },
    [form, formId]
  );

  // Reorder fields (immediate save)
  const handleReorderFields = useCallback(
    async (startIndex, endIndex) => {
      if (!form) return;

      const result = Array.from(form.fields);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      setForm((prev) => ({ ...prev, fields: result }));

      setSaving(true);
      try {
        await updateForm(formId, {
          fields: result,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error reordering fields:", error);
        toast.error("Failed to reorder fields");
      } finally {
        setSaving(false);
      }
    },
    [form, formId]
  );

  // Update form metadata (debounced for text inputs)
  const handleUpdateMetadata = useCallback(
    (updates) => {
      handleSave(updates);
    },
    [handleSave]
  );

  // Update form settings (immediate save)
  const handleUpdateSettings = useCallback(
    async (settings) => {
      setForm((prev) => ({ ...prev, settings }));

      setSaving(true);
      try {
        await updateForm(formId, {
          settings,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error updating settings:", error);
        toast.error("Failed to update settings");
      } finally {
        setSaving(false);
      }
    },
    [formId]
  );

  // Update form theme (immediate save)
  const handleUpdateTheme = useCallback(
    async (theme) => {
      setForm((prev) => ({ ...prev, theme }));

      setSaving(true);
      try {
        await updateForm(formId, {
          theme,
          updatedAt: new Date(),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error updating theme:", error);
        toast.error("Failed to update theme");
      } finally {
        setSaving(false);
      }
    },
    [formId]
  );

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
