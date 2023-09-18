const express = require('express');
const { Router } = require('express');

const viewRoutes = require('./view.routes.js');
const dictionaryRoutes = require('./dictionary.routes.js');
const categoryRoutes = require('./category.routes.js');
const descriptionRoutes = require('./description.routes.js');
const synonymRoutes = require('./synonym.routes.js');
const socialRoutes = require('./social.routes.js');
const authorRoutes = require('./author.routes.js');
// const adminRoutes = require('./admin.routes.js');


express.Router.prefix = function(path, subRouter){
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

const router = Router();

router.use("/", viewRoutes);

router.prefix("/api", (apiRouter) => {
    apiRouter.use('/dictionary', dictionaryRoutes);
    apiRouter.use('/category', categoryRoutes);
    apiRouter.use('/description', descriptionRoutes);
    apiRouter.use('/synonym', synonymRoutes);
    apiRouter.use('/social', socialRoutes);
    apiRouter.use('/author', authorRoutes);
    // apiRouter.use('/admin', adminRoutes);
})

module.exports = router