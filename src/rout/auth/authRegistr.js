import { messagesError } from '../../messages/messagesErrors.js';
import { messagesSusses } from '../../messages/messagesSussess.js';
import bcrypt from "bcrypt";
const saltRounds = 10;

export async function getAuthRegister(req, res) {
  res.render("registration", {
    layout: "registration",
    title: messagesSusses.success.successfulTitleRegistr,
    registration: true,
  });
}

export async function postAuthRegister(req, res, usersdb) {
  try {
    let { name, surname, login, password, email, radio } = req.body;
    let errorEmail = "";
    let errorLogin = "";
    if (req.body.submit) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingEmail = await usersdb.findOne({ email: email });
      const existingLogin = await usersdb.findOne({ login: login });

      if (existingEmail && existingLogin) {
        errorLogin = messagesError.errors.loginEndEmailError;
        res.render("registration", {
          errorLogin: errorLogin,
        });
      } else if (existingEmail || existingLogin) {
        errorEmail = existingEmail ? messagesError.errors.notEmailError : "";
        errorLogin = existingLogin ? messagesError.errors.notLoginError : "";
        res.render("registration", {
          errorEmail: errorEmail,
          errorLogin: errorLogin,
        });
      } else {
        let user = {
          name: name,
          surname: surname,
          login: login,
          email: email,
          role: radio,
          password: hashedPassword,
        };
        await usersdb.insertOne(user);
        res.redirect("/auth/authorization");
        console.log(messagesSusses.success.successfulRegistration);
      }
    } else {
      console.error(messagesError.errors.registrationError);
    }
  } catch (err) {
    console.error(err, messagesError.errors.internalServerError);
  }
}
