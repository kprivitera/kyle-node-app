// Multer configuration
import multer from "multer";
import path from "path";
import fs from "fs";

const getMulterConfig = () =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const id = req.params.id;
      const entityType = req.params.entityType;
      const dir = `./uploads/${entityType}/${id}`;

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

export default getMulterConfig;
