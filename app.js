import express from "express";
import mongodb from "mongodb";
import path from "path";
import cookieParser from "cookie-parser";
import expressHandlebars from "express-handlebars";
import bodyParser from "body-parser";
import multer from "multer";
import {
  postRegisterAdmin,
  getRegisterAdmin,
} from "./src/rout/admin/adminRegistr.js";
import {
  postLoginAdmin,
  getLoginAdmin,
} from "./src/rout/admin/adminLogin.js";
import { getAddPhoto, postAddPhoto} from "./src/rout/auth/addPhoto.js";
import { postAuthRegister, getAuthRegister } from "./src/rout/auth/authRegistr.js";
import { postAuthAutoriz, getAuthAutoriz } from "./src/rout/auth/authAutoriz.js";
import { getProfile, postReplyCommit } from "./src/rout/auth/profile.js";
import { postAddComment, postAddLike , postSearh} from "./src/rout/auth/comment.js";
import { getMain } from "./src/rout/auth/getMain.js";
import { getAllPotoUser } from "./src/rout/auth/allPhotoUser.js";
import { getModerator, postModerator } from "./src/rout/auth/moderator.js";
import { getAdminPanel, postAdminPanel } from "./src/rout/admin/adminPanel.js";
import { getDelete } from "./src/rout/auth/delete.js";
// import { parseData } from "./parser.js";
import { messagesError } from "./src/messages/messagesErrors.js";

let __dirname = path.resolve();

let handlebarsInstance = expressHandlebars.create({
  defaultLayout: "main",
  extname: "hbs",
});

handlebarsInstance.handlebars.registerHelper('isArray', function (arr, options) {
  return Array.isArray(arr) && arr.length > 0 ? options.fn(this) : options.inverse(this);
});

let app = express();
app.engine("hbs", handlebarsInstance.engine);
app.set("view engine", "hbs");
app.set("views", __dirname + "/src/views");

app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + "/dist/"));
app.use(express.static(__dirname + "/dist/images/"));
app.use(express.static(__dirname + "/dist/img/"));
app.use(bodyParser.urlencoded({ extended: true }));

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

let mongoClient, db, adminsdb, usersdb, photodb;

try {
  mongoClient = new mongodb.MongoClient("mongodb://127.0.0.1:27017/");
  await mongoClient.connect();
  db = mongoClient.db("photos-of-landmarks");
  adminsdb = db.collection("admins");
  usersdb = db.collection("users");
  photodb = db.collection("photo");

  app.get("/addPhoto", async function (req, res) {
    await getAddPhoto(req, res, usersdb, photodb);
  });
  app.post("/addPhoto", upload.array("image[]"), async function (req, res) {
    await postAddPhoto(req, res, usersdb, photodb);
  });

  // Парсинг данных и сохранение их в базе данных
  // (async () => {
  //   try {
  //     await parseData(photodb); // Передаем photodb в parseData
  //   } catch (error) {
  //     console.error(messages.errors.parsingError, error);
  //   }
  // })();
  
  app.get("/admin", async function (req, res) {
    await getAdminPanel(req, res, usersdb, adminsdb);
  });

  app.post("/admin", async function (req, res) {
    await postAdminPanel(req, res, usersdb);
  });
  app.get("/moderator", async function (req, res) {
    await getModerator(req, res, usersdb, photodb)
  });

  app.post("/moderator",upload.array("image[]"), async function (req, res) {
    await postModerator(req, res, usersdb, photodb)
  });
  app.get("/", async function (req, res) {
    await getMain(req, res, usersdb, photodb)
  });

  app.post("/", async function (req, res) {
    const action = req.body.action;
    if (action === 'comment') {
      await postAddComment(req, res, photodb);
    } else if (action === 'like') {
      await postAddLike(req, res, photodb);
    }else if (action === 'search') {
      await postSearh(req, res,usersdb, photodb);
    }
     else {
      res.status(400).send(messages.errors.internalServerError);
    }
  });

  app.get("/index", async function (req, res) {
    await getAllPotoUser(req, res, photodb, usersdb)
  });
  app.get("/admin/registration", async function (req, res) {
    await getRegisterAdmin(req, res);
  });

  app.post("/admin/registration", async function (req, res) {
    await postRegisterAdmin(req, res, adminsdb);
  });
  app.get("/admin/login", async function (req, res) {
    await getLoginAdmin(req, res);
  });

  app.post("/admin/login", async function (req, res) {
    await postLoginAdmin(req, res, adminsdb);
  });

  app.get("/auth/registration", async function (req, res) {
    await getAuthRegister(req, res)
  });

  app.post("/auth/registration", async function (req, res) {
    await postAuthRegister(req, res, usersdb);
  });

  app.get("/auth/authorization", async function (req, res) {
    await getAuthAutoriz(req, res)
  });

  app.post("/auth/authorization", async function (req, res) {
    console.log("post authorization");
    await postAuthAutoriz(req, res, usersdb);
  });

  app.get("/profile/:id", async function (req, res) {
    await getProfile(req, res, usersdb, photodb);
  });

  app.post("/profile/:id", async function (req, res) {
    await postReplyCommit(req, res, photodb);
  });
  app.get("/delete/:id", async function (req, res) {
    await getDelete(req, res, photodb, usersdb);
  });

  app.post("/logout", function (req, res) {
    res.cookie("token", null, { expires: new Date(0) });
    res.sendStatus(200); 
  });
} catch (err) {
  console.error(err);
}

app.use(function (req, res) {
  res.status(404).render("404", {
    layout: "404",
    title: messagesError.errors.titleError,
  });
});

app.listen(3000, function () {
  console.log("running");
});


