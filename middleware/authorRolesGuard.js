const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(roles) {
    return function(req, res, next) {
        if(req.method == "OPTIONS"){
            next();
        }

        try {
            const authorization = req.headers.authorization
            if (!authorization) {
                return res.status(403).json({"message": "Author is not registered!"})
            }

            const bearer = authorization.split(" ")[0];
            const token = authorization.split(" ")[1];

            if(bearer != "Bearer" || !token){
                return res.status(403).json({"message": "Author is not registered! (missing token)"})
            }

            const { author_is_expert, authorRoles } = jwt.verify(token, config.get("secret"));
            let hasRole = false

            authorRoles.forEach(authorRole => {
                if (roles.includes(authorRole)) {
                    hasRole = true
                }
            });

            if(!author_is_expert || !hasRole){
                return res.status(403).json({"message": "You aren't given such a right!"})
            }
            next()
        } catch (error) {
            console.log(error);
            return res.status(403).send({"message": "Author is not registered! (incorrect token)"})
        }
    }
}