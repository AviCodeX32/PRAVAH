import fs from 'fs';
import path from 'path';

// Generate a valid minimal PDF buffer containing the CA Net Worth Certificate text
function createSimplePdfBuffer(textContent) {
  const contentStream = `BT /F1 12 Tf 50 750 Td (${textContent.replace(/\n/g, ') Tj T* (').replace(/[()]/g, '')}) Tj ET`;
  const streamLength = Buffer.byteLength(contentStream);

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000246 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
390
%%EOF`;

  return Buffer.from(pdf, 'utf-8');
}

const sampleText = `M/S R. K. DESHMUKH & ASSOCIATES
CHARTERED ACCOUNTANTS
Audited Statutory Certificate of Gross Capital Investment
Project: Sahyadri Agro-Processing Facility
Entity ID: MH-ENT-2026-9901
Plot No. C-44, Phase II, Chakan MIDC, Pune

We hereby certify that we have verified the books of accounts, plant machinery invoices, and civil foundation contracts.
The aggregate investment in plant, machinery and civil works stands certified at INR 13,60,00,000/- (Rupees Thirteen Crores Sixty Lakhs only).
Dated: 18th March 2026
UDIN: 26048123ABCE99812`;

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const targetPath = path.join(uploadsDir, 'Chartered_Accountant_NetWorth_Certificate.pdf');
fs.writeFileSync(targetPath, createSimplePdfBuffer(sampleText));
console.log('[SAMPLE GEN] Created sample PDF at:', targetPath);
