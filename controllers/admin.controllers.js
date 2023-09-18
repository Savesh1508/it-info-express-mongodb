// const { errorHandler } = require("../helpers/error_handler.js");
// const Admin = require("../models/Admin.js");

// // GET ALL
// const getAllAdmins = async(req, res) => {
//     try {
//         const admins = Admin.find({});

//         if(!admins){
//             return res.status(404).send({"message": "Admins not found!"});
//         }

//         if(admins.length == 0){
//             return res.status(400).send({"message": "Admins is empty!"});
//         }

//         res.json({ admins })
//     } catch(error) {
//         errorHandler(res, error);
//     }
// }

// // GET BY ID
// const getAdminById = async(req, res) => {
//     try {
//         const admins = Admin.find({});

//         if(!admins){
//             return res.status(404).send({"message": "Admins not found!"});
//         }

//         if(admins.length == 0){
//             return res.status(400).send({"message": "Admins is empty!"});
//         }

//         res.json({ admins })
//     } catch(error) {
//         errorHandler(res, error);
//     }
// }