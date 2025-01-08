//helper function to generate jwt token which will be used for authenticating user before carrying out secure functionalities
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  //res.cookie takes the key (name of token) and the value (actual token generated itself) and optional values like expiration of cookie, CSRF safe and http only
};
