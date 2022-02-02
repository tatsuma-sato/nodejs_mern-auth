const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./util/db");

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./auth/authenticate");

const userRouter = require("./routes/userRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELIST_DOMAINS
  ? process.env.WHITELIST_DOMAINS.split(".")
  : [];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOption));
app.use(passport.initialize());
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send({ status: "Success" });
});

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App started at port: `, port);
});
