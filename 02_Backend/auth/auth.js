import { jwtSecret } from "../config/jwtConfig";
import jwt from "jsonwebtoken";

let jwtSecretKey = jwtSecret;

const generateToken = async (user) => {
  let data = {
    time: Date(),
    user,
  };

  const token = await jwt.sign(data, jwtSecretKey);
  return token;
};

const validateToken = async (req, res, next) => {
  try {
    const token = req.header("access_token");
    const verified = await jwt.verify(token, jwtSecretKey);
    if (verified) {
      var decoded = await jwt.decode(token, { complete: true });
      req.header.user = decoded.payload.user;
      next();
    } else {
      return res
        .status(401)
        .send({ message: "Authentication Failed", status: 401, error: true });
    }
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Authentication Failed", status: 401, error: true });
  }
};

module.exports = {
  generateToken,
  validateToken,
};
