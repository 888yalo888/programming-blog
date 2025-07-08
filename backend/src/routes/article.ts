import { Request, Response, Router } from "express";
import { isAdmin, sessionValidator } from "../middlewares/middlewares";
import { body, param, query, validationResult } from "express-validator";
import { pool } from "../configs/pool";
import { ArticleRequest, QueryParams } from "../interfaces/interfaces";

const router = Router();

router.post(
  "/",
  isAdmin,
  sessionValidator,
  body("title").exists().isString().notEmpty(),
  body("text").exists().isString().notEmpty(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }
    console.log(req.body);

    const { title, text, is_published } = req.body;

    try {
      const article = await pool.query(
        "INSERT INTO articles (title, text,is_published) VALUES ($1, $2, $3) RETURNING *",
        [title, text, is_published]
      );
      console.log(article.rows[0]);
      res.status(200).json(article.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "" });
    }

    // res.json(req.file);
  }
); //session validator needed

router.get(
  "/all",
  query("pageNumber")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page number must be an integer greater than or equal to 1")
    .toInt(),
  query("resultsOnPage")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page number must be an integer greater than or equal to 1")
    .toInt(),
  async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }

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
  }
);

router.get(
  "/:id",
  param("id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("id must be an integer greater than 1"),
  async (req: ArticleRequest, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }

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
  }
);

router.post(
  "/:id/comment",
  sessionValidator,
  param("id")
    .isInt({ min: 1 })
    .withMessage("Article id must be an integer greater than 0"),
  body("comment")
    .exists()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment must be a non-empty string"),
  async (req: ArticleRequest, res: Response) => {
    //console.log(req.body);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }

    if (!req.session.passport) {
      res.status(401).send("No session found");
      return;
    }

    const user_id = req.session.passport?.user.id ?? null;
    // const user_id = req.body.user_id;
    const { comment } = req.body;
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
  }
);

router.get(
  "/:id/comments",
  param("id")
    .isInt({ min: 1 })
    .withMessage("Article id must be an integer greater than 0"),
  async (req: ArticleRequest, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.send({ errors: validationErrors.array() });
      return;
    }
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
  }
);

export default router;
