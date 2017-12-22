var express = require('express');
var router = express.Router();
//引入mongod模块
var MongoClient = require('mongodb').MongoClient;
var DB_STR  = "mongodb://localhost:27017/tn_blog";

//载入session模块
var session = require('express-session');

/* GET users listing. */

// router.use('/login',checkNotLogin);

router.get('/login', function(req, res, next) {
   //载入登录页面
  res.render('admin/login');
  //res.send('respond with a resource');
});

//用户登录处理
router.post('/signin',function(req,res){
    //获取用户名和密码
    var username = req.body.username;
    var pwd = req.body.pwd;
    console.log(username,pwd);
    //到数据库做一个比对查询
   MongoClient.connect(DB_STR,function(err,db){
     if (err) {
       res.send(err);
       return;
     }
     var c = db.collection('users');
     c.find({username : username, pwd : pwd}).toArray(function(err,docs){
         if (err) {
             res.send(err);
             return;
         }
         //console.log(docs);
         //docs就是查询的结果,[] 或者[对象]，实际上只需要判断数组是否为空就可以了
         if (docs.length) {
             //登录成功，需要完成两件事情，保存用户登录标识，然后跳转
             console.log('here');
             req.session.isLogin = true;
             req.session.userInfo={
                 username:username
             };
             //console.log(req.session);
             res.redirect('/admin/index');
         } else {
             //登录失败
             res.redirect('/admin/users/login');
         }
     });
   });
});

//用户注销
router.get('/logout',function(req,res){
    //清除session，然后跳转
    req.session.isLogin = null;
    res.redirect('/admin/index');
});

//判断用户是否已经登录了
function checkNotLogin(req,res,next){
    if (req.session.isLogin) {
        //表示已经登录了，跳转到原先的页面
        res.redirect('back');
    }else{
        next();
    }
    
}
module.exports = router;
