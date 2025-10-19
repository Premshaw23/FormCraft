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

  // For input fields, render with label and error
  return (
    <div className="mb-6">
      {/* Field Label */}
      <label className="block mb-2">
        <span className="text-base font-medium text-gray-200">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </span>
        {field.helpText && (
          <span className="block text-sm text-gray-400 mt-1">
            {field.helpText}
          </span>
        )}
      </label>

      {/* Field Input */}
      {renderField()}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
          {error}
        </p>
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
    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
               text-white placeholder-gray-500 transition-all"
    maxLength={field.validation?.maxLength}
  />
);

const LongTextInput = ({ field, value, onChange }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder}
    rows={4}
    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
               text-white placeholder-gray-500 transition-all resize-none"
    maxLength={field.validation?.maxLength}
  />
);

const EmailInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="email"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "email@example.com"}
      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white placeholder-gray-500 transition-all"
    />
  </div>
);

const PhoneInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="tel"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "+1 (555) 123-4567"}
      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white placeholder-gray-500 transition-all"
    />
  </div>
);

const URLInput = ({ field, value, onChange }) => (
  <div className="relative">
    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="url"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "https://example.com"}
      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white placeholder-gray-500 transition-all"
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
    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
               text-white placeholder-gray-500 transition-all"
  />
);

// ===== DATE & TIME =====

const DateInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white transition-all"
    />
  </div>
);

const TimeInput = ({ field, value, onChange }) => (
  <div className="relative">
    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white transition-all"
    />
  </div>
);

// ===== CHOICE FIELDS =====

const MultipleChoice = ({ field, value, onChange }) => (
  <div className="space-y-3">
    {field.options?.map((option, idx) => (
      <label
        key={idx}
        className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg 
                   hover:bg-white/10 cursor-pointer transition-all group"
      >
        <input
          type="radio"
          name={field.id}
          value={option}
          checked={value === option}
          onChange={(e) => onChange(e.target.value)}
          className="w-4 h-4 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
        />
        <span className="text-gray-200 group-hover:text-white transition-colors">
          {option}
        </span>
      </label>
    ))}
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
    <div className="space-y-3">
      {field.options?.map((option, idx) => (
        <label
          key={idx}
          className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg 
                     hover:bg-white/10 cursor-pointer transition-all group"
        >
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onChange={() => handleToggle(option)}
            className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 focus:ring-offset-0"
          />
          <span className="text-gray-200 group-hover:text-white transition-colors">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

const Dropdown = ({ field, value, onChange }) => (
  <div className="relative">
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 text-white appearance-none cursor-pointer transition-all"
    >
      <option value="" className="bg-slate-800">
        Select an option...
      </option>
      {field.options?.map((option, idx) => (
        <option key={idx} value={option} className="bg-slate-800">
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

// ===== RATING & SCALE =====

const Rating = ({ field, value, onChange }) => {
  const maxRating = field.validation?.max || 5;

  return (
    <div className="flex gap-2">
      {[...Array(maxRating)].map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onChange(idx + 1)}
          className="transition-all hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              value && idx < value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600 hover:text-yellow-400"
            }`}
          />
        </button>
      ))}
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
      // For now, just store file name. You'll need Firebase Storage for actual uploads
      onChange(file.name);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileChange}
        accept={field.validation?.acceptedTypes}
        className="hidden"
        id={`file-${field.id}`}
      />
      <label
        htmlFor={`file-${field.id}`}
        className="flex items-center justify-center gap-3 px-4 py-6 bg-white/5 
                   border-2 border-dashed border-white/20 rounded-lg hover:bg-white/10 
                   hover:border-purple-500 cursor-pointer transition-all group"
      >
        <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
        <span className="text-gray-400 group-hover:text-white">
          {value || "Click to upload file"}
        </span>
      </label>
    </div>
  );
};

export default FormFillField;
