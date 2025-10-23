// lib/services/fileService.js - FIXED VERSION
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(file, onProgress = null) {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file size (Cloudinary free tier: 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File too large (max 10MB)");
    }

    // Detect resource type - IMPROVED LOGIC
    let resourceType = "raw"; // Default to raw
    const fileType = file.type || "";

    if (fileType.startsWith("image/")) {
      resourceType = "image";
    } else if (fileType.startsWith("video/")) {
      resourceType = "video";
    } else if (fileType === "application/pdf") {
      resourceType = "raw";
    }

    // Determine endpoint based on resource type
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "formcraft_uploads");
    formData.append("resource_type", resourceType);

    // console.log("Uploading to:", endpoint, "Resource Type:", resourceType);

    // Upload with XMLHttpRequest to track progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(Math.round(progress));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);

            // console.log("Cloudinary Response:", data);

            // Validate response has required fields
            if (!data.secure_url && !data.url) {
              throw new Error(
                "Invalid response from Cloudinary - no URL returned"
              );
            }

            // Generate thumbnail URL for images
            let thumbnailUrl = null;
            if (resourceType === "image") {
              thumbnailUrl = (data.secure_url || data.url).replace(
                "/upload/",
                "/upload/w_200,h_200,c_thumb,q_auto/"
              );
            }

            // Build result object with only defined values
            const result = {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type || "application/octet-stream",
              url: data.secure_url || data.url,
              publicId: data.public_id,
              resourceType: data.resource_type,
              format: data.format,
              uploadMethod: "cloudinary",
              uploadedAt: new Date().toISOString(),
            };

            // Add optional fields
            if (thumbnailUrl) {
              result.thumbnailUrl = thumbnailUrl;
            }

            // console.log("Upload Result:", result);

            resolve(result);
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            reject(new Error("Failed to parse upload response"));
          }
        } else {
          console.error(
            "Upload failed with status:",
            xhr.status,
            xhr.responseText
          );
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Upload timeout - please try again"));
      });

      xhr.open("POST", endpoint);
      xhr.timeout = 60000; // 60 second timeout
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Delete file from Cloudinary (optional)
 */
export async function deleteFromCloudinary(publicId) {
  // Note: Deletion requires signed requests (backend)
  console.log("Delete not implemented (requires backend)");
}

/**
 * Validate file before upload
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
  } = options;

  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(
        1
      )}MB`,
    };
  }

  if (allowedTypes.length > 0) {
    const fileType = file.type || "";
    const isAllowed = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return fileType.startsWith(type.replace("/*", ""));
      }
      return fileType === type;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(
          ", "
        )}`,
      };
    }
  }

  return { valid: true };
}
