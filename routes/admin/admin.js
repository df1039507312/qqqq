/**
 * Created by diamondwang on 2016/8/31.
 */
//后台首页面路由
var express = require('express');
var router = express.Router();

//首页面路由处理
router.get('/',function(req,res){
    //渲染后台首页面 index.html
    // console.log(req);
    //变量
//  console.log('index');
    res.render('admin/admin');
//  res.render('admin/login');
});

module.exports = router;