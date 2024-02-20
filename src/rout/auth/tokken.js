import { messagesError } from "../../messages/messagesErrors.js";
import jwt from "jsonwebtoken";

let secretKey = "12345";
export default secretKey;

export async function getTokenAndCookie(req) {
  try {
    let tokenIsPresent = req.cookies.token ? true : false;
    let decoded, email;
    if (tokenIsPresent) {
      decoded = jwt.verify(req.cookies.token, secretKey);
      email = decoded.email;
      return { decoded, email, tokenIsPresent };
    } else {
      console.error(messagesError.errors.tokenMissingRequest);
    }
  } catch (error) {
    console.error(messagesError.errors.tokenVerificationError);
  }
}

