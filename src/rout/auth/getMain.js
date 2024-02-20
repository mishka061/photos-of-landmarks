import { messagesError } from "../../messages/messagesErrors.js";
import {messagesSusses} from '../../messages/messagesSussess.js';
import { getTokenAndCookie } from './tokken.js';

export async function getMain(req, res, usersdb, photodb) {
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    if (tokenInfo) {
      const {tokenIsPresent} = tokenInfo;
      let photoArr = await photodb.find().toArray();
      res.render("main", {
        photoArr,
        tokenIsPresent: tokenIsPresent,
        title: messagesSusses.success.successfulTitleIndex,
      })
    } else {
      let photoArr = await photodb.find().toArray();
      res.render("main", {
        photoArr,
        title: messagesSusses.success.successfulTitleIndex,
      })
    }
  } catch (error) {
    console.error(error, messagesError.errors.getMainError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}
















