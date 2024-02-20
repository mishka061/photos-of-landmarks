import { getTokenAndCookie } from "./tokken.js";
import { messagesError } from "../../messages/messagesErrors.js";
import {messagesSusses} from '../../messages/messagesSussess.js';

export async function getAllPotoUser(req, res, photodb, usersdb) {
  try {
    const { decoded, email, tokenIsPresent } = await getTokenAndCookie(
      req,
      usersdb
    );
    const user = await usersdb.findOne({ email });
    const userTokenId = decoded.userId;
    const photoArr = await photodb.find().toArray();
    let imgArr = [];
    for (let elem of photoArr) {
      let subElem = elem.img;
      for (let images of subElem) {
        imgArr.push(images);
      }
    }
    if (!user || !tokenIsPresent) {
      return res.status(404).send(messagesError.errors.userNotDefined);
    }
    if (user.role === "Модератор") {
      res.render("main", {
        tokenIsPresent: tokenIsPresent,
        user: user,
        role: user.role,
        imgArr: imgArr,
        photoArr: photoArr,
        userId: userTokenId,
        title: messagesSusses.success.successfulTitleIndex,
      });
    } else if (user.role !== "Модератор") {
      res.render("main", {
        tokenIsPresent: tokenIsPresent,
        user: user,
        imgArr: imgArr,
        photoArr: photoArr,
        userId: userTokenId,
        title: messagesSusses.success.successfulTitleIndex,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}
