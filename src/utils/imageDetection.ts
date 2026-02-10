/** Field names that typically contain image data */
const IMAGE_FIELD_NAMES = new Set([
	"picture",
	"portrait",
	"image",
	"photo",
	"avatar",
	"face_image",
	"face",
	"thumbnail",
	"headshot",
]);

/**
 * Checks if a field name suggests it contains image data.
 */
function isImageFieldName(fieldName: string): boolean {
	const lowerFieldName = fieldName.toLowerCase();
	for (const pattern of IMAGE_FIELD_NAMES) {
		if (lowerFieldName === pattern || lowerFieldName.includes(pattern)) {
			return true;
		}
	}
	return false;
}

/**
 * Checks if a string is a data URL for an image.
 */
function isImageDataUrl(value: string): boolean {
	return value.startsWith("data:image/");
}

/**
 * Detects if a base64 string is a JPEG image by checking magic bytes.
 * JPEG files start with FFD8FF, which in base64 is "/9j/" or "_9j_" (URL-safe).
 */
function isJpegBase64(value: string): boolean {
	return value.startsWith("/9j/") || value.startsWith("_9j_");
}

/**
 * Detects if a base64 string is a PNG image by checking magic bytes.
 * PNG files start with 89504E47, which in base64 is "iVBORw0K".
 */
function isPngBase64(value: string): boolean {
	return value.startsWith("iVBORw0K");
}

/**
 * Detects if a base64 string is a GIF image by checking magic bytes.
 * GIF files start with "GIF87a" or "GIF89a", which in base64 starts with "R0lGOD".
 */
function isGifBase64(value: string): boolean {
	return value.startsWith("R0lGOD");
}

/**
 * Detects if a base64 string is a WebP image by checking magic bytes.
 * WebP files start with RIFF....WEBP, which in base64 starts with "UklGR".
 */
function isWebpBase64(value: string): boolean {
	return value.startsWith("UklGR");
}

export type ImageFormat = "jpeg" | "png" | "gif" | "webp" | "unknown";

/**
 * Detects the image format from a raw base64 string.
 * Returns the format if detected, null if not an image.
 */
function detectBase64ImageFormat(value: string): ImageFormat | null {
	if (isJpegBase64(value)) return "jpeg";
	if (isPngBase64(value)) return "png";
	if (isGifBase64(value)) return "gif";
	if (isWebpBase64(value)) return "webp";
	return null;
}

export interface ImageDetectionResult {
	isImage: true;
	/** The data URL ready to use in an img src */
	dataUrl: string;
}

/**
 * Determines if a value is an image and returns the data URL if so.
 * Detection is based on:
 * 1. Value starts with "data:image/" (already a data URL)
 * 2. Field name suggests image AND value is a valid base64 string with image magic bytes
 * 3. Value has image magic bytes (JPEG, PNG, GIF, WebP) regardless of field name
 *
 * @param value - The value to check
 * @param fieldName - The field name for heuristic detection
 * @returns ImageDetectionResult if image detected, null otherwise
 */
export function detectImageValue(
	value: unknown,
	fieldName: string,
): ImageDetectionResult | null {
	if (typeof value !== "string" || value.length === 0) {
		return null;
	}

	// 1. Already a data URL
	if (isImageDataUrl(value)) {
		return { isImage: true, dataUrl: value };
	}

	// 2. Check for raw base64 with image magic bytes
	const format = detectBase64ImageFormat(value);
	if (format) {
		const mimeType = format === "unknown" ? "image/jpeg" : `image/${format}`;
		// Convert URL-safe base64 to standard base64 if needed
		const standardBase64 = value.replace(/-/g, "+").replace(/_/g, "/");
		return {
			isImage: true,
			dataUrl: `data:${mimeType};base64,${standardBase64}`,
		};
	}

	// 3. Field name suggests image - try to use as base64 with generic type
	// This is a fallback for base64 without recognizable magic bytes
	if (isImageFieldName(fieldName) && looksLikeBase64(value)) {
		// Convert URL-safe base64 to standard base64 if needed
		const standardBase64 = value.replace(/-/g, "+").replace(/_/g, "/");
		return {
			isImage: true,
			dataUrl: `data:image/jpeg;base64,${standardBase64}`,
		};
	}

	return null;
}

/**
 * Quick check if a string looks like base64 data.
 * Checks for reasonable length and base64 character set.
 */
function looksLikeBase64(value: string): boolean {
	// Must be reasonably long for an image (at least a few hundred chars)
	if (value.length < 100) {
		return false;
	}
	// Should only contain base64 characters (standard or URL-safe)
	return /^[A-Za-z0-9+/_-]+=*$/.test(value);
}

/**
 * Simple boolean check for whether a value is an image.
 */
export function isImageValue(value: unknown, fieldName: string): boolean {
	return detectImageValue(value, fieldName) !== null;
}
