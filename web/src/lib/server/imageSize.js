import {readFileSync} from 'node:fs';

/**
 * Read the intrinsic pixel dimensions of a local image file.
 *
 * Supports PNG, GIF and JPEG — the formats used by the blog's images — by
 * parsing just the header bytes (no image library needed). WebP / SVG / other
 * formats return `null` (the image still loads fine, it just gets no reserved
 * box and no shimmer).
 *
 * @param {string} filePath absolute or cwd-relative path to the image file
 * @returns {{width: number, height: number} | null}
 */
export function imageSizeFromFile(filePath) {
	try {
		const buf = readFileSync(filePath);
		return imageSizeFromBuffer(buf);
	} catch {
		return null;
	}
}

/**
 * Same as {@link imageSizeFromFile} but from an in-memory buffer.
 * Exported for testability / reuse.
 * @param {Buffer} buf
 * @returns {{width: number, height: number} | null}
 */
export function imageSizeFromBuffer(buf) {
	if (!buf || buf.length < 12) return null;

	// PNG: 89 50 4E 47 0D 0A 1A 0A  — IHDR width/height at bytes 16 & 20 (BE)
	if (
		buf[0] === 0x89 &&
		buf[1] === 0x50 &&
		buf[2] === 0x4e &&
		buf[3] === 0x47
	) {
		if (buf.length < 24) return null;
		return {width: buf.readUInt32BE(16), height: buf.readUInt32BE(20)};
	}

	// GIF: "GIF87a" / "GIF89a" — width/height at bytes 6 & 8 (LE)
	if (
		buf[0] === 0x47 &&
		buf[1] === 0x49 &&
		buf[2] === 0x46 &&
		buf[3] === 0x38
	) {
		return {width: buf.readUInt16LE(6), height: buf.readUInt16LE(8)};
	}

	// JPEG: FF D8 — scan the SOF segments for dimensions
	if (buf[0] === 0xff && buf[1] === 0xd8) {
		return jpegSize(buf);
	}

	return null;
}

/**
 * @param {Buffer} buf
 * @returns {{width: number, height: number} | null}
 */
function jpegSize(buf) {
	let i = 2;
	const len = buf.length;
	while (i < len) {
		// markers start with 0xFF (skip fill bytes / restart markers)
		if (buf[i] !== 0xff) {
			i++;
			continue;
		}
		while (i < len && buf[i] === 0xff) i++;
		if (i >= len) break;
		const marker = buf[i];
		i++;

		// markers that carry no length field
		if (marker === 0xd8 || marker === 0xd9) continue; // SOI / EOI
		if (marker >= 0xd0 && marker <= 0xd7) continue; // RSTn
		if (marker === 0x01) continue; // TEM

		if (i + 2 > len) break;
		const segLen = buf.readUInt16BE(i);

		// SOF markers (start of frame) carry precision, height then width
		const isSof =
			(marker >= 0xc0 && marker <= 0xc3) ||
			(marker >= 0xc5 && marker <= 0xc7) ||
			(marker >= 0xc9 && marker <= 0xcb) ||
			(marker >= 0xcd && marker <= 0xcf);
		if (isSof) {
			if (i + 7 > len) break;
			return {
				height: buf.readUInt16BE(i + 3),
				width: buf.readUInt16BE(i + 5),
			};
		}

		// skip the rest of this segment
		i += segLen;
	}
	return null;
}
