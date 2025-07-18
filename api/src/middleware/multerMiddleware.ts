import multer from 'fastify-multer';
import { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/temp');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => (b % 10).toString()).join('');
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create upload middleware
 export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

//create a fastify compatibilty wrappper
export function multerHandler(middleware: any) {
    return function compatibleMiddleware(
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void
    ) {
      middleware(request, reply, (err: Error) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
    };
  }

  