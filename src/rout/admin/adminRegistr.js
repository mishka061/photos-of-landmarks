// rout\admin\adminRegistr.js
import bcrypt from "bcrypt";
import { messagesError } from "../../messages/messagesErrors.js";
import { messagesSusses } from "../../messages/messagesSussess.js";

const saltRounds = 10;

export async function getRegisterAdmin(req, res) {
  try {
    res.render("createAdmin", {
      layout: "admin",
      registration: true,
      title: messagesSusses.success.successTitleRegisterAdmin,
    });
  } catch (err) {
    console.error(err, messagesError.errors.getRegisterAdminError);
    res.status(401).send(messagesError.errors.getRegisterAdminError);
  }
}
export async function postRegisterAdmin(req, res, adminsdb) {
  try {
    let { login, email, password } = req.body;
    if (req.body.submit) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      let admin = {
        login: login,
        password: hashedPassword,
        email: email,
      };
      await adminsdb.insertOne(admin);
      console.log(messagesSusses.success.successfulRegistration);

      res.redirect("/admin/login");
    } else {
      console.error(messagesError.errors.registrationError);
      res.status(401).send(messagesError.errors.registrationError);
    }
  } catch (err) {
    console.error(err, messagesError.errors.internalServerError);
    res.status(401).send(messagesError.errors.registrationError);
  }
}
