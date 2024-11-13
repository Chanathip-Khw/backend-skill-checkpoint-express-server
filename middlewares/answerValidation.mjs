export const validateCreateAnswer = (req, res, next) => {
  if (req.body.content.length > 300) {
    return res.status(400).json({
      message: "answer length can't exceed 300",
    });
  }

  next();
};
