const router = require('express').Router();
const { requireSignin } = require('../controllers/auth');
const {
  allUsers,
  userById,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollower,
  removeFollowing,
  findPeople,
} = require('../controllers/user');

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);

router.get('/user/photo/:userId', userPhoto);

// whho to follow
router.get('/user/findpeople/:userId', requireSignin, findPeople);

router.param('userId', userById);

module.exports = router;
