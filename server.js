const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const basic_port = 8000;
const db_id = "db_id";
const db_password = "db_password";
const db_url = "db_url";
const db_name = "db_name";
//lib config
dotenv.config();

//env setting
app.set("PORT", process.env.PORT || basic_port);
app.set("DB_ID", encodeURIComponent(process.env.DB_ID) || db_id);
app.set(
  "DB_PASSWORD",
  encodeURIComponent(process.env.DB_PASSWORD) || db_password
);
app.set("DB_URL", encodeURIComponent(process.env.DB_URL) || db_url);
app.set("DB_NAME", encodeURIComponent(process.env.DB_NAME) || db_name);

MongoClient.connect(
  `mongodb+srv://${app.get("DB_ID")}:${app.get("DB_PASSWORD")}@${app.get(
    "DB_URL"
  )}/${app.get("DB_NAME")}?retryWrites=true&w=majority`,
  (error, client) => {
    if (error) return console.log(error);

    db = client.db("bonde");

    app.listen(app.get("PORT"), () => {
      console.log(`listening on ${app.get("PORT")}`);
    });
  }
);

// storeList API
app.use("/api", require("./routes/api/storelist"));

// youtubeList API
app.use("/api", require("./routes/api/youtubelist"));

// youtuberList API
app.use("/api", require("./routes/api/youtuberlist"));

// auth
// login API
app.use("/auth", require("./routes/auth/login"));

// const list =
// 엑셀 리스트 db에 저장하기
// app.get("/update", (req, res) => {
//   res.send("완료");

//   list.map((store) => {
//     db.collection("youtuber_list").insertOne(store);
//   });
// });
