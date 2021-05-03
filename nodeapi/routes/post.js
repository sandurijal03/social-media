const express = require('express');
const router = express.Router();

const {
  getPosts,
  createPost,
  postById,
  deletePost,
  isPoster,
  updatePost,
  postsByUser,
  photo,
  singlePost,
  like,
  unlike,
  comment,
  uncomment,
} = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/posts', getPosts);

// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

// comments  uncomments
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

router.post('/post/new/:userId', requireSignin, createPost);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.get('/post/:postId', singlePost);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// photo
router.get('/post/photo/:postId', photo);

router.param('userId', userById);
router.param('postId', postById);

module.exports = router;
