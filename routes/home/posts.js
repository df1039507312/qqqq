/**
 * Created by diamondwang on 2016/8/31.
 */
//针对前台博客文章页面的路由
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR  = "mongodb://localhost:27017/tn_blog";
var ObjectId = require('mongodb').ObjectId;
//针对/的请求
router.get('/',function(req,res){
    //获取id参数
    var id = req.query.id;
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.find({_id : ObjectId(id)}).toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            //获取ok,渲染article模板文件
            res.render('home/article',{data : docs[0]});
        });
    });

});
module.exports = router;
