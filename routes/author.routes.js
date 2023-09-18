const express = require('express');

const { Router } = require('express');
const router = Router();

const {
    getAllAuthors,
    getAuthorById,
    addAuthor,
    updateAuthorById,
    deleteAuthorById,
    loginAuthor,
    logoutAuthor,
    refreshAuthorToken,
    authorActivation,
} = require('../controllers/author.controllers.js');

const Validator = require('../middleware/validator.js');
const authorGuard = require("../middleware/authorGuard.js")
const authorRolesGuard = require("../middleware/authorRolesGuard.js")

express.Router.prefix = function(path, subRouter){
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}


router.prefix("/", (authorRouter) => {
    authorRouter.get('/', authorGuard, getAllAuthors);
    authorRouter.get('/:id', authorRolesGuard(["READ", "WRITE", "CHANGE", "DELETE"]), getAuthorById);
    authorRouter.post('/', Validator("author"), addAuthor);
    authorRouter.put('/:id', Validator("author"), authorGuard , updateAuthorById);
    authorRouter.delete('/:id', authorGuard, deleteAuthorById);
    authorRouter.post('/login', Validator("author_email_pass"), loginAuthor);
    authorRouter.post('/logout', logoutAuthor);
    authorRouter.post('/refresh', refreshAuthorToken);
    authorRouter.get('/activate/:link', authorActivation);
    // authorRouter.prefix("/topic", (topicRouter) => {
    //     topicRouter.post("/add", addTopic)
    // })
})

module.exports = router