import { useState } from "react";
import {
  Save,
  Eye,
  Settings as SettingsIcon,
  Share2,
  Type,
  Mail,
  Phone,
  MessageSquare,
  CheckSquare,
  Circle,
  ChevronDown,
  Star,
  Calendar,
  Upload,
  Hash,
  Link,
  Image as ImageIcon,
  AlignLeft,
  Trash2,
  Copy,
  GripVertical,
  Plus,
} from "lucide-react";

export default function UpdateFormContent() {
  const [formTitle, setFormTitle] = useState("Customer Feedback Survey");
  const [formDescription, setFormDescription] = useState(
    "Help us improve by sharing your thoughts"
  );
  const [fields, setFields] = useState([
    {
      id: 1,
      type: "text",
      label: "Full Name",
      placeholder: "Enter your name",
      required: true,
    },
    {
      id: 2,
      type: "email",
      label: "Email Address",
      placeholder: "your@email.com",
      required: true,
    },
    {
      id: 3,
      type: "rating",
      label: "How satisfied are you?",
      required: true,
    },
    {
      id: 4,
      type: "textarea",
      label: "Additional Comments",
      placeholder: "Tell us more...",
      required: false,
    },
  ]);
  const [selectedField, setSelectedField] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved"); // saved, saving, unsaved

  const fieldTypes = [
    { type: "text", label: "Short Text", icon: Type },
    { type: "textarea", label: "Long Text", icon: AlignLeft },
    { type: "email", label: "Email", icon: Mail },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "number", label: "Number", icon: Hash },
    { type: "url", label: "URL", icon: Link },
    { type: "radio", label: "Multiple Choice", icon: Circle },
    { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
    { type: "dropdown", label: "Dropdown", icon: ChevronDown },
    { type: "rating", label: "Rating", icon: Star },
    { type: "date", label: "Date", icon: Calendar },
    { type: "file", label: "File Upload", icon: Upload },
    { type: "image", label: "Image Upload", icon: ImageIcon },
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type: type,
      label: `New ${fieldTypes.find((f) => f.type === type)?.label || "Field"}`,
      placeholder: "",
      required: false,
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
    setSaveStatus("unsaved");
  };

  const deleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    setSelectedField(null);
    setSaveStatus("unsaved");
  };

  const duplicateField = (field) => {
    const newField = { ...field, id: Date.now() };
    const index = fields.findIndex((f) => f.id === field.id);
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newField);
    setFields(newFields);
    setSaveStatus("unsaved");
  };

  const updateField = (id, updates) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    setSaveStatus("unsaved");
  };

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  };

  const getFieldIcon = (type) => {
    const field = fieldTypes.find((f) => f.type === type);
    return field ? field.icon : Type;
  };

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Left Sidebar - Field Palette */}
      <div className="w-72 bg-slate-900/50 border-r border-white/10 p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-4">Add Fields</h3>
        <div className="space-y-2">
          {fieldTypes.map((field) => {
            const Icon = field.icon;
            return (
              <button
                key={field.type}
                onClick={() => addField(field.type)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all hover:scale-105"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{field.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center - Form Canvas */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
                setSaveStatus("unsaved");
              }}
              className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none"
            />
            <span
              className={`text-sm ${
                saveStatus === "saved"
                  ? "text-green-400"
                  : saveStatus === "saving"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            >
              {saveStatus === "saved"
                ? "✓ Saved"
                : saveStatus === "saving"
                ? "Saving..."
                : "Unsaved changes"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === "saved"}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg transition-all flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Form Header */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => {
              setFormTitle(e.target.value);
              setSaveStatus("unsaved");
            }}
            className="text-3xl font-bold text-white bg-transparent border-none focus:outline-none w-full mb-4"
            placeholder="Form Title"
          />
          <textarea
            value={formDescription}
            onChange={(e) => {
              setFormDescription(e.target.value);
              setSaveStatus("unsaved");
            }}
            className="text-gray-400 bg-transparent border-none focus:outline-none w-full resize-none"
            placeholder="Form description (optional)"
            rows="2"
          />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const Icon = getFieldIcon(field.type);
            const isSelected = selectedField === field.id;

            return (
              <div
                key={field.id}
                onClick={() => setSelectedField(field.id)}
                className={`bg-white/5 border-2 rounded-xl p-6 transition-all cursor-pointer ${
                  isSelected
                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Drag Handle */}
                  <div className="text-gray-500 hover:text-gray-300 cursor-move mt-2">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Field Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Icon className="w-5 h-5 text-purple-400" />
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateField(field.id, { label: e.target.value })
                          }
                          className="text-lg font-medium text-white bg-transparent border-none focus:outline-none flex-1"
                          placeholder="Question"
                        />
                        {field.required && (
                          <span className="text-red-400 text-lg">*</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateField(field);
                          }}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteField(field.id);
                          }}
                          className="p-2 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Field Preview */}
                    <div>
                      {field.type === "text" && (
                        <input
                          type="text"
                          placeholder={field.placeholder || "Enter text..."}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled
                        />
                      )}
                      {field.type === "textarea" && (
                        <textarea
                          placeholder={field.placeholder || "Enter text..."}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          rows="3"
                          disabled
                        />
                      )}
                      {field.type === "email" && (
                        <input
                          type="email"
                          placeholder={field.placeholder || "email@example.com"}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          disabled
                        />
                      )}
                      {field.type === "rating" && (
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-8 h-8 text-gray-600 hover:text-yellow-400 cursor-pointer transition-colors"
                            />
                          ))}
                        </div>
                      )}
                      {field.type === "radio" && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="radio" disabled className="w-4 h-4" />
                            <span className="text-gray-400">Option 1</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" disabled className="w-4 h-4" />
                            <span className="text-gray-400">Option 2</span>
                          </div>
                        </div>
                      )}
                      {field.type === "checkbox" && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              disabled
                              className="w-4 h-4"
                            />
                            <span className="text-gray-400">Option 1</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              disabled
                              className="w-4 h-4"
                            />
                            <span className="text-gray-400">Option 2</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Field Settings (when selected) */}
                    {isSelected && (
                      <div className="pt-4 border-t border-white/10 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">
                              Placeholder
                            </label>
                            <input
                              type="text"
                              value={field.placeholder || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  placeholder: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                              placeholder="Enter placeholder..."
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    required: e.target.checked,
                                  })
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-gray-400">
                                Required field
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Field Button */}
          <button className="w-full py-6 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500 hover:bg-purple-500/10 transition-all group">
            <div className="flex items-center justify-center space-x-2 text-gray-400 group-hover:text-purple-400">
              <Plus className="w-6 h-6" />
              <span className="font-medium">Add Field</span>
            </div>
          </button>
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 bg-slate-900/50 border-l border-white/10 p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-4">Form Settings</h3>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["purple", "blue", "green"].map((color) => (
                <button
                  key={color}
                  className={`h-12 rounded-lg border-2 ${
                    color === "purple"
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500"
                      : color === "blue"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-white/20"
                      : "bg-gradient-to-br from-green-500 to-emerald-500 border-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Submit Button Text
            </label>
            <input
              type="text"
              defaultValue="Submit"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-400">Show progress bar</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm text-gray-400">
                Allow multiple responses
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-sm text-gray-400">Email notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
