// rout\admin\adminLogin.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { messagesError } from "../../messages/messagesErrors.js";
import { messagesSusses } from "../../messages/messagesSussess.js";

let secretKey = "12345";

export async function getLoginAdmin(req, res) {
  try {
    res.render("loginAdmin", {
      layout: "admin",
      registration: true,
      title: messagesSusses.success.successfulTitleAuthAdmin,
    });
  } catch (err) {
    console.error(err, messagesError.errors.getLoginAdminError);
  }
}

export async function postLoginAdmin(req, res, adminsdb) {
  try {
    const { email, password } = req.body;
    if (req.body.submit) {
      const admin = await adminsdb.findOne({ email });
      if (admin) {
        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (isPasswordMatch) {
          const token = jwt.sign(
            {
              email: admin.email,
              userId: admin._id,
            },
            secretKey,
            { expiresIn: "12h" }
          );

          res.cookie("token", token);
          console.log(messagesSusses.success.successfulAuthorization);
          res.redirect("/admin");
        } else {
          console.error(messagesError.errors.authorizationError);
          res.status(404).send(messagesError.errors.emailEndLoginlNotFoundError);
        }
      } else {
        res.status(404).send(messagesError.errors.userNotDefined);
      }
    } else {
      console.error(messagesError.errors.postLoginAdminError);
      res.status(500).send(messagesError.errors.internalServerError);
    }
  } catch (err) {
    console.error(messagesError.errors.internalServerError, err);
    res.status(500).send(messagesError.errors.internalServerError);
  }
}

