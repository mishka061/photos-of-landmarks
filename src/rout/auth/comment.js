import { ObjectId } from "mongodb";
import { messagesError } from "../../messages/messagesErrors.js";
import { messagesSusses } from "../../messages/messagesSussess.js";
import { getTokenAndCookie } from "./tokken.js";

export async function postAddComment(req, res, photodb) {
  try {
    const { comment, photoId } = req.body;
    const newPhotoId = new ObjectId();
    const photoRecord = await photodb.findOne({ _id: new ObjectId(photoId) });
    if (photoRecord) {
      if (!photoRecord.comments) {
        photoRecord.comments = [];
      }
      const commentNumber = photoRecord.comments.length + 1;
      const newComment = {
        photoId: newPhotoId,
        text: comment,
        commentNumber: commentNumber,
      };
      photoRecord.comments.push(newComment);
      await photodb.updateOne(
        { _id: new ObjectId(photoId) },
        { $set: { comments: photoRecord.comments } }
      );
      console.log(messagesSusses.success.addComment);
      res.redirect("/");
    } else {
      res.status(404).send(messagesError.errors.photoRecordNotFound);
    }
  } catch (error) {
    console.error(messagesError.errors.postAddCommentError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

export async function postAddLike(req, res, photodb) {
  try {
    const photoId = req.body.photoId;
    const photoRecord = await photodb.findOne({ _id: new ObjectId(photoId) });
    if (photoRecord) {
      const updatedLikes = photoRecord.likes ? photoRecord.likes + 1 : 1;
      await photodb.updateOne(
        { _id: new ObjectId(photoId) },
        { $set: { likes: updatedLikes } }
      );
      console.log(messagesSusses.success.addLike);
      res.redirect("/");
    } else {
      console.error(messagesError.errors.photoRecordNotFound);
      res.status(404).send(messagesError.errors.photoNotFound);
    }
  } catch (error) {
    console.error(messagesError.errors.LikeError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

export async function postSearh(req, res,usersdb, photodb) {
  try {
    const tokenInfo = await getTokenAndCookie(req, usersdb);
    let photoArr = await photodb.find().toArray();
    const search = req.body.search;
    const result = await photodb
      .find({
        $or: [
          { attraction: search },
          { countries: search },
          { city: search },
        ],
      })
      .toArray();
    if (tokenInfo) {
      res.render("main", {
        photoArr: photoArr,
        result: result,
        tokenIsPresent: tokenInfo.tokenIsPresent, 
        title: messagesSusses.success.successfulTitlepostSearh + req.body.search,
      });
    } else {

      res.render("main", {
        photoArr: photoArr,
        result: result,
        title: messagesSusses.success.successfulTitlepostSearh + req.body.search,
      });
    }
  } catch (error) {
    console.error(messagesError.errors.postSearhError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}
