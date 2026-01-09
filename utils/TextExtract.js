import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";


/* ---------- OCR WORKER ---------- */
let worker;

// Initialize a persistent worker for standard image files
async function initOCR() {
  worker = await createWorker('eng');
}
await initOCR();

async function ocrImage(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 1000) {
    throw new Error("Invalid image buffer for OCR");
  }
  const { data: { text } } = await worker.recognize(buffer);
  return text;
}

/* ---------- MAIN ---------- */

async function extractAndAppendText(file, accumulator) {
  if (!file || !file.buffer || !file.mimetype) {
    throw new Error("Invalid file");
  }

  const { buffer, mimetype } = file;

  // 1. IMAGE HANDLING (Single standard images)
  if (mimetype.startsWith("image/")) {
    const text = await ocrImage(buffer);
    accumulator.push(text);
    return;
  }

  // 2. PDF HANDLING
  if (mimetype === "application/pdf") {
    // Check for selectable text first
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    console.log(textResult.length);
    
    
    const meaningful =
      textResult.text &&
      textResult.text.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "") 
  .replace(/\s+/g, " ")
  .trim().length > 50;

    await parser.destroy();

    if (meaningful) {
      // PDF contains selectable text (Digital PDF)
      accumulator.push(textResult.text);
      return;
    }
  
  }

  // 4. DOCX HANDLING
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    accumulator.push(result.value);
    return;
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}

export default extractAndAppendText;