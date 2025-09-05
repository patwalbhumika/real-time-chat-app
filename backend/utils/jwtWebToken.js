import jwt from "jsonwebtoken";

const jwtToken = (userId, res) => {
  const token = jwt.sign({ userId, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 dayd(in ms)
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.SECURE !== "development",
  });
};

export default jwtToken;
