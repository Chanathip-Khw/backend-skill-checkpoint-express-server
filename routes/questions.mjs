import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateAnswer } from "../middlewares/answerValidation.mjs";

const questionsRouter = Router();

questionsRouter.post("/", async (req, res) => {
  const allowedKeys = ["title", "description", "category"];
  const requestKeys = Object.keys(req.body);
  const invalidKeys = requestKeys.filter((key) => !allowedKeys.includes(key));
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.category ||
    invalidKeys.length > 0
  ) {
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

questionsRouter.post(
  "/:questionId/answers",
  [validateCreateAnswer],
  async (req, res) => {
    const allowedKeys = ["content"];
    const requestKeys = Object.keys(req.body);
    const invalidKeys = requestKeys.filter((key) => !allowedKeys.includes(key));
    if (!req.body.content || invalidKeys.length > 0) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }
    const { questionId } = req.params;
    const newAnswer = {
      ...req.body,
    };
    try {
      const results = await connectionPool.query(
        `select * from questions where id = $1`,
        [questionId]
      );
      if (!results.rows[0]) {
        return res.status(404).json({ message: "Question not found." });
      }
      await connectionPool.query(
        `insert into answers (content, question_id)
          values ($1,$2)`,
        [newAnswer.content, questionId]
      );
      return res.status(201).json({
        message: "Answer created successfully.",
      });
    } catch (err) {
      res.status(500).json({
        message: "Unable to create question.",
        error: err.message,
      });
    }
  }
);

questionsRouter.post("/:questionId/vote", async (req, res) => {
  const voteScore = req.body.vote;
  const { questionId } = req.params;
  const allowedKeys = ["vote"];
  const requestKeys = Object.keys(req.body);
  const invalidKeys = requestKeys.filter((key) => !allowedKeys.includes(key));
  if (
    !voteScore ||
    (voteScore !== 1 && voteScore !== -1) ||
    invalidKeys.length > 0
  ) {
    return res.status(400).json({ message: "Invalid vote value." });
  }
  const questionResult = await connectionPool.query(
    `select * from questions where id = $1`,
    [questionId]
  );
  if (!questionResult.rows[0]) {
    return res.status(404).json({ message: "Question not found." });
  }
  try {
    const voteResult = await connectionPool.query(
      `insert into question_votes  (question_id, vote)
      values ($1,$2)       
        `,
      [questionId, voteScore]
    );
    return res.status(200).json({
      message: "Vote on the question has been recorded successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to vote question.",
      error: err.message,
    });
  }
});

questionsRouter.get("/search", async (req, res) => {
  const { category, title } = req.query;
  if (!category && !title) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }
  let query;
  let values;
  if (category && title) {
    query = `select * from questions where category ilike $1 and title ilike $2`;
    values = [`%${category}%`, `%${title}%`];
  } else if (category && !title) {
    query = `select * from questions where category ilike $1 `;
    values = [`%${category}%`];
  } else if (!category && title) {
    query = `select * from questions where title ilike $1 `;
    values = [`%${title}%`];
  }
  try {
    const results = await connectionPool.query(query, values);
    return res.status(200).json({ data: results.rows });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.get("/:questionId", async (req, res) => {
  try {
    const questionIdFromClient = req.params.questionId;
    const results = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
    if (!results.rows[0]) {
      return res.status(404).json({ message: "Question not found." });
    }
    return res.status(200).json({ data: results.rows[0] });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.get("/", async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from questions`);
    return res.status(200).json({ data: results.rows });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.get("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    const questionResult = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionId]
    );
    if (!questionResult.rows[0]) {
      return res.status(404).json({ message: "Question not found." });
    }
    const answerResult = await connectionPool.query(
      `select * from answers where question_id=$1`,
      [questionId]
    );
    return res.status(200).json({
      data: answerResult.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to fetch answers.",
      error: err.message,
    });
  }
});

questionsRouter.put("/:questionId", async (req, res) => {
  const allowedKeys = ["title", "description", "category"];
  const requestKeys = Object.keys(req.body);
  const invalidKeys = requestKeys.filter((key) => !allowedKeys.includes(key));
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.category ||
    invalidKeys.length > 0
  ) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }
  try {
    const questionIdFromClient = req.params.questionId;
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
      message: "Question updated successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.delete("/:questionId", async (req, res) => {
  try {
    const questionIdFromClient = req.params.questionId;
    const results = await connectionPool.query(
      `delete from questions where id = $1`,
      [questionIdFromClient]
    );
    if (results.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }
    return res
      .status(200)
      .json({ message: "Question post has been deleted successfully." });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }
});

questionsRouter.delete("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    const questionResult = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionId]
    );
    if (!questionResult.rows[0]) {
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query(`delete from answers where question_id = $1`, [
      questionId,
    ]);
    return res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to delete answers.",
    });
  }
});

export default questionsRouter;
