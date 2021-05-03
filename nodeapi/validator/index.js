exports.userSignupValidator = (req, res, next) => {
  // namee is not null and between 4-10 characters
  req.check('name', 'Name is required').notEmpty();
  // email is not, valid and nonrmalized
  req
    .check('email', 'Email must bee between 3 to 32 characters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 32,
    });
  // check for password
  req
    .check('password', 'Password is required')
    .notEmpty()
    .withMessage('Password must contain at least 6 characters')
    .isLength({
      min: 4,
    })
    .matches(/\d/)
    .withMessage('Must contain a number');

  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
  // check for errors
};
