import { getTokenAndCookie } from "./tokken.js";
import { ObjectId } from 'mongodb';
import { messagesError } from "../../messages/messagesErrors.js";
import {messagesSusses} from '../../messages/messagesSussess.js';

export async function getDelete(req, res, photodb, usersdb) {
  try {
    const { email, tokenIsPresent } = await getTokenAndCookie(req, usersdb);
    const user = await usersdb.findOne({ email });

    if (user && tokenIsPresent) {
      const entryId = req.params.id;
      await photodb.deleteOne({ _id: new ObjectId(entryId) });
      
      console.log(messagesSusses.success.delete);
      res.redirect(`/moderator`);
    } else {
      console.error(messagesError.errors.userNotDefined);
      res.redirect("/registration");
    }
  } catch (error) {
    console.error(messagesError.errors.deleteError, error);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}
