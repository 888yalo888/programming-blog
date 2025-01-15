import express from 'express';
import multer, { FileFilterCallback} from "multer";
import fs from 'node:fs';
import { Pool } from 'pg';
import { Request } from "express";
import sharp from 'sharp';
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { createAuthToken } from "@portive/auth";
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/api/image', express.static("uploads"));


const PORT = 3000;

const pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "blog",
    password: "mysecretpassword",
    port: 5432,
});

const multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Please upload only images."));
    }
};

const storage = multer.memoryStorage();

const upload = multer({
    storage,
  fileFilter: multerFilter,
});


app.post(
    "/api/image",
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
                res.status(400).send('Your image is corrupted')
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

        const imageURL = `http://localhost:3000/api/image/l-${savedImage}.jpeg`;

        res.status(200).send(imageURL);
    }
);


app.post("/api/article", async (req, res) => {
  console.log(req.body);

  const { title, text, is_published} = req.body;
  
  try {
    const article = await pool.query(
      'INSERT INTO articles (title, text,is_published) VALUES ($1, $2, $3)', [title, text,is_published]
    );
    res.status(200).json(article.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({message: ''})
  }


    res.json(req.file);
});


app.get("/api/article/:id", async (req, res) => {
    const articleId = parseInt(req.params.id, 10);

    try {
        const postById = await pool.query(
            "SELECT title, text, id FROM articles WHERE id = $1",
            [articleId]
        );
        res.status(200).json(postById.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error retrieving a post" });
    }
});

app.get("/api/articles", async (req, res) => {
    const { pageNumber, resultsOnPage } = req.query;
    let actualPageNumber: number = 1; //OFFSET// how many articles to skip
    let actualResultsOnPage: number = 5; //LIMIT//how many articles on the page

    //its not edge cases its converting pageNumber string to number and assigning it to actualPageNumber
    if (!!pageNumber && !isNaN(parseInt(pageNumber.toString()))) {
        //toString because it's ts and we have to make sure its a string first
        actualPageNumber = parseInt(pageNumber.toString());
    }

    if (!!resultsOnPage && !isNaN(parseInt(resultsOnPage.toString()))) {
        actualResultsOnPage = parseInt(resultsOnPage.toString());
    }

    try {
        const resultsCount = await pool.query(
            "SELECT COUNT(*) FROM articles WHERE is_published=true"
        );

        const allPublishedArticles = await pool.query(
            "SELECT title, id, comments_count, likes_count,created_at FROM articles WHERE is_published=true LIMIT $1 OFFSET $2",
            [actualResultsOnPage, actualResultsOnPage * (actualPageNumber - 1)]
        );

        res.status(200).json({
            page_results: allPublishedArticles.rows,
            page_info: {
                page_number: actualPageNumber,
                page_size: actualResultsOnPage,
                result_count: parseInt(resultsCount.rows[0].count), //number of articles
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error retrieving articles" });
    }
});

app.post("/api/article/:id/comment", async (req, res) => {
    //console.log(req.body);

    const { user_id, comment } = req.body;
    const articleId = parseInt(req.params.id, 10);

    try {
        const commentResult = await pool.query(
            "INSERT INTO comments_info (user_id, article_id,comment) VALUES ($1, $2, $3)",
            [user_id, articleId, comment]
        );
        res.status(200).json(commentResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "" });
    }

    res.json(req.file);
});

app.get("/api/article/:id/comments", async (req, res) => {
    const articleId = parseInt(req.params.id, 10);

    try {
        const commentsById = await pool.query(
            "SELECT comment FROM comments_info WHERE article_id = $1",
            [articleId]
        );
        res.status(200).json(commentsById.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error retrieving comments" });
    }
});


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})