import { Router } from "express";
import { multerFilter, sessionValidator } from "../middlewares/middlewares";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

router.post(
  "/",
  sessionValidator,
  upload.single("image"),
  async (req, res): Promise<void> => {
    //uploads images and only images
    if (!req.file) {
      res.status(400).send("No image uploaded or file type is invalid.");
      return;
    }

    const savedImage = uuidv4();
    try {
      const originalImage = req.file.buffer;

      const resizedImage = `uploads/s-${savedImage}.jpeg`;
      const formattedImage = `uploads/l-${savedImage}.jpeg`;

      const metadata = await sharp(originalImage).metadata(); // returns info about uploaded pic like width heigh etc

      if (!metadata) {
        res.status(400).send("Your image is corrupted");
        return;
      }

      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;

      const halfWidth = Math.floor(originalWidth / 2);
      const halfHeigh = Math.floor(originalHeight / 2);

      await sharp(originalImage).toFormat("jpeg").toFile(formattedImage);

      await sharp(originalImage)
        .resize(halfWidth, halfHeigh)
        .toFormat("jpeg")
        .toFile(resizedImage);
    } catch (err) {
      console.error("Error processing image:", err);
      res.status(500).send("Error processing image");
    }

    const imageURL = `http://localhost:3001/api/image/l-${savedImage}.jpeg`;

    res.status(200).send(imageURL);
  }
);

export default router;
