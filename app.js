const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');
const bodyParser=require('body-Parser');

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({encoded:true}));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser: true});

const articleSchema={
  title:String,
  content: String
};
const Article=mongoose.model("Article",articleSchema);

////////////////////Request targeting all articles////////////////////////
app.route("/articles")
.get(function(req,res){
Article.find(function(err,foundArticles){
  if(!err){
    res.send(foundArticles);
}else{
  res.send(err);
}
})
})

.post(function(req,res){
const newArticle=new Article({
title:  req.body.title,
content: req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("Successfully added a new article");
  }else{
    res.send(err);
  }
});
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all Articles");
    }else{
      res.send(err);
    }
  })
});

////////////////////Request targeting all articles////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  const requestedtitle=req.params.articleTitle;
  Article.findOne({title:requestedtitle},function(err,foundArticles){
    if(!err){
      res.send(foundArticles)
    }else{
      res.send("No articles matching the title found");
    }
  })
})
.put(function(req,res){
  Article.findOneAndUpdate({title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},{new: true, overwrite:true},
  function(err){
    if(!err){
      res.send("Successfully updated article");
    }else{
      res.send(err);
    }
  }
);
})
.patch(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {$set:req.body},
  function(err){
    if(!err){
      res.send("Successfully updated article");
    }else{
      res.send(err);
    }
  }
);
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Document Successfully deleted");
      }else{
        res.send(err);
      }
    }
  );
});
app.listen(3000,function(){
  console.log("Sucessfully Server Started at PORT 3000");

});
