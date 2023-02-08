const mongoose = require('mongoose');
const express = require('express');
const ejs = require('ejs');
const app = express()


app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

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
    {$set: req.body},   
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
