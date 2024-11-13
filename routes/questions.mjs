import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router();

questionsRouter.post("/", async (req, res) => {
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
      message: `Question id: ${req.body._id} has been created successfully`,
    });
  } catch {
    res.status(500).json({
      message: "Server could not create question because database connection",
    });
  }
});

questionsRouter.get("/", async (req, res) => {
  try {
    const results = await connectionPool.query(`select * from questions`);
    return res.status(201).json({ data: results.rows });
  } catch (err) {
    return res.status(500).json({
      message: "Server could not read question because database connection",
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
        .json({ message: "Server could not find a requested question" });
    }
    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: "Server could not read question because database connection",
    });
  }
});

questionsRouter.put("/:id", async (req, res) => {
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
        message: "Server could not find a requested question to update",
      });
    }
    const responseData = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
    return res.status(200).json(responseData.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: "Server could not update post because database connection",
      error: err.message,
    });
  }
});

questionsRouter.delete("/:id", async (req, res) => {
  try {
    const questionIdFromClient = req.params.id;
    const results = await connectionPool.query(`delete from questions where id = $1`, [
      questionIdFromClient,
    ]);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .json({
          message: "Server could not find a requested question to delete",
        });
    }
    return res.status(200).json({ message: "Deleted question sucessfully" });
  } catch(err) {
    return res.status(500).json({
      message: "Server could not delete question because database connection",
      error : err.message
    });
  }
});

export default questionsRouter;
