import fs from "fs"; 
import { getTokenAndCookie } from "./tokken.js";
import { ObjectId } from "mongodb";
import { messagesError } from "../../messages/messagesErrors.js";
import {messagesSusses} from '../../messages/messagesSussess.js';

export async function getModerator(req, res, usersdb, photodb) {
  try {
    const { decoded, email, tokenIsPresent } = await getTokenAndCookie(req, usersdb);
    const user = await usersdb.findOne({ email });
    const userTokenId = decoded.userId;
    const photoModeratorArr = await photodb.find().toArray();

    if (!user || !tokenIsPresent) {
      return res.status(404).send(messagesError.errors.userNotDefined);
    }if(user.role === 'Модератор'){
      res.render("moderator", {
        tokenIsPresent: tokenIsPresent,
        user: user,
        role: user.role,
        photoModeratorArr: photoModeratorArr,
        userId: userTokenId,
        title: messagesSusses.success.successfulTitleModerator,
      });
    }else if((user.role !== 'Модератор')){
      res.render("profile", {
        tokenIsPresent: tokenIsPresent,
        user: user,
        imgArr: imgArr,
        photoArr: photoArr,
        userId: userTokenId,
        title: messagesSusses.success.successfulTitleModerator,
      });
    }else{
      console.error(messagesError.errors.getModeratorError)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

export async function postModerator(req, res, usersdb, photodb) {
  try {
    let photoId = req.body.id;
    const objectId = new ObjectId(photoId);
    const existingDocument = await photodb.findOne({ _id: objectId });
    if (!existingDocument) {
      return res.status(404).send(messages.errors.documentNotFound);
    }
    const { decoded, tokenIsPresent } = await getTokenAndCookie(req, usersdb);
    let { attraction, countries, city, data, comment, replyComment } = req.body;
    let images = req.files;
    let imgArr = images.map((image) => image.originalname);
    for (const image of images) {
      let imagePath = `img/${image.originalname}`;
      fs.writeFileSync(imagePath, fs.readFileSync(image.path));
    }
    let photoModeratorArr = {
      attraction: attraction,
      countries: countries,
      city: city,
      data: data,
      img: imgArr,
      comment: comment,
      replyComment: replyComment,
      userId: decoded.userId,
    };
    const updateResult = await photodb.updateOne(
      { _id: objectId },
      { $set: photoModeratorArr }
    );
    if (updateResult.modifiedCount === 0) {
      console.log(messages.errors.documentNotUpdated);
    } else {
      console.log(messages.success.updateCompletedSuccessfully);
    }
    res.render('moderator', {
      photoModeratorArr: photoModeratorArr,
      tokenIsPresent: tokenIsPresent,
    });
  } catch (error) {
    console.error(messages.errors.updateOneError);
    res.status(500).send(messages.errors.internalServerError);
  }
}































  