import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

questionsRouter.post("/", async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.category) {
        return res.status(400).json({
          message: "Invalid request data.",
        });
      }
    const newQuestion = {
    ...req.body,
  };

  try {
    await connectionPool.query(
      `insert into questions (title, description, category)
        values ($1,$2,$3)`,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );

    return res.status(201).json({
      message: `Question created successfully.`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to create question.",
    });
  }
});

questionsRouter.get("/", async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from questions`);
    return res.status(200).json({ data: results.rows });
  } catch (err) {
    return res.status(500).json({
      message:  "Unable to fetch questions.",
    });
  }
});

questionsRouter.get("/:id", async (req, res) => {
  try {
    const questionIdFromClient = req.params.id;
    const results = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
    if (!results.rows[0]) {
      return res
        .status(404)
        .json({ message: "Question not found." });
    }
    return res.status(200).json({data:results.rows[0]});
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.put("/:id", async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.category) {
        return res.status(400).json({
          message: "Invalid request data.",
        });
      }
    try {
    const questionIdFromClient = req.params.id;
    const updatedQuestion = { ...req.body };
    const results = await connectionPool.query(
      `update questions
      set
      title=$2,
      description=$3,
      category=$4
      where id=$1`,
      [
        questionIdFromClient,
        updatedQuestion.title,
        updatedQuestion.description,
        updatedQuestion.category,
      ]
    );
    if (results.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }
    return res.status(200).json({
        "message": "Question updated successfully."
      });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.delete("/:id", async (req, res) => {
  try {
    const questionIdFromClient = req.params.id;
    const results = await connectionPool.query(
      `delete from questions where id = $1`,
      [questionIdFromClient]
    );
    if (results.rowCount === 0) {
      return res.status(404).json({
        message:  "Question not found.",
      });
    }
    return res.status(200).json({ message: "Question post has been deleted successfully." });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }
});

export default questionsRouter;
