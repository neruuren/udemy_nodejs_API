const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post
    .find()
    .then(result => {
      if(result.length === 0) {
        const error = new Error('Could not find any Posts !!');
        error.statusCode = 404;
        throw error;
      }
      console.log(result);
      res
      .status(200)
      .json({
        message: 'Posts fetched.', //optionnal
        posts: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

}

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post
    .findById(postId)
    .then(post => {
      if(!post) {
        const error = new Error('Could not find Post !!');
        error.statusCode = 404;
        throw error;
      }
      console.log(post);
      res
      .status(200)
      .json({
        message: 'Post fetched.', //optionnal
        post: post,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect. !!!');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title, 
    content: content,
    imageUrl: 'images/canard.jpg',
    creator: {
      name: 'Grégory',
    },
  });

  //create post in db
  post
    .save()
    .then(result => {
      console.log(result);
      res
      .status(201) 
      .json({
        message: 'Post created successfully',
        post: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });


}
