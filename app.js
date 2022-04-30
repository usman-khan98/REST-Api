const mongoose = require('mongoose');
const express = require('express');
const ejs = require('ejs');
const app = express()
// this project is REST Api
// use POSTMAN to send requests

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

// all get, post, delete targeting the same /articles route//
// use . for chaining//
// semi colon important in last while chaining //
app.route("/articles")
    .get(function(req, res){
      Article.find({}, function(err, result){
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      })
    })
    .post(function(req, res){
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
      })
      newArticle.save(function(err){
        if (err) {
          res.send(err)
        } else {
          res.send("Successfully send")
        }
      })
    })
    .delete(function(req, res){
      Article.deleteMany({}, function(err){
        if (err) {
          res.send(err)
        } else {
          res.send("Successfully Deleted")
        }
      })
    });


///////////// targeting specific articles ///////////////

app.route("/articles/:articleName")
.get(function(req, res){
  const articleTitle = req.params.articleName;
  Article.findOne({title: articleTitle}, function(err, result){
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})
.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleName},
    {title: req.body.title, content: req.body.content},
    function(err, result){
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully Updated")
      }
    }
  )
})
.patch(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleName},
    {$set: req.body},   //body parser will automatically determine if title or content was changed in request
    function(err, result){
      if (err) {
        res.send("Error occured")
      } else {
        res.send("Successfully Patched")
      }
    }
  )
})
.delete(function(req, res){
  Article.deleteOne({title: req.params.articleName}, function(err, result){
    if (err) {
      res.send("failed to delete")
    } else {
      res.send("Deleted Successfully")
    }
  })
});


app.listen(3000, function(){
  console.log("Server started at port 3000");
})
