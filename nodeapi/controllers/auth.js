require('dotenv').config();

const jwt = require('jsonwebtoken');
const exprssJwt = require('express-jwt');

const User = require('../models/user');

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: 'Email is taken',
    });
  }
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ user });
};

exports.signin = (req, res) => {
  // find the userr based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email doesnot exist. Please signup.',
      });
    }
    // if user is found maake sure email annd password matched

    // creaete authenticate method in model and user heere
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password donot match.',
      });
    }

    // generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist the token as t in cookie with expiry date
    res.cookie('token', token, { expire: new Date() + 9999 });

    // return response with user and tokeen to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  return res.json({ msg: 'Signed out successfully' });
};

exports.requireSignin = exprssJwt({
  // if the token is valid, express jwt appends thee verified users id
  // in an auth key to the request object
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256'],
});
