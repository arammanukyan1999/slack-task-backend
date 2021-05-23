const models = require("../models")
const passport = require('passport');

class UserController {
    async signUp(req, res) {
        console.log(req.body, 'body')
        try {

            return await models.User.create({
                password: req.body.password,
                email: req.body.email,
                fullName: req.body.fullName
            }).then((user) => {

                if (user) {
                    res.send({
                        success: true,
                        message:"registred"
                    })
                } else {
                    response.status(400).send({message:'Error in insert new record'});
                }
            })
        }
        catch (err) {
            if (err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError") {
                res.status(200).send({ message: err.message, success: false });
            }
            else
                res.status(500).send({ message: err });

        }
    }
    async signIn(req, res, next) {
        passport.authenticate('local',
            (err, user, info) => {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(401).send(info);
                }

                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    return res.send(info);
                });

            })(req, res, next);
    };
}


module.exports = new UserController
