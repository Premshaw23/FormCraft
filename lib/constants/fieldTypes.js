// lib/constants/fieldTypes.js

import {
  Type,
  Mail,
  Hash,
  Calendar,
  ChevronDown,
  CheckSquare,
  Circle,
  Star,
  FileUp,
  AlignLeft,
  Heading2,
  Minus,
} from "lucide-react";

export const FIELD_CATEGORIES = {
  TEXT: "text",
  NUMBER: "number",
  CHOICE: "choice",
  DATE: "date",
  FILE: "file",
  LAYOUT: "layout",
};

export const FIELD_TYPES = {
  // Text inputs
  SHORT_TEXT: {
    id: "short_text",
    label: "Short Answer",
    icon: Type,
    category: FIELD_CATEGORIES.TEXT,
    description: "Single line text input",
    defaultConfig: {
      label: "Question",
      placeholder: "Your answer",
      required: false,
      validation: {
        minLength: null,
        maxLength: null,
      },
    },
  },

  LONG_TEXT: {
    id: "long_text",
    label: "Long Answer",
    icon: AlignLeft,
    category: FIELD_CATEGORIES.TEXT,
    description: "Multi-line text area",
    defaultConfig: {
      label: "Question",
      placeholder: "Your detailed answer",
      required: false,
      rows: 4,
      validation: {
        minLength: null,
        maxLength: null,
      },
    },
  },

  EMAIL: {
    id: "email",
    label: "Email",
    icon: Mail,
    category: FIELD_CATEGORIES.TEXT,
    description: "Email address with validation",
    defaultConfig: {
      label: "Email Address",
      placeholder: "example@email.com",
      required: false,
    },
  },

  // Number inputs
  NUMBER: {
    id: "number",
    label: "Number",
    icon: Hash,
    category: FIELD_CATEGORIES.NUMBER,
    description: "Numeric input",
    defaultConfig: {
      label: "Number",
      placeholder: "0",
      required: false,
      validation: {
        min: null,
        max: null,
      },
    },
  },

  RATING: {
    id: "rating",
    label: "Star Rating",
    icon: Star,
    category: FIELD_CATEGORIES.NUMBER,
    description: "1-5 star rating",
    defaultConfig: {
      label: "Rate your experience",
      required: false,
      maxRating: 5,
    },
  },

  // Date inputs
  DATE: {
    id: "date",
    label: "Date",
    icon: Calendar,
    category: FIELD_CATEGORIES.DATE,
    description: "Date picker",
    defaultConfig: {
      label: "Select Date",
      required: false,
    },
  },

  // Choice fields
  MULTIPLE_CHOICE: {
    id: "multiple_choice",
    label: "Multiple Choice",
    icon: Circle,
    category: FIELD_CATEGORIES.CHOICE,
    description: "Single selection from options",
    defaultConfig: {
      label: "Choose one option",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      allowOther: false,
    },
  },

  CHECKBOXES: {
    id: "checkboxes",
    label: "Checkboxes",
    icon: CheckSquare,
    category: FIELD_CATEGORIES.CHOICE,
    description: "Multiple selections allowed",
    defaultConfig: {
      label: "Select all that apply",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      allowOther: false,
    },
  },

  DROPDOWN: {
    id: "dropdown",
    label: "Dropdown",
    icon: ChevronDown,
    category: FIELD_CATEGORIES.CHOICE,
    description: "Dropdown select menu",
    defaultConfig: {
      label: "Select from dropdown",
      placeholder: "Choose an option",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
    },
  },

  // File upload
  FILE_UPLOAD: {
    id: "file_upload",
    label: "File Upload",
    icon: FileUp,
    category: FIELD_CATEGORIES.FILE,
    description: "File upload field",
    defaultConfig: {
      label: "Upload File",
      required: false,
      maxSize: 10, // MB
      allowedTypes: ["image/*", "application/pdf"],
    },
  },

  // Layout elements
  SECTION_HEADING: {
    id: "section_heading",
    label: "Section Heading",
    icon: Heading2,
    category: FIELD_CATEGORIES.LAYOUT,
    description: "Section title",
    defaultConfig: {
      text: "Section Title",
      description: "",
    },
  },

  DIVIDER: {
    id: "divider",
    label: "Divider",
    icon: Minus,
    category: FIELD_CATEGORIES.LAYOUT,
    description: "Horizontal line separator",
    defaultConfig: {},
  },
};

// Helper to get fields by category
export const getFieldsByCategory = (category) => {
  return Object.values(FIELD_TYPES).filter(
    (field) => field.category === category
  );
};

// Helper to get all field types as array
export const getAllFieldTypes = () => {
  return Object.values(FIELD_TYPES);
};

// Helper to get field type by ID
export const getFieldTypeById = (id) => {
  return Object.values(FIELD_TYPES).find((field) => field.id === id);
};
