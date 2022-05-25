import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";


// init app
const app = express();
dotenv.config();

//setting up middlewares
app.use(bodyParser.json({limit: "30mb", extended: true})); // the limt is 30mb here because i would be send images throght the media also
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// variables
const CONNECTION_URL = "";
const PORT = process.env.PORT || 5000


// connection the application to the database
mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => app.listen(PORT, () => console.log(`Server running at port: ${PORT}`)))
    .catch(err => console.log(err.message))

// mongoose.set("useFindAndModify", false);



// connecting routes to the express server
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
