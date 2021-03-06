const fs = require('fs');
const Post = require('../models/post');
const formidable = require('formidable');
const _ = require('lodash');

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('postedBy', '_id name')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name role')
    .select('_id title description created likes comments photo')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

exports.getPosts = (req, res) => {
  Post.find()
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .select('_id title description created likes')
    .sort({ created: -1 })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image couldnot be uploaded',
      });
    }

    let post = new Post(fields);

    req.profile.hashedPassword = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          msg: 'Unable to create post',
        });
      }
      res.json(result);
    });
  });
};

exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate('postedBy', '_id name')
    .select('_id title description created likes')
    .sort({ created: -1 })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      error: 'User is not authorized',
    });
  }
  next();
};

// exports.updatePost = (req, res, next) => {
//   let post = req.post;
//   post = _.extend(post, req.body);

//   post.updated = Date.now();

//   post.save((err) => {
//     if (err) {
//       return res.status(400).json({
//         error: err,
//       });
//     }
//     res.json(post);
//   });
// };

exports.updatePost = (req, res, next) => {
  let form = new formidable();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded',
      });
    }
    // save user
    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(post);
    });
  });
};

exports.deletePost = (req, res, next) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: 'deleted successfully',
    });
  });
};

exports.photo = (req, res, next) => {
  res.set('Content-Type', req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.singlePost = (req, res, next) => {
  return res.json(req.post);
};

exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.body.userId },
    },
    { new: true },
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.body.userId },
    },
    { new: true },
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

exports.comment = (req, res) => {
  const comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true },
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

exports.uncomment = (req, res) => {
  const comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: { _id: comment._id } },
    },
    { new: true },
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
};
