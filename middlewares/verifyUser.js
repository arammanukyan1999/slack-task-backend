
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_TOKEN_KEY
const models = require("../models")
module.exports = async function verifyUser(req, res, next) {
    if (req.headers.authorization) {
        try {
            let token = req.headers.authorization

            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length)
                if (!token || token === '') res.status(401).send("No token provided")
            }
            let decod = jwt.verify(token, secret)
            let user = await models.User.findOne({
                where: { id: decod.id }
            })
            if (user) {
                req.user = user
            } else {
                res.status(404).send("user not found")
            }
            return next()
        } catch (err) {
            return res.status(401).send(err)
        }
    } else {
        res.status(403).send({
            message: "No token provided"
        })
    }
}