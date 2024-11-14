import express from "express";
import questionsRouter from "./routes/questions.mjs";
import answersRouter from "./routes/answers.mjs";
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const app = express();
const port = 4000;
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Q&A API",
      description: "Q&A API Information",
      contact: {
        name: "Chanathip Khlowutthiwat",
      },
      servers: ["http://localhost:4000"],
    },
  },
  apis: ["./routes/*.mjs"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use("/questions", questionsRouter);
app.use("/answers", answersRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
