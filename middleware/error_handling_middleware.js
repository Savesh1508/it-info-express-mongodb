const ApiError = require("../error/ApiError.js");

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({"message": err.message});
    }

    // if (err instanceof SyntaxError) {
    //     return res.status(err.status).json({"message": "Syntax error!"});
    // }

    if (err.message.includes("Expected ',' or '}'")) {
        return res.status(err.status).json({"message": "You should put ',' or '}' d in the expected place!"});
    }

    return res.status(500).json({"message": "Unkown error!"})
};