// imports
require("dotenv").config();
const express =require("express");
const bodyParser = require('body-parser');
const mongoose =require("mongoose");
const session =require("express-session");

const app= express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT= process.env.PORT|| 4000;

// database connexion
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the database!"));

//milddlewars
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(
    session({
        secret:"my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req,res,next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");


// route prefix
app.use("",require("./routes/routes"));

/**
 * app.get("/",(req,res)=>{
    res.send("Hello World");
 });
 */

 app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`);
 });
