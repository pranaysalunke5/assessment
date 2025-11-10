const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  Mutation: {
    uploadFile: async (_, { file }, { prisma, user, config }) => {
      if (!user) throw new Error('Not authenticated');

      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();

      const uniqueName = `${Date.now()}-${uuidv4()}-${filename}`;
      const uploadPath = path.join(process.cwd(), config.UPLOAD_DIR || 'uploads', uniqueName);

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(uploadPath);
        stream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', err => {
          console.error('Upload error', err);
          reject(err);
        });
      });

      const url = `${config.BASE_URL || 'http://localhost:4000'}/uploads/${uniqueName}`;

      const meta = await prisma.fileMeta.create({
        data: {
          filename: uniqueName,
          url,
          mimeType: mimetype,
          size: fs.statSync(uploadPath).size,
          uploadedBy: user.id
        }
      });

      return {
        id: meta.id,
        filename: meta.filename,
        url: meta.url,
        mimeType: meta.mimeType,
        size: meta.size,
        uploadedBy: meta.uploadedBy,
        createdAt: meta.createdAt.toISOString()
      };
    }
  }
};
