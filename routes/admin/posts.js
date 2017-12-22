/**
 * Created by diamondwang on 2016/8/31.
 */
//后台文章管理路由处理  --- 控制器
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";
//显示文章列表页面
router.get('/',function(req,res){
    //获取文章
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.find().toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            //已经成功获取到数据了
            res.render('admin/article_list');
        });
    });

});

//显示添加文章页面
router.get('/add',function(req,res){
    //获取分类数据
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            //渲染视图页面，并传递数据
            res.render('admin/article_add');
        });
    });

});

//添加文章动作
router.post('/add',function(req,res){
    //获取表单提交的数据
    var cat = req.body.cat;
    var title = req.body.title;
    var summary = req.body.summary;
    var content = req.body.content;
    //需要做一些额外的处理,需要获取当前时间，构建一个对象
    var time = new Date();
    var post = {
        "cat" : cat,
        "title" : title,
        "summary" : summary,
        "content" : content,
        "time" : time
    }
    //插入到数据库
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.insert(post,function(err,result){
            if (err) {
                res.send(err);
                return;
            }
            //成功
            res.send({status:'success',msg:'添加成功'});
        });
    });

});

module.exports = router;