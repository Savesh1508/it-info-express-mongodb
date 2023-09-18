// const { Router } = require('express');
// const express = require('express');
// const {
//     getAllAdmins,
//     getAdminById,
//     addAdmin,
//     updateAdminById,
//     deleteAdminById,
//     loginAdmin,
//     logoutAdmin,
//     refreshAdminToken,
// } = require('../controllers/author.controllers.js');

// const router = Router()

// express.Router.prefix = function(path, subRouter){
//     const router = express.Router();
//     this.use(path, router);
//     subRouter(router);
//     return router
// }

// router.prefix("/", (adminRouter) => {
//     adminRouter.get("/", getAllAdmins);
//     adminRouter.get("/:id", getAdminById);
//     adminRouter.post("/", addAdmin);
//     adminRouter.put("/:id", updateAdminById);
//     adminRouter.dalete("/:id", deleteAdminById);
//     adminRouter.post("/login", loginAdmin);
//     adminRouter.post("/logout", logoutAdmin);
//     adminRouter.post("/refresh", refreshAdminToken);
// })



// module.exports = router