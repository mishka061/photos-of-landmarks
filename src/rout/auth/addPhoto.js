import fs from "fs"; 
import { getTokenAndCookie } from "./tokken.js";
import { messagesError } from "../../messages/messagesErrors.js";
import {messagesSusses} from '../../messages/messagesSussess.js';
import { ObjectId } from "mongodb";

export async function  getAddPhoto(req, res, usersdb, photodb) {
  try {
    const { decoded, email, tokenIsPresent } = await getTokenAndCookie(req, usersdb);
    const user = await usersdb.findOne({ email });
    const userTokenId = decoded.userId;
    const photoArr = await photodb.find({ userId: userTokenId }).toArray();
      let imgArr = [];
    for (let elem of photoArr) {
      imgArr.push(...elem.img);
    }
    if (!user || !tokenIsPresent) {
      return res.status(404).send(messagesSusses.errors.userNotDefined);
    }
    if (user.role === 'Модератор') {
      renderData.role = user.role;
    }

    const renderData = {
      tokenIsPresent,
      user,
      imgArr,
      photoArr,
      userId: userTokenId,
      title: messagesSusses.success.successfulTitleAddAttractions,
    };

    res.render("addPhoto", renderData);
  } catch (error) {
    console.error(error, messagesError.errors.getAddPhotoError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

export async function postAddPhoto(req, res, usersdb, photodb) {
  try {
    const { decoded, login, tokenIsPresent } = await getTokenAndCookie(req, usersdb);
    let userId = decoded.userId;
    let user = await usersdb.findOne({_id: new ObjectId(userId)});
    if (user && tokenIsPresent) {
      let { attraction, countries, city, data } = req.body;
      let images = req.files; 
      let imgArr = images.map((image) => image.originalname);
      for (const image of images) {
        let imagePath = `public/img/${image.originalname}`;
        fs.writeFileSync(imagePath, fs.readFileSync(image.path));
      }
      let photoArr = {
        attraction: attraction,
        countries: countries,
        city: city,
        data: data,
        img: imgArr, 
        userId: decoded.userId,
      };
      await photodb.insertOne(photoArr);
      res.redirect(`/profile/${userId}`);
    } else {
      res.render("authorization", { errorMessage: true, userId });
    }
  } catch (error) {
    console.error(messagesError.errors.postAddPhotoError);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

