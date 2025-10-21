// app/f/[id]/page.js - PREMIUM UI VERSION
"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFormById } from "@/lib/services/formService";
import { submitResponse, canUserSubmit } from "@/lib/services/responseService";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
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
    // If there are errors, set focus/scroll to the first error field immediately
    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstErrorField = errorKeys[0];
      // small timeout to ensure DOM updated
      setTimeout(() => {
        document.getElementById(`field-${firstErrorField}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // attempt to focus the first interactive control inside the field
        const fieldEl = document.getElementById(`field-${firstErrorField}`);
        const focusable = fieldEl?.querySelector('input, textarea, select, button');
        focusable?.focus();
      }, 50);
    }

    return errorKeys.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setSubmitting(true);

    try {
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

  // Get theme colors with fallbacks
  const primaryColor = form?.theme?.primaryColor || "#8b5cf6";
  const secondaryColor = form?.theme?.secondaryColor || "#ec4899";
  const backgroundColor = form?.theme?.backgroundColor || "#0f172a";

  if (loading || authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}15 100%)`,
        }}
      >
        <div className="text-center">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                boxShadow: `0 10px 40px ${primaryColor}40`,
              }}
            >
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <p className="text-lg font-medium" style={{ color: primaryColor }}>
            Loading your form...
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`,
        }}
      >
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-red-500/20">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Form Not Found</h1>
          <p className="text-slate-400 mb-8 text-lg">
            This form does not exist or is no longer available.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!canSubmit && !loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}15 100%)`,
        }}
      >
        <div className="text-center max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
              border: `2px solid ${primaryColor}40`,
            }}
          >
            <AlertCircle
              className="w-12 h-12"
              style={{ color: primaryColor }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-slate-300 mb-8 text-lg">{accessMessage}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}15 100%)`,
        }}
      >
        <div className="text-center max-w-lg">
          <div className="relative mb-8">
            <div
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center animate-bounce"
              style={{
                background: `linear-gradient(135deg, #10b981, #059669)`,
                boxShadow: `0 20px 60px #10b98160`,
              }}
            >
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles
                className="w-8 h-8 text-yellow-400 animate-pulse"
                style={{ marginTop: "-80px", marginLeft: "60px" }}
              />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Thank You!
          </h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            {form.settings?.confirmationMessage ||
              "Your response has been submitted successfully. We appreciate your time!"}
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
              className="group px-8 py-4 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              Submit Another Response
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 sm:py-16 px-4"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}10 50%, ${secondaryColor}10 100%)`,
        fontFamily: form.theme?.fontFamily || "Inter, system-ui, sans-serif",
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: primaryColor }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: secondaryColor, animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Premium Header */}
          <div
            className="relative p-8 sm:p-12 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)`,
              borderBottom: `1px solid ${primaryColor}30`,
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: primaryColor }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-20"
              style={{ background: secondaryColor }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-3 h-20 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                />
                <div className="flex-1">
                  <h1
                    className="text-4xl sm:text-5xl font-black mb-3 leading-tight"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {form.title}
                  </h1>
                  {form.description && (
                    <p className="text-slate-200 text-lg leading-relaxed max-w-2xl">
                      {form.description}
                    </p>
                  )}
                </div>
              </div>

              {form.settings?.requireAuth && user && (
                <div
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl border"
                  style={{
                    background: `${primaryColor}15`,
                    borderColor: `${primaryColor}30`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: primaryColor }}
                  />
                  <span className="text-sm text-slate-200">
                    Responding as{" "}
                    <strong
                      className="font-semibold"
                      style={{ color: primaryColor }}
                    >
                      {user.email}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 sm:p-12 space-y-8">
            {form.fields.map((field, index) => (
              <div
                key={field.id}
                id={`field-${field.id}`}
                className="transform transition-all duration-300 hover:scale-[1.01]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FormField
                  field={field}
                  value={formData[field.id]}
                  error={errors[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  onCheckboxChange={(option, checked) =>
                    handleCheckboxChange(field.id, option, checked)
                  }
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </div>
            ))}

            {/* Premium Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="group w-full py-5 px-8 rounded-2xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-3">
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {form.settings?.submitButtonText || "Submit Response"}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Footer Badge */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Powered by{" "}
            <span className="font-semibold" style={{ color: primaryColor }}>
              FormCraft
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({
  field,
  value,
  error,
  onChange,
  onCheckboxChange,
  primaryColor,
  secondaryColor,
}) {
  if (field.type === "section_heading") {
    return (
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-1 h-12 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`,
            }}
          />
          <h3 className="text-3xl font-bold text-white">
            {field.text || "Section Heading"}
          </h3>
        </div>
        {field.description && (
          <p
            className="text-slate-300 text-lg ml-5 pl-4 border-l-2"
            style={{ borderColor: `${primaryColor}40` }}
          >
            {field.description}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "divider") {
    return (
      <div className="relative py-6">
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${primaryColor}60, transparent)`,
          }}
        />
      </div>
    );
  }

  if (field.type === "description_text") {
    return (
      <div
        className="p-6 rounded-2xl backdrop-blur-xl border"
        style={{
          background: `${primaryColor}08`,
          borderColor: `${primaryColor}20`,
        }}
      >
        <p className="text-slate-200 leading-relaxed text-lg">
          {field.text || field.description || ""}
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 sm:p-8 rounded-2xl backdrop-blur-xl border transition-all hover:border-opacity-60"
      style={{
        background: `${primaryColor}10`,
        borderColor: error ? "#ef4444" : `${primaryColor}20`,
      }}
    >
      <label className="text-white font-bold mb-4 text-lg flex items-center gap-2">
        <span>{field.label}</span>
        {field.required && (
          <span
            className="text-sm px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${primaryColor}/30`, color: primaryColor }}
          >
            Required
          </span>
        )}
      </label>

      {renderFieldInput(
        field,
        value,
        onChange,
        onCheckboxChange,
        primaryColor,
        secondaryColor
      )}

      {field.helpText && (
        <p className="text-sm text-slate-400 mt-3 flex items-center gap-2">
          <span className="text-lg">💡</span>
          {field.helpText}
        </p>
      )}

      {error && (
        <div
          className="mt-4 p-3 rounded-xl flex items-center gap-2"
          style={{ background: "#ef444415", border: "1px solid #ef444430" }}
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

function renderFieldInput(
  field,
  value,
  onChange,
  onCheckboxChange,
  primaryColor,
  secondaryColor
) {
  const inputBaseClass =
    "w-full px-5 py-4 bg-white/10 text-white border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-slate-400 font-medium";

  const focusStyle = {
    borderColor: `${primaryColor}60`,
    boxShadow: `0 0 0 4px ${primaryColor}15`,
  };

  switch (field.type) {
    case "short_text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "Type your answer..."}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30` }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "long_text":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "Type your detailed answer..."}
          rows={field.rows || 5}
          className={`${inputBaseClass} resize-none`}
          style={{ borderColor: `${primaryColor}30` }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "email":
      return (
        <input
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "your.email@example.com"}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30` }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "phone":
      return (
        <input
          type="tel"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "+1 (555) 123-4567"}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30` }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "url":
      return (
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "https://example.com"}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30` }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "Enter a number"}
          min={field.validation?.min}
          max={field.validation?.max}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30` }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30`, colorScheme: "dark" }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "time":
      return (
        <input
          type="time"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputBaseClass}
          style={{ borderColor: `${primaryColor}30`, colorScheme: "dark" }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => (e.target.style.borderColor = `${primaryColor}30`)}
        />
      );

    case "rating":
      return (
        <div className="flex gap-3" role="radiogroup" aria-label={field.label}>
          {[...Array(field.maxRating || 5)].map((_, i) => {
            const filled = value > i;
            return (
              <button
                key={i}
                type="button"
                aria-pressed={filled}
                onClick={() => onChange(i + 1)}
                className="md:text-5xl text-2xl transition-all hover:scale-125 focus:scale-125 active:scale-110"
                style={{
                  color: filled ? primaryColor : "#475569",
                  filter: filled
                    ? `drop-shadow(0 0 8px ${primaryColor}80)`
                    : "none",
                }}
              >
                ★
              </button>
            );
          })}
        </div>
      );

    case "scale":
      const min = field.validation?.min || 1;
      const max = field.validation?.max || 10;
      return (
        <div className="space-y-6">
          <div className="relative pt-2">
            <input
              type="range"
              min={min}
              max={max}
              value={value || min}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: primaryColor,
              }}
            />
            <div
              className="absolute top-0 h-3 rounded-full pointer-events-none transition-all"
              style={{
                width: `${(((value || min) - min) / (max - min)) * 100}%`,
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-lg font-semibold">{min}</span>
            <div
              className="px-6 py-3 rounded-2xl font-black text-3xl"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                color: "white",
                boxShadow: `0 8px 24px ${primaryColor}40`,
              }}
            >
              {value || min}
            </div>
            <span className="text-slate-400 text-lg font-semibold">{max}</span>
          </div>
        </div>
      );

    case "multiple_choice":
      return (
        <div className="space-y-3">
          {field.options?.map((option, idx) => {
            const id = `radio-${field.id}-${option}`;
            const isSelected = value === option;
            return (
              <label
                key={option}
                htmlFor={id}
                className="group flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] border-2"
                style={{
                  background: isSelected
                    ? `${primaryColor}15`
                    : "rgba(255,255,255,0.05)",
                  borderColor: isSelected
                    ? primaryColor
                    : "rgba(255,255,255,0.1)",
                  boxShadow: isSelected
                    ? `0 8px 24px ${primaryColor}30`
                    : "none",
                }}
              >
                <div className="relative flex-shrink-0">
                  <input
                    id={id}
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={isSelected}
                    onChange={(e) => onChange(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isSelected ? primaryColor : "#64748b",
                      background: isSelected ? primaryColor : "transparent",
                    }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <span className="flex-1 text-white font-medium text-lg">
                  {option}
                </span>
                {isSelected && (
                  <CheckCircle2
                    className="w-5 h-5"
                    style={{ color: primaryColor }}
                  />
                )}
              </label>
            );
          })}
        </div>
      );

    case "checkboxes":
      return (
        <div className="space-y-3">
          {field.options?.map((option) => {
            const id = `chk-${field.id}-${option}`;
            const isChecked = (value || []).includes(option);
            return (
              <label
                key={option}
                htmlFor={id}
                className="group flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] border-2"
                style={{
                  background: isChecked
                    ? `${primaryColor}15`
                    : "rgba(255,255,255,0.05)",
                  borderColor: isChecked
                    ? primaryColor
                    : "rgba(255,255,255,0.1)",
                  boxShadow: isChecked
                    ? `0 8px 24px ${primaryColor}30`
                    : "none",
                }}
              >
                <div className="relative flex-shrink-0">
                  <input
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onCheckboxChange(option, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isChecked ? primaryColor : "#64748b",
                      background: isChecked ? primaryColor : "transparent",
                    }}
                  >
                    {isChecked && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="flex-1 text-white font-medium text-lg">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      );

    case "dropdown":
      return (
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputBaseClass} appearance-none cursor-pointer`}
            style={{
              borderColor: `${primaryColor}30`,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent(
                primaryColor
              )}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.5rem",
              paddingRight: "3rem",
            }}
          >
            <option value="" disabled className="bg-slate-800">
              {field.placeholder || "Select an option"}
            </option>
            {field.options?.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-slate-800 text-white py-2"
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "file_upload":
      return (
        <div
          className="relative border-3 border-dashed rounded-2xl p-10 text-center transition-all hover:border-opacity-80 cursor-pointer group"
          style={{
            borderColor: `${primaryColor}40`,
            background: `${primaryColor}05`,
          }}
        >
          <input
            type="file"
            onChange={(e) => onChange(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id={`file-${field.id}`}
            accept={field.allowedTypes?.join(",")}
          />
          <label htmlFor={`file-${field.id}`} className="cursor-pointer">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <span className="text-4xl">📁</span>
            </div>
            <p className="text-white font-bold text-lg mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-slate-400 text-sm mb-4">
              {field.allowedTypes?.join(", ").toUpperCase() || "All file types"}{" "}
              • Max size: {field.maxSize || 10}MB
            </p>
            {value && (
              <div
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full mt-2"
                style={{
                  background: `${primaryColor}20`,
                  border: `1px solid ${primaryColor}40`,
                }}
              >
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: primaryColor }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: primaryColor }}
                >
                  {value.name || value}
                </span>
              </div>
            )}
          </label>
        </div>
      );

    default:
      return null;
  }
}
