import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answersRouter = Router();

answersRouter.post("/:answerId/vote", async (req, res) => {
    const voteScore = req.body.vote;
    const { answerId } = req.params;
    const allowedKeys = ["vote"];
    const requestKeys = Object.keys(req.body);
    const invalidKeys = requestKeys.filter((key) => !allowedKeys.includes(key));  
    if (!voteScore || (voteScore !== 1 && voteScore !== -1) || invalidKeys.length>0) {
      return res.status(400).json({ message: "Invalid vote value." });
    }
    const answerResult = await connectionPool.query(
      `select * from answers where id = $1`,
      [answerId]
    );
    if (!answerResult.rows[0]) {
      return res.status(404).json({ message: "Answer not found." });
    }
    try {
      const voteResult = await connectionPool.query(
        `insert into answer_votes  (answer_id, vote)
        values ($1,$2)       
          `,
        [answerId, voteScore]
      );
      return res.status(200).json({
        message: "Vote on the answer has been recorded successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Unable to vote answer.",
      });
    }
  });

  export default answersRouter