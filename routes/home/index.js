var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR  = "mongodb://localhost:27017/tn_blog";
/* GET home page. */
router.get('/', function(req, res, next) {
  //获取数据
  MongoClient.connect(DB_STR,function(err,db){
      if (err) {
        res.send(err);
        return;
      }
      //获取博客文章
      var c = db.collection('posts');
      c.find().toArray(function(err,docs){
        if (err) {
          res.send(err);
          return;
        }
        //同时获取分类
        var c1 = db.collection('cats');
        c1.find().toArray(function(err,result){
            if (err) {
              res.send(err);
              return;
            }
            //已经获取到分类数据
          console.log(docs);
          res.render('home/index', { data : docs,data1 : result });

        });

      });
  });



});

module.exports = router;
