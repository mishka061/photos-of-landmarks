import { messagesSusses } from "../../messages/messagesSussess.js";
import { messagesError } from "../../messages/messagesErrors.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import secretKey from "./tokken.js";

export async function getAuthAutoriz(req, res) {
  res.render("authorization", {
    layout: "registration",
    authorization: true,
    title: messagesSusses.success.successfulTitleAuthoriz,
  });
}

export async function postAuthAutoriz(req, res, usersdb) {
  try {
    let { email, password } = req.body;
    if (req.body.submit) {
      let user = await usersdb.findOne({ email });
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          let token = jwt.sign(
            {
              email: user.email,
              password: user.password,
              userId: user._id,
            },
            secretKey,
            { expiresIn: "12h" }
          );
          res.cookie("token", token);
          console.log(messagesSusses.success.successfulAuthorization);
          res.redirect("/");
        } else {
          let errorAuthorization =
            messagesError.errors.emailEndLoginlNotFoundError;
          res.render("authorization", {
            layout: "registration",
            errorAuthorization: errorAuthorization,
          });
          console.error(messagesError.errors.authorizationError);
        }
      } else {
        let errorAuthorization =
          messagesError.errors.emailEndLoginlNotFoundError;
        res.render("authorization", {
          layout: "registration",
          errorAuthorization: errorAuthorization,
        });
        console.error(messagesError.errors.authorizationError);
      }
    } else {
      console.error(messagesError.errors.postAuthorizationError);
    }
  } catch (err) {
    console.error(messagesError.errors.internalServerError, err);
  }
}
