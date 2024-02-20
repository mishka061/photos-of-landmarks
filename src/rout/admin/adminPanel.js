import { ObjectId } from "mongodb";
import { messagesError } from "../../messages/messagesErrors.js";
import { messagesSusses } from "../../messages/messagesSussess.js";

export async function getAdminPanel(req, res, usersdb) {
  let usersArr = await usersdb.find().toArray();
  res.render("adminPanel", {
    layout: "adminPanel",
    usersArr: usersArr,
    title: messagesSusses.success.successfulTitlePanelAdmin,
  });
}

export async function postAdminPanel(req, res, usersdb) {
  try {
    let role = req.body.role;
    if (req.body.submit) {
      let users = {
        name: req.body.name,
        surname: req.body.surname,
        login: req.body.login,
        password: req.body.password,
        role: role,
      };
      let userId = new ObjectId(req.body._id);
      await usersdb.updateOne({ _id: userId }, { $set: users });
      res.redirect("/admin");
    }
  } catch (err) {
    console.error(err, messagesError.errors.postAdminPanelError);
    res.status(500).send(messagesError.errors.postAdminPanelError);
  }
}
