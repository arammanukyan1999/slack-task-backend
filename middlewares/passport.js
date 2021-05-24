const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_TOKEN_KEY
const models = require('../models');

module.exports =  function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done)  => {
     await models.User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'incorrect email or password',success:false });
        }
        if (bcrypt.compareSync(password, user.dataValues.password)) {
          return done(null, user, {
            token: jwt.sign({
              id: user.id,
              email: user.email
            }, secret, {
              expiresIn: '24h'
            }),
            user: {
              id: user.id,
              email: user.email
            },
            success: true
          })
        } else return done(null, false, { message: "incorrect email or password" , success:false })

      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    models.User.findOne({ where: { id } }, function (err, user) {
      done(err, user);
    });
  });
};