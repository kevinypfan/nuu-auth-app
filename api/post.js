const {verifyRole} = require('../middleware/authenticate.js')
const express = require('express');
const _ = require('lodash');
const {Post} = require('../models/post.js');
const {ObjectID} = require('mongodb')
var postRouter = express.Router();

postRouter.post('/newPost',verifyRole, (req, res) => {
   var author = req.user.name;
   console.log(author);
  var body = _.pick(req.body,['title','content'])
  var posts = new Post(body)
   posts.time = new Date();
  posts.author = author;
  posts.save().then(()=>{
    res.send(posts)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})


postRouter.get('/getAllPost',verifyRole,(req,res)=>{
    Post.find().then((result)=>{
      res.send(result)
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

postRouter.get('/getSomePostFfront/:counter',(req,res)=>{
    var cnum = req.params.counter
    var a =  parseInt(cnum);
    console.log(typeof(a));
    Post.find().limit(a).then((result)=>{
      res.send(result)
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

postRouter.get('/getAllPostFfront',(req,res)=>{
    Post.find().then((result)=>{
      res.send(result)
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

postRouter.delete('/deletePost', verifyRole, (req, res) => {
    var pid = req.body.PostId
    console.log(pid);
     Post.findOneAndRemove({_id: pid}).then((result) => {
      res.send("刪除成功")
    }).catch((e)=>{
      res.status(403).send(e)
    })
})
postRouter.patch('/updatePost', verifyRole, (req, res) => {
    var title = req.body.title
    var content = req.body.content

  Post.findOneAndUpdate({_id: req.body.PostId},{$set:{title,content}})
    .then((result) => {
      res.send("更新成功")
    }).catch((e)=>{
      res.status(403).send(e)
    })
})

module.exports = postRouter;
