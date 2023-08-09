const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');

const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");


const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require("node-sass-middleware");
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', './views');



// mongo store is used to store the session cookie in the db
const sessionStore = new MongoStore({
  mongoUrl: "mongodb://localhost:27017",
  mongooseConnection: db,
  autoRemove: "disabled",
});

app.use(
  session({
    name: "codeial",
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));
app.listen(port, function(err){
    if(err){
        console.log(err);
    }

    console.log(`server running on port: ${port}`);
})