/**
 * Maps checklist field labels to backend documentType
 * This is the ONLY source of truth
 */
export const DOCUMENT_TYPE_MAPPER = {
  "Aadhaar Card": "AADHAR",
  "Aadhar Card": "AADHAR", // fallback spelling
  "PAN Card": "PAN",
  "Bank Passbook": "BANK",
  "Cancelled Cheque": "BANK",
  "NDA / Confidentiality Agreement": "NDA",
  "Educational Marksheet": "EDUCATION",
  "Experience Letter from College / Previous Employer": "EXPERIENCE",
  "Offer Letter": "OFFER_LETTER"
};

/**
 * Safe resolver
 */
export const resolveDocumentType = (label) => {
  return DOCUMENT_TYPE_MAPPER[label] || null;
};
