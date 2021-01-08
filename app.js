//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const trimText = require("./public/js/TrimText")
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const PORT = process.env.PORT || 3000
const article = [];
const url = "mongodb://localhost:27017/ArticleDB";
//const url = "mongodb+srv://shavezkhan-admin:DevOp123@cluster0.2oic9.mongodb.net/ArticleDB"
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to mongoDB server...");
});

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Mongoose Schema and model creations.
const articleSchema = new mongoose.Schema({

  Title: {
    type: String,
    required: true
  },
  Post: {
    type: String
  }
});
const articleModel = mongoose.model("Article", articleSchema);
//end here.
//#region Get Methods
//Url : /
app.get('/', (req, res) => {
  articleModel.find({}, (err, foundArticle) => {
    if (err) {
      console.log("Selection failed, Issue is : " + err);
      res.redirect("/");
    } else {
      res.render("home.ejs", {
        homeContent: homeStartingContent,
        article: foundArticle
      })
    }
  });
});

//Url : /compose
app.get('/compose', (req, res) => {
  res.render("compose.ejs")
})

//Url : /about
app.get('/about', (req, res) => {
  res.render("about.ejs", { aboutContent: aboutContent })
})

//Url : /contact
app.get('/contact', (req, res) => {
  res.render("contact.ejs", { contactContent: contactContent })
})

//Url : /post/title/:title
app.get('/post/title/:postId', (req, res) => {
  let reqParam = req.params;
  articleModel.findOne({ _id: reqParam.postId }, (err, foundArticle) => {
    if (err) {
      console.log("Selection failed, Issue is : " + err);
      res.redirect("/");
    } else {
      console.log(reqParam.postId);
      res.render("post", { ArticleTitle: foundArticle })
    }
  });
});


//Url : /remove
app.get('/remove', function (req, res) {
  articleModel.find({}, (err, foundArticle) => {
    if (err) {
      console.log("Selection failed, Issue is : " + err);
      res.redirect("/");
    } else {
      res.render("remove.ejs", {
        article: foundArticle
      })
    }
  });
})
//#endregion

//#region Post Methods
app.post('/', function (req, res) {
  let articleObj = new articleModel({
    Title: _.capitalize(req.body.title),
    Post: req.body.post
  });
  articleModel.insertMany(articleObj, (err) => {
    if (err) {
      console.log("Insertion faild,Issue is : " + err);
      res.redirect("/");
    } else {
      console.log("Successfully inserted...");
    }
  });
  res.redirect("/");
})

app.post('/remove', function (req, res) {
  let idParam = req.body.submit;
  articleModel.deleteOne({ _id: idParam }, (err) => {
    if (err) {
      console.log("error occur : " + err);
    } else {
      console.log("done " + idParam);
      res.redirect("/");
    }
  });
})
//#endregion

//App listen.
app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
