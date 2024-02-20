import { getTokenAndCookie } from "./tokken.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../../messages/messagesErrors.js";
import { messagesSusses } from "../../messages/messagesSussess.js";

export async function getProfile(req, res, usersdb, photodb) {
  try {
    let { decoded, email, tokenIsPresent } = await getTokenAndCookie(
      req,
      usersdb
    );
    let user = await usersdb.findOne({ email });
    let userTokenId = decoded.userId;
    let photoArr = await photodb.find({ userId: userTokenId }).toArray();
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
      res.render("profile", {
        tokenIsPresent: tokenIsPresent,
        user: user,
        role: user.role,
        imgArr: imgArr,
        photoArr: photoArr,
        userId: userTokenId,
        title: messagesSusses.success.successfulTitleProfile,
      });
    } else if (user.role !== "Модератор") {
      res.render("profile", {
        tokenIsPresent: tokenIsPresent,
        user: user,
        imgArr: imgArr,
        photoArr: photoArr,
        userId: userTokenId,
        title: messagesSusses.success.successfulTitleProfile,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

export async function postReplyCommit(req, res, photodb) {
  try {
    let { photoId, replyComment } = req.body;
    let objectIdPhotoId = new ObjectId(photoId);
    let comment = await photodb.findOne(
      { "comments.photoId": objectIdPhotoId },
      { "comments.$": 1 }
    );
    if (!comment) {
      return res.status(404).send(messagesError.errors.commentNotFound);
    }
    await photodb.updateOne(
      { "comments.photoId": objectIdPhotoId },
      { $set: { "comments.$.replyComment": replyComment } }
    );
    console.log(messagesSusses.success.replyCommentAdded);
    res.redirect("/");
  } catch (error) {
    console.error(messagesError.errors.postReplyCommitError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}
