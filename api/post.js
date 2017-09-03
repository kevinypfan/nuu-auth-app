const {verifyRole} = require('../middleware/authenticate.js')
const express = require('express');
const _ = require('lodash');
const {Post} = require('../models/post.js');

var postRouter = express.Router();

postRouter.post('/newPost',verifyRole, (req, res) => {
   var author = req.user.name;
   console.log(author);
  var body = _.pick(req.body,['PostId','title','content'])
  var posts = new Post(body)
   posts.time = new Date();
  posts.author = author;
  posts.save().then(()=>{
    res.send(posts)
  }).catch((e)=>{
    res.status(403).send(e)
  })
})

module.exports = postRouter;
