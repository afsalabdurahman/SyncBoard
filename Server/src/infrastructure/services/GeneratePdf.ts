import PDFDocument from "pdfkit"
import path from "path";
import fs from "fs"
// import {} from "url"

export const generatePDFReceipt = async (session: any): Promise<string> => {
  
  const pdfPath = path.join(
    __dirname,
    `../../../receipts/receipt-${session.id}.pdf`
  );
  console.log(path,"1001,path")
console.log(__dirname,"durre")
  const doc = new PDFDocument();
  console.log(doc,"313,doc")
  doc.pipe(fs.createWriteStream(pdfPath));

  const amount = (session.amount_total || 0) / 100;
const currency = session.currency?.toUpperCase() || "USD";
const date = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// Page margins
const pageWidth = doc.page.width;
const leftMargin = 50;
const rightMargin = pageWidth - 50;

// Header Section with Company Info
doc
  .fontSize(28)
  .font("Helvetica-Bold")
  .fillColor("#2563eb")
  .text("PAYMENT RECEIPT", leftMargin, 50, {
    align: "center",
  })
  .moveDown(0.5);

doc
  .fontSize(10)
  .font("Helvetica")
  .fillColor("#6b7280")
  .text("Your Project Management SaaS", {
    align: "center",
  })
  .text("support@yourcompany.com | www.yourcompany.com", {
    align: "center",
  })
  .moveDown(2);

// Draw separator line
doc
  .strokeColor("#e5e7eb")
  .lineWidth(1)
  .moveTo(leftMargin, doc.y)
  .lineTo(rightMargin, doc.y)
  .stroke()
  .moveDown(1.5);

// Receipt Details Section
const startY = doc.y;

// Left column - Receipt Info
doc
  .fontSize(10)
  .font("Helvetica-Bold")
  .fillColor("#374151")
  .text("RECEIPT DETAILS", leftMargin, startY);

doc
  .fontSize(10)
  .font("Helvetica")
  .fillColor("#6b7280")
  .text("Date Issued:", leftMargin, doc.y + 15)
  .font("Helvetica")
  .fillColor("#111827")
  .text(date, leftMargin + 100, doc.y);

doc
  .fillColor("#6b7280")
  .text("Transaction ID:", leftMargin, doc.y + 20)
  .fillColor("#111827")
  .text(session.id, leftMargin + 100, doc.y, {
    width: rightMargin - leftMargin - 100,
  });

doc
  .fillColor("#6b7280")
  .text("Payment Status:", leftMargin, doc.y + 20)
  .fillColor("#10b981")
  .font("Helvetica-Bold")
  .text(session.payment_status.toUpperCase(), leftMargin + 100, doc.y);

doc.moveDown(2);

// Customer Information Section
doc
  .fontSize(10)
  .font("Helvetica-Bold")
  .fillColor("#374151")
  .text("CUSTOMER INFORMATION", leftMargin);

doc
  .fontSize(10)
  .font("Helvetica")
  .fillColor("#6b7280")
  .text("Email:", leftMargin, doc.y + 15)
  .fillColor("#111827")
  .text(session.customer_details?.email || "N/A", leftMargin + 100, doc.y);

doc
  .fillColor("#6b7280")
  .text("Workspace:", leftMargin, doc.y + 20)
  .fillColor("#111827")
  .text(session.metadata?.workspaceName || "N/A", leftMargin + 100, doc.y);

doc.moveDown(3);

// Payment Summary Box
const boxTop = doc.y;
const boxHeight = 80;
const boxPadding = 20;

// Draw rounded rectangle background
doc
  .fillColor("#f3f4f6")
  .roundedRect(leftMargin, boxTop, rightMargin - leftMargin, boxHeight, 5)
  .fill();

// Amount details inside box
doc
  .fontSize(12)
  .font("Helvetica-Bold")
  .fillColor("#374151")
  .text("AMOUNT PAID", leftMargin + boxPadding, boxTop + boxPadding);

doc
  .fontSize(32)
  .font("Helvetica-Bold")
  .fillColor("#2563eb")
  .text(
    `${amount.toFixed(2)} ${currency}`,
    leftMargin + boxPadding,
    boxTop + boxPadding + 25
  );

doc.moveDown(4);

// Additional Notes Section
doc
  .fontSize(9)
  .font("Helvetica")
  .fillColor("#6b7280")
  .text(
    "This is an automated receipt generated for your payment. No signature is required.",
    leftMargin,
    doc.y + 20,
    {
      align: "center",
      width: rightMargin - leftMargin,
    }
  );

// Footer Section
const footerY = doc.page.height - 100;

doc
  .fontSize(10)
  .font("Helvetica-Bold")
  .fillColor("#374151")
  .text("Thank you for choosing our services!", leftMargin, footerY, {
    align: "center",
    width: rightMargin - leftMargin,
  });

doc
  .fontSize(8)
  .font("Helvetica")
  .fillColor("#9ca3af")
  .text(
    "For support or inquiries, please contact us at support@yourcompany.com",
    leftMargin,
    footerY + 20,
    {
      align: "center",
      width: rightMargin - leftMargin,
    }
  );

// Draw bottom separator
doc
  .strokeColor("#e5e7eb")
  .lineWidth(0.5)
  .moveTo(leftMargin, footerY + 40)
  .lineTo(rightMargin, footerY + 40)
  .stroke();

doc
  .fontSize(7)
  .fillColor("#9ca3af")
  .text(
    `Receipt generated on ${new Date().toLocaleDateString()} | Document ID: ${session.id.slice(-12)}`,
    leftMargin,
    footerY + 45,
    {
      align: "center",
      width: rightMargin - leftMargin,
    }
  );

doc.end();
  console.log(pdfPath,"path001")
  return pdfPath;
};
