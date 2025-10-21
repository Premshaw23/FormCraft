// components/form-fill/FormFillField.jsx - COMPLETE WITH ALL FIELD TYPES
import React from "react";
import {
  Mail,
  Phone,
  Link as LinkIcon,
  Calendar,
  Clock,
  Star,
  Upload,
  ChevronDown,
  Minus,
} from "lucide-react";

/**
 * Main component that renders the appropriate field based on type
 */
const FormFillField = ({ field, value, onChange, error, theme }) => {
  // Layout elements don't need labels or error handling
  const isLayoutElement = [
    "section-heading",
    "description-text",
    "divider",
  ].includes(field.type);

  const renderField = () => {
    switch (field.type) {
      case "short_text":
        return (
          <ShortTextInput field={field} value={value} onChange={onChange} />
        );

      case "long_text":
        return (
          <LongTextInput field={field} value={value} onChange={onChange} />
        );

      case "email":
        return <EmailInput field={field} value={value} onChange={onChange} />;

      case "phone":
        return <PhoneInput field={field} value={value} onChange={onChange} />;

      case "url":
        return <URLInput field={field} value={value} onChange={onChange} />;

      case "number":
        return <NumberInput field={field} value={value} onChange={onChange} />;

      case "date":
        return <DateInput field={field} value={value} onChange={onChange} />;

      case "time":
        return <TimeInput field={field} value={value} onChange={onChange} />;

      case "multiple_choice":
        return (
          <MultipleChoice field={field} value={value} onChange={onChange} />
        );

      case "checkboxes":
        return <Checkboxes field={field} value={value} onChange={onChange} />;

      case "dropdown":
        return <Dropdown field={field} value={value} onChange={onChange} />;

      case "rating":
        return <Rating field={field} value={value} onChange={onChange} />;

      case "scale":
        return <Scale field={field} value={value} onChange={onChange} />;

      case "file_upload":
        return <FileUpload field={field} value={value} onChange={onChange} />;

      // Layout elements
      case "section_heading":
        return <SectionHeading field={field} />;

      case "description_text":
        return <DescriptionText field={field} />;

      case "divider":
        return <Divider />;

      default:
        return (
          <p className="text-gray-500">Unsupported field type: {field.type}</p>
        );
    }
  };

  // For layout elements, render directly without wrapper
  if (isLayoutElement) {
    return <div className="mb-6">{renderField()}</div>;
  }

  // For input fields, render with label and error (Google Forms-like)
  return (
    <div className="mb-6">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-900 font-medium text-base">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</div>
            {field.helpText && <div className="text-sm text-slate-500 mt-1">{field.helpText}</div>}
          </div>
        </div>
      </div>

      {/* Field Input */}
      <div>{renderField()}</div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">{error}</p>
      )}
    </div>
  );
};

// ===== LAYOUT ELEMENTS =====

const SectionHeading = ({ field }) => (
  <div className="pt-4 pb-2">
    <h3 className="text-2xl font-bold text-white mb-2">{field.label}</h3>
    {field.helpText && <p className="text-gray-400">{field.helpText}</p>}
  </div>
);

const DescriptionText = ({ field }) => (
  <div className="py-2">
    <p className="text-gray-300 leading-relaxed">{field.label}</p>
  </div>
);

const Divider = () => (
  <div className="py-4">
    <div className="border-t border-white/10"></div>
  </div>
);

// ===== TEXT INPUTS =====

const ShortTextInput = ({ field, value, onChange }) => (
  <input
    type="text"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder}
    className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900 placeholder-slate-400"
    maxLength={field.validation?.maxLength}
  />
);

const LongTextInput = ({ field, value, onChange }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder}
    rows={4}
    className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900 placeholder-slate-400 resize-none"
    maxLength={field.validation?.maxLength}
  />
);

const EmailInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="email"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "email@example.com"}
      className="w-full pl-6 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900 placeholder-slate-400"
    />
  </div>
);

const PhoneInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="tel"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "+1 (555) 123-4567"}
      className="w-full pl-6 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900 placeholder-slate-400"
    />
  </div>
);

const URLInput = ({ field, value, onChange }) => (
  <div className="relative">
    <LinkIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="url"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "https://example.com"}
      className="w-full pl-6 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900 placeholder-slate-400"
    />
  </div>
);

const NumberInput = ({ field, value, onChange }) => (
  <input
    type="number"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder}
    min={field.validation?.min}
    max={field.validation?.max}
    className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900 placeholder-slate-400"
  />
);

// ===== DATE & TIME =====

const DateInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-6 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900"
    />
  </div>
);

const TimeInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Clock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-6 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900"
    />
  </div>
);

// ===== CHOICE FIELDS =====

const MultipleChoice = ({ field, value, onChange }) => (
  <div className="space-y-2">
    {field.options?.map((option, idx) => {
      const id = `radio-${field.id}-${idx}`;
      return (
        <div key={option} className="flex items-center gap-3 py-2">
          <input
            id={id}
            type="radio"
            name={field.id}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-slate-700"
          />
          <label htmlFor={id} className="flex-1 text-slate-800 cursor-pointer">{option}</label>
        </div>
      );
    })}
  </div>
);

const Checkboxes = ({ field, value, onChange }) => {
  const selectedValues = value || [];

  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      {field.options?.map((option, idx) => {
        const id = `chk-${field.id}-${idx}`;
        return (
          <div key={option} className="flex items-center gap-3 py-2">
            <input
              id={id}
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-4 h-4"
            />
            <label htmlFor={id} className="flex-1 text-slate-800 cursor-pointer">{option}</label>
          </div>
        );
      })}
    </div>
  );
};

const Dropdown = ({ field, value, onChange }) => (
  <div className="relative">
    <select
      aria-label={field.label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-slate-400 focus:outline-none text-slate-900"
    >
      <option value="">{field.placeholder || "Select an option..."}</option>
      {field.options?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// ===== RATING & SCALE =====

const Rating = ({ field, value, onChange }) => {
  const maxRating = field.validation?.max || 5;

  return (
    <div className="flex gap-2" role="radiogroup" aria-label={field.label}>
      {[...Array(maxRating)].map((_, idx) => {
        const filled = value && idx < value;
        return (
          <button
            key={idx}
            type="button"
            aria-pressed={filled}
            aria-label={`${idx + 1} star${idx > 0 ? "s" : ""}`}
            onClick={() => onChange(idx + 1)}
            className={`text-xl ${filled ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

const Scale = ({ field, value, onChange }) => {
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
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer 
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 
                   [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-purple-500 
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-sm text-gray-400">
        <span>{min}</span>
        <span className="text-xl font-bold text-purple-400">
          {value || min}
        </span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// ===== FILE UPLOAD =====

const FileUpload = ({ field, value, onChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file.name);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept={field.validation?.acceptedTypes}
        className="hidden"
        id={`file-${field.id}`}
      />
      <label htmlFor={`file-${field.id}`} className="inline-block text-slate-700 underline cursor-pointer">
        {value ? `File selected: ${value}` : "Upload a file"}
      </label>
    </div>
  );
};

export default FormFillField;
