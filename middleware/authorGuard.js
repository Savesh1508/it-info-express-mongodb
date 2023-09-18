// const jwt = require('jsonwebtoken');
// const config = require('config');
const MyJwt = require("../services/JwtService.js");
const { badRequest } = require('../error/ApiError');

async function to(promise) {
    return promise
        .then((response) => [null, response]) // [null, response]
        .catch((error) => [error]); // [error, null]
}


module.exports = async function(req, res, next) {
    if(req.method == "OPTIONS"){
        next();
    }

    // throw badRequest("badRequest error!");
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(403).json({"message": "Admin is not registered!"})
        }

        const bearer = authorization.split(" ")[0];
        const token = authorization.split(" ")[1];

        if(bearer != "Bearer" || !token){
            // return res.status(403).json({"message": "Admin is not registered! (missing token)"})
            throw badRequest("Admin is not registered! (incorrect token)");
        }

        // const decodedToken = jwt.verify(token, config.get("secret"));
        const [error, decodedToken] = await to(
            // jwt.verify(token, config.get("secret"))
            MyJwt.verifyAccess(token)
        );

        if(error) {
            return res.status(403).json({"message": error.message})
        }


        if(!decodedToken.is_active) {
            return res.status(400).json({"message": "Admin banned!"})
        }

        /////
        req.admin = decodedToken;
        next()
    } catch (error) {
        console.log(error);
        return res.status(403).send({"message": "Admin is not registered! (incorrect token)"})
    }
};