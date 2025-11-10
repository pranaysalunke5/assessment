const { renderHtmlFromTemplate, generatePdfBuffer } = require('../services/pdfService');
const { sendEmailWithAttachment } = require('../services/emailService');

module.exports = {
  Query: {
    document: async (_, { id }, { prisma }) => {
      const doc = await prisma.document.findUnique({ where: { id: Number(id) } });
      if (!doc) throw new Error('Document not found');
      return {
        id: doc.id,
        title: doc.title,
        html: doc.html,
        pdfUrl: doc.pdfUrl,
        ownerId: doc.ownerId,
        createdAt: doc.createdAt.toISOString()
      };
    }
  },

  Mutation: {
    createDocument: async (_, { title, templateData }, { prisma, user, config }) => {
      if (!user) throw new Error('Not authenticated');

      const html = await renderHtmlFromTemplate('document', templateData);

      const doc = await prisma.document.create({
        data: {
          title,
          html,
          ownerId: user.id
        }
      });

      const pdfBuffer = await generatePdfBuffer(html);

      const path = require('path');
      const fs = require('fs');
      const uniqueName = `${Date.now()}-${doc.id}.pdf`;
      const uploadPath = path.join(process.cwd(), config.UPLOAD_DIR || 'uploads', uniqueName);
      fs.writeFileSync(uploadPath, pdfBuffer);

      const pdfUrl = `${config.BASE_URL || 'http://localhost:4000'}/uploads/${uniqueName}`;

      const updated = await prisma.document.update({
        where: { id: doc.id },
        data: { pdfUrl }
      });

      return {
        id: updated.id,
        title: updated.title,
        html: updated.html,
        pdfUrl: updated.pdfUrl,
        ownerId: updated.ownerId,
        createdAt: updated.createdAt.toISOString()
      };
    },

    sendDocumentByEmail: async (_, { documentId, to }, { prisma, user }) => {
      if (!user) throw new Error('Not authenticated');

      const doc = await prisma.document.findUnique({ where: { id: Number(documentId) } });
      if (!doc) throw new Error('Document not found');

      if (!doc.pdfUrl) throw new Error('PDF not available for this document');

      const sent = await sendEmailWithAttachment({
        to,
        subject: `Document: ${doc.title}`,
        text: `Please find the document ${doc.title}`,
        attachments: [
          {
            filename: `${doc.title}.pdf`,
            path: doc.pdfUrl.replace(`${process.env.BASE_URL || 'http://localhost:4000'}`, process.cwd()) 
          }
        ],
        html: `<p>Your document is ready. <a href="${doc.pdfUrl}">Download PDF</a></p>`
      });

      return !!sent;
    }
  }
};
