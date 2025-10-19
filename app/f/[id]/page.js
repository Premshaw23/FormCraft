// app/f/[id]/page.js - FIXED VERSION
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFormById } from "@/lib/services/formService";
import { submitResponse, canUserSubmit } from "@/lib/services/responseService";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function FormFillPage({ params }) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(true);
  const [accessMessage, setAccessMessage] = useState("");

  // Load form data
  useEffect(() => {
    const loadForm = async () => {
      try {
        const formData = await getFormById(formId);

        if (!formData) {
          toast.error("Form not found");
          return;
        }

        if (formData.status !== "published") {
          toast.error("This form is not accepting responses");
          return;
        }

        setForm(formData);

        // Initialize form data
        const initialData = {};
        formData.fields.forEach((field) => {
          if (field.type === "checkboxes") {
            initialData[field.id] = [];
          } else {
            initialData[field.id] = "";
          }
        });
        setFormData(initialData);
      } catch (error) {
        console.error("Error loading form:", error);
        toast.error("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    if (formId && !authLoading) {
      loadForm();
    }
  }, [formId, authLoading]);

  // Check access permissions
  useEffect(() => {
    const checkAccess = async () => {
      if (!form || authLoading) return;

      const permission = await canUserSubmit(
        formId,
        user?.uid,
        form.settings || {}
      );

      setCanSubmit(permission.canSubmit);
      if (!permission.canSubmit) {
        setAccessMessage(permission.reason);
      }
    };

    checkAccess();
  }, [form, user, formId, authLoading]);

  // Check if user needs to be authenticated
  useEffect(() => {
    if (!authLoading && form) {
      if (form.settings?.requireAuth && !user) {
        toast.error("Please sign in to fill this form");
        router.push(`/auth?redirect=/f/${formId}`);
      }
    }
  }, [form, user, authLoading, formId, router]);

  const handleFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...currentValues, option] };
      } else {
        return {
          ...prev,
          [fieldId]: currentValues.filter((v) => v !== option),
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const layoutFields = ["section_heading", "divider", "description_text"];

    form.fields.forEach((field) => {
      if (layoutFields.includes(field.type)) return;

      const value = formData[field.id];

      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = "This field is required";
          return;
        }
      }

      if (!value || (Array.isArray(value) && value.length === 0)) return;

      if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = "Please enter a valid email address";
        }
      }

      if (field.type === "url") {
        try {
          new URL(value);
        } catch {
          newErrors[field.id] = "Please enter a valid URL";
        }
      }

      if (field.type === "number") {
        const num = Number(value);
        if (isNaN(num)) {
          newErrors[field.id] = "Please enter a valid number";
        }
        if (
          field.validation?.min !== undefined &&
          field.validation?.min !== null &&
          num < field.validation.min
        ) {
          newErrors[field.id] = `Minimum value is ${field.validation.min}`;
        }
        if (
          field.validation?.max !== undefined &&
          field.validation?.max !== null &&
          num > field.validation.max
        ) {
          newErrors[field.id] = `Maximum value is ${field.validation.max}`;
        }
      }

      if (field.type === "short_text" || field.type === "long_text") {
        if (
          field.validation?.minLength &&
          value.length < field.validation.minLength
        ) {
          newErrors[
            field.id
          ] = `Minimum length is ${field.validation.minLength} characters`;
        }
        if (
          field.validation?.maxLength &&
          value.length > field.validation.maxLength
        ) {
          newErrors[
            field.id
          ] = `Maximum length is ${field.validation.maxLength} characters`;
        }
      }

      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          newErrors[field.id] =
            field.validation.errorMessage || "Invalid format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(`field-${firstErrorField}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSubmitting(true);

    try {
      // FIXED: Correct function signature
      await submitResponse(formId, user?.uid || "anonymous", formData, {
        userEmail: user?.email || null,
        userName: user?.displayName || "Anonymous",
        formTitle: form.title,
      });

      setSubmitted(true);
      toast.success("Response submitted successfully! 🎉");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Form Not Found</h1>
          <p className="text-slate-300 mb-6">
            This form does not exist or is no longer available.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // ADDED: Access denied check
  if (!canSubmit && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-300 mb-6">{accessMessage}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
          <p className="text-lg text-slate-300 mb-8">
            {form.settings?.confirmationMessage ||
              "Your response has been submitted successfully."}
          </p>

          {form.settings?.allowMultipleResponses && (
            <button
              onClick={() => {
                setSubmitted(false);
                const initialData = {};
                form.fields.forEach((field) => {
                  if (field.type === "checkboxes") {
                    initialData[field.id] = [];
                  } else {
                    initialData[field.id] = "";
                  }
                });
                setFormData(initialData);
              }}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Submit Another Response
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        backgroundColor: form.theme?.backgroundColor || "#f3f4f6",
        fontFamily: form.theme?.fontFamily || "Inter",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div
            className="p-8 border-b"
            style={{
              borderColor: `${form.theme?.primaryColor || "#8b5cf6"}20`,
            }}
          >
            <h1
              className="text-4xl font-bold mb-3"
              style={{ color: form.theme?.primaryColor || "#8b5cf6" }}
            >
              {form.title}
            </h1>
            {form.description && (
              <p className="text-gray-600 text-lg">{form.description}</p>
            )}
            {form.settings?.requireAuth && user && (
              <div className="mt-4 text-sm text-gray-500">
                Responding as <strong>{user.email}</strong>
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} id={`field-${field.id}`}>
                <FormField
                  field={field}
                  value={formData[field.id]}
                  error={errors[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  onCheckboxChange={(option, checked) =>
                    handleCheckboxChange(field.id, option, checked)
                  }
                  theme={form.theme}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: form.theme?.primaryColor || "#8b5cf6" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                form.settings?.submitButtonText || "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ field, value, error, onChange, onCheckboxChange, theme }) {
  const primaryColor = theme?.primaryColor || "#8b5cf6";

  if (field.type === "section_heading") {
    return (
      <div className="pt-4">
        <h3 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
          {field.text || "Section Heading"}
        </h3>
        {field.description && (
          <p className="text-gray-600">{field.description}</p>
        )}
      </div>
    );
  }

  if (field.type === "divider") {
    return <hr className="border-gray-300 my-6" />;
  }

  if (field.type === "description_text") {
    return (
      <p className="text-gray-600 leading-relaxed">
        {field.text || field.description || ""}
      </p>
    );
  }

  return (
    <div>
      <label className="block text-gray-800 font-semibold mb-2 text-base">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderFieldInput(field, value, onChange, onCheckboxChange, primaryColor)}

      {field.helpText && (
        <p className="text-sm text-gray-500 mt-2">{field.helpText}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

function renderFieldInput(
  field,
  value,
  onChange,
  onCheckboxChange,
  primaryColor
) {
  switch (field.type) {
    case "short_text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "long_text":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "email":
      return (
        <input
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "phone":
      return (
        <input
          type="tel"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "+1 (555) 123-4567"}
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "url":
      return (
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "https://example.com"}
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          min={field.validation?.min}
          max={field.validation?.max}
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "time":
      return (
        <input
          type="time"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        />
      );

    case "rating":
      return (
        <div className="flex gap-2">
          {[...Array(field.maxRating || 5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              className="text-4xl transition-all hover:scale-110"
              style={{ color: value > i ? primaryColor : "#d1d5db" }}
            >
              ★
            </button>
          ))}
        </div>
      );

    case "scale":
      const min = field.validation?.min || 1;
      const max = field.validation?.max || 10;
      return (
        <div className="space-y-4">
          <input
            type="range"
            min={min}
            max={max}
            value={value || min}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: primaryColor }}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{min}</span>
            <span className="text-xl font-bold" style={{ color: primaryColor }}>
              {value || min}
            </span>
            <span>{max}</span>
          </div>
        </div>
      );

    case "multiple_choice":
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      );

    case "checkboxes":
      return (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={(value || []).includes(option)}
                onChange={(e) => onCheckboxChange(option, e.target.checked)}
                className="w-5 h-5 rounded"
                style={{ accentColor: primaryColor }}
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      );

    case "dropdown":
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": primaryColor }}
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {field.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "file_upload":
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            onChange={(e) => onChange(e.target.files[0])}
            className="hidden"
            id={`file-${field.id}`}
            accept={field.allowedTypes?.join(",")}
          />
          <label htmlFor={`file-${field.id}`} className="cursor-pointer">
            <div className="text-5xl mb-3">📁</div>
            <p className="text-gray-600 font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-400">Max size: {field.maxSize}MB</p>
            {value && (
              <p className="text-sm text-green-600 mt-2">
                File selected: {value.name}
              </p>
            )}
          </label>
        </div>
      );

    default:
      return null;
  }
}
