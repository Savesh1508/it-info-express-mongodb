const Author = require('../models/Author.js');
const config = require('config');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mongoose = require('mongoose');

const { errorHandler }= require('../helpers/error_handler.js');
const { authorValidation } = require('../validations/author.validations.js');
const MyJwt = require("../services/JwtService.js");
const mailService = require("../services/MailService.js");

// GENERATE TOKEN
// To make token generation and updating more universal, we created 'services' folder!
// const generateAccessToken = (id, author_is_expert, authorRoles) => {
//     const payload = {
//         id,
//         author_is_expert,
//         authorRoles
//     }

//     return jwt.sign(payload, config.get("secret"), {expiresIn: "1h"});
// }


// GET ALL
const getAllAuthors = async(req, res) => {
    try {
        const authors = await Author.find({});

        if (!authors) {
            return res.status(404).send({"message": "Authors not found!"});
        }

        if(authors.length === 0){
            return res.status(200).send({"message": "Authors is empty"});
        }

        res.json({ data: authors });
    } catch(error) {
        errorHandler(res, error);
    }
}

// GET BY ID
const getAuthorById = async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const author = await Author.findOne({"_id": req.params.id});
        if (!author) {
            return res.status(404).send({"message": "There is no author with such ID!"});
        }

        res.json(author);
    } catch(error) {
        errorHandler(res, error);
    }
}

// CREATE
const addAuthor = async(req, res) => {
    try {
        // const { error, value } = authorValidation(req.body);
        // if (error) {
        //     console.log(error);
        //     return res.status(400).send({"message": error.details[0].message});
        // }

        ///////////////////////////////////////////////////////
        const {
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_password,
            author_info,
            author_position,
            author_photo,
            author_is_expert,
        } = req.body;

        if (!author_first_name || !author_nick_name || !author_email || !author_email || !author_password){
            return res.status(400).send({"message": "You should enter all required data!"});
        }

        const existedAuthor = await Author.findOne({
            $or: [
                {"author_nick_name": { $regex: author_nick_name, $options: "i"}},
                {"author_email": { $regex: author_email, $options: "i"}},
            ]
        });

        if (existedAuthor) {
            return res.status(400).send({"message": "This author already exists!"})
        }

        const hashedPassword = bcrypt.hashSync(author_password, 7);
        const author_activation_link = uuid.v4();

        const newAuthor = await Author({
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_password: hashedPassword,
            author_info,
            author_position,
            author_photo,
            author_is_expert,
            author_activation_link,
        });

        await newAuthor.save();

        await mailService.sendActivationMail(
            author_email, `${config.get("api_url")}/api/author/activate/${author_activation_link}`
        );

        /////
        const payload = {
            id: newAuthor._id,
            author_is_expert: newAuthor.author_is_expert,
            authorRoles: ["READ", "WRITE"],
            author_is_active: newAuthor.author_is_active,
        };


        //const tokens = MyJwt.generateTokens(payload)
        const accessToken = MyJwt.generateAccessToken(payload);
        const refreshToken = MyJwt.generateRefreshToken(payload);

        newAuthor.author_token = refreshToken;
        await newAuthor.save();

        res.cookie("refreshToken", refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
        });

        return res.status(201).send({ accessToken, refreshToken, author: payload });
        // return res.status(201).send({ ...tokens, author: payload });
    } catch(error) {
        errorHandler(res, error);
    }
}

// UPDATE BY ID
const updateAuthorById = async(req, res) => {
    try {
        // const { error, value } = authorValidation(req.body);
        // if (error) {
        //     console.log(error);
        //     return res.status(400).send({"message": error.details[0].message});
        // }

        ///////////////////////////////////////////////////////

        const reqParamsId = req.params.id

        if (reqParamsId !== req.author.id) {
            return res.status(401).send({"message": "You don't have that right!"});
        }

        if (!mongoose.isValidObjectId(reqParamsId)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const {
            author_first_name,
            author_last_name,
            author_nick_name,
            author_email,
            author_phone,
            author_password,
            author_info,
            author_position,
            author_photo,
            author_is_expert,
        } = req.body;

        const existedAuthor = await Author.findOne({
            $or: [
                {"author_nick_name": { $regex: author_nick_name, $options: "i"}},
                {"author_email": { $regex: author_email, $options: "i"}},
            ]
        });

        if (existedAuthor) {
            return res.status(400).send({"message": "This author already exists!"})
        }

        const hashedPassword = bcrypt.hashSync(author_password, 7);

        const updateResult = await Author.updateOne(
            {
                "_id": reqParamsId
            },
            {
                $set:{
                    author_first_name,
                    author_last_name,
                    author_nick_name,
                    author_email,
                    author_phone,
                    author_password: hashedPassword,
                    author_info,
                    author_position,
                    author_photo,
                    author_is_expert,
                }
            }
        )

        if (updateResult.modifiedCount > 0){
            return res.status(400).send({"message": "Author data's successfully changed!"});
        } else if (updateResult.matchedCount === 0){
            return res.status(404).send({"message": "There is no author with such ID!"});
        }
    } catch(error) {
        errorHandler(res, error);
    }
}

// DELETE BY ID
const deleteAuthorById = async(req, res) => {
    try {
        const reqParamsId = req.params.id
        if (reqParamsId !== req.author.id) {
            return res.status(401).send({"message": "You don't have that right!"});
        }

        if (!mongoose.isValidObjectId(reqParamsId)) {
            return res.status(400).send({"message": "Incorrect ID!"});
        }

        const deleteResult = await Author.deleteOne(
            {
                "_id": reqParamsId
            }
        )

        if (deleteResult.deletedCount > 0) {
            return res.status(400).send({"message": "Author data's successfully deleted!"});
        } else if (deleteResult.deletedCount === 0) {
            return res.status(404).send({"message": "There is no author with such ID!"});
        }

        // OR
        // const result = await Author.findOne({"_id": reqParamsId});

        // if (result == null) {
        //     return res.status(400).send({"message": "There is no author with such ID!"});
        // }
        // await Author.findByIdAndDelete(paramsId);
        // res.status(200).send({"message": "Author data's successfully deleted!"});
    } catch(error) {
        errorHandler(res, error);
    }
}

// LOG IN
const loginAuthor = async(req, res) => {
    try {
        const { author_email, author_password } = req.body;

        const author = await Author.findOne({ author_email });
        if (!author) {
            return res.status(400).send({"message": "Incorrect e-mail or password!"});
        }

        const validPassword = bcrypt.compareSync(
            author_password, // Open password that came from frontend
            author.author_password // Hashed password that came from database
        );

        console.log(author.author_password);

        if (!validPassword) {
            return res.status(400).send({"message": "Incorrect e-mail or password!"});
        }

        const payload = {
            id: author._id,
            author_is_expert: author.author_is_expert,
            authorRoles: ["READ", "WRITE"]
        }

        // const token = generateAccessToken(author._id, author.author_is_expert, ["READ", "WRITE"]);

        //////////
        // const tokens = MyJwt.generateTokens(payload);
        // console.log(tokens);
        //////////

        const accessToken = MyJwt.generateAccessToken(payload);
        const refreshToken = MyJwt.generateRefreshToken(payload);

        author.author_token = refreshToken;
        await author.save();

        res.cookie("refreshToken", refreshToken, {
            maxAge: config.get("refresh_ms"),
            // httpOnly: true,
        })

        // res.status(200).send({ token: token });
        ////////// res.status(200).send({ ...tokens });

        ////////////////////////////////////ERRORS
        ////////// uncaughtException
        // try {
        //     setTimeout(function() {
        //         var err = new Error("Uncaught Exception!");
        //         throw err;
        //     }, 1000);
        // } catch(err) {
        //     console.log(err);
        // }

        // ////////// unhandledRejection
        // new Promise((_, reject) => reject(new Error("Unhandled Rejection!")));

        res.status(200).send({ accessToken, refreshToken });
    } catch(error) {
        errorHandler(res, error);
    }
}

// LOGOUT
const logoutAuthor = async(req, res) => {
    const { refreshToken } = req.cookies;

    let author;
    if(!refreshToken){
        return res.status(400).send({"message": "Undefined token!"});
    }

    author = await Author.findOneAndUpdate(
        { author_token: refreshToken }, // Search for the right author
        { $set: { author_token: "", new: true }},
    )

    if (!author) {
        return res.status(400).send({"message": "Undefined token!"});
    }

    res.clearCookie("refreshToken");
    res.status(200).send({"message": "Author is logout!"})
}

// REFRESH
const refreshAuthorToken = async(req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if(!refreshToken) {
            return res.status(400).send({"message": "Undefined token"});
        }

        const authorDataFromCookie = await MyJwt.verifyRefresh(refreshToken);

        const authorDataFromDB = await Author.findOne({"author_token": refreshToken});
        if (!authorDataFromCookie || !authorDataFromDB) {
            return res.status(400).send({"message": "Author is not registered!"});
        }

        const author = await Author.findById(authorDataFromCookie.id);
        if (!author) {
            return res.status(400).send({"message": "Incorrect ID"});
        }

        const payload = {
            id: author._id,
            author_is_expert: author.author_is_expert,
            authorRoles: ["READ", "WRITE"],
        };
        // const tokens = MyJwt.generateTokens(payload)
        const newAccessToken = MyJwt.generateAccessToken(payload);
        const newRefreshToken = MyJwt.generateRefreshToken(payload);
        author.author_token = newRefreshToken;

        await author.save();

        res.cookie("refreshToken", newRefreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true
        })

        // res.status(200).send({ ...tokens })
        res.status(200).send({ newAccessToken, newRefreshToken });
    } catch(error) {
        errorHandler(res, error);
    }
}

// ACTIVATION
const authorActivation = async(req, res) => {
    try {
        const author = await Author.findOne({author_activation_link: req.params.link});

        if (!author) {
            return res.status(400).send({"message": "No such author!"})
        }

        if (author.author_is_active) {
            return res.status(400).send({"message": "Author already activated!"})
        }

        author.author_is_active = true;

        await author.save();
        res.status(200).send({
            author_is_active: author.author_is_active,
            message: "Author activated"
        })
    } catch (error) {
        errorHandler(res, error);
    }
}




module.exports = {
    getAllAuthors,
    getAuthorById,
    addAuthor,
    updateAuthorById,
    deleteAuthorById,
    loginAuthor,
    logoutAuthor,
    refreshAuthorToken,
    authorActivation,
}