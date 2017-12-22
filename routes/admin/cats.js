/**
 * Created by diamondwang on 2016/8/31.
 */
//后台分类管理路由
var express = require('express');
var router = express.Router();
//引入mongod模块
var MongoClient = require('mongodb').MongoClient;
var DB_STR  = "mongodb://localhost:27017/tn_blog";
var ObjectId = require('mongodb').ObjectId;
//显示分类列表
router.get('/', function(req, res, next) {
    //连接数据库，查询cats集合，获取其内容
    MongoClient.connect(DB_STR,function(err,db) {
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
            //在渲染视图页面的时候，传递到视图页面中
            res.render('admin/category_list'); //data的内容是一个对象数组,数组中包含若干个对象
        });
    });

});
//显示添加分类页面
router.get('/add',function(req,res){
    // res.send('category_add');
    res.render('admin/category_add');
});
//添加分类动作
router.post('/add',function(req,res){
    //1.获取表单提交过来的数据
    var title = req.body.title;
    var sort = req.body.sort;
    //2.需要做一些必要的验证，这个环节可以先省略
    //3.将数据保存到数据库中，并完成提示并跳转
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        //此处的db，就是tn_blog数据库
        //获取cats集合
        var c = db.collection('cats');
        c.insert({title:title,sort:sort},function(err,result){ //此处不能再写res，避免覆盖express中 res对象
            if (err) {
                res.send(err);
            } else {
                //插入成功
                res.json({status:'success',msg:'添加成功'});
            }
        });
    });
});
//显示编辑分类页面
router.get('/edit',function(req,res){
    //获取查询字符串id
    var id = req.query.id;
    //需要查询数据库，获取该id对应的文档
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        //获取集合
        var c = db.collection('cats');
        c.find({_id : ObjectId(id)}).toArray(function(err,docs){
            if (err) {
                res.send(err);
                return;
            }
            res.render('admin/category_edit',{data : docs[0] }); //此处，只需要数组中的第一个对象
        });
    });


});
//更新分类动作
router.post('/edit',function(req,res){
    //1.获取表单数据
    var title = req.body.title;
    var sort = req.body.sort;
    var id = req.body.id;
    //2.完成更新操作
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.update({_id : ObjectId(id)},{$set : {"title" : title, "sort" : sort} },function(err,result){
            if (err) {
                res.send(err);
            } else {
                res.json({status:'success',msg:'更新成功'});
            }
        });
    });
});
//删除分类动作
router.get('/delete',function(req,res){
    //获取传递过来的id参数
    var id = req.query.id;
    //在数据库中使用remove删除之
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.remove({_id : ObjectId(id)},function(err,result){
            if (err) {
                res.send(err);
                return;
            }
            res.json({status:'success',msg:'删除成功'}); //删除成功
        });
    });
});
// 获取所有的分类
router.get('/allCats',(req,res,next)=>{
    // 在数据库中获取所有的分类
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find({},{title:1}).toArray((err,docs)=>{
            if(err){
                res.send(err);
                return
            }
            res.json(docs);
        });
    });
})
// 获取文章
router.get('/article',(req,res,next)=>{
    let cat = req.query.cat||'';//得到传递来的数据
    let id = req.query.id||'';//获取id
    // 在数据库中获取当前分类的所有文章的数量；
    MongoClient.connect(DB_STR,function(err,db){
        if (err) {
            res.send(err);
            return;
        }
        var p = db.collection('posts');
        if(cat){//如果有分类
            p.find({cat}).toArray((err,docs)=>{
                if(err){
                    res.send(err);
                    return;
                }
                res.json(docs);
            });
        }else if(id){//如果有id
            p.find({_id:id}).toArray((err,docs)=>{
                if(err){
                    res.send(err);
                    return;
                }
                res.json(docs);
            });
        }else{
            p.find({}).toArray((err,docs)=>{
                if(err){
                    res.send(err);
                    return;
                }
                res.json(docs);
            })
        }

    });
})

module.exports = router;
