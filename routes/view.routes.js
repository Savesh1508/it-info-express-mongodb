const { Router } = require("express");

// const Author = require("../models/Author.js");
const { createViewPath } = require("../helpers/create_view_path.js");
// const { author } = require("../validations");

const router = Router();

router.get("/", (req, res) => {
    res.render(createViewPath("index"), {title: "Main page", isHome: true}); //isHome -> to make active in class
});

router.get("/dictionary", (req, res) => {
    res.render(createViewPath("dictionary"), {title: "Dictionary", isDict: true}); //isDict -> to make active in class
});

router.get("/topics", async(req, res) => {
    // const topic = await Topic.find();
    res.render(createViewPath("topics"), {title: "Topics", isTopic: true}); //isTopic -> to make active in class
});

router.get("/authors", async(req, res) => {
    //////////////////////////////////////////////////////////////// 1- WAY
    // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTYxY2E4MDkyZTZhNjg4OTNjNjA5MSIsImF1dGhvcl9pc19leHBlcnQiOnRydWUsImF1dGhvclJvbGVzIjpbIlJFQUQiLCJXUklURSJdLCJpYXQiOjE2ODgyMTYxMTYsImV4cCI6MTY4ODIxNzAxNn0.ar3XAcE8Gokl7YGeqiL-5YbjZvQxwCUUwRsSn7H8jKA";

    // const response = await fetch("http://localhost:3000/api/author", {
    //     method: "GET",
    //     headers: {
    //         Authorization: `Bearer ${accessToken}`
    //     },
    // });

    // const authors = await response.json();

    res.render(createViewPath("authors"), {
        title: "Authors",
        isAuthor: true,
        // authors: authors.data,
    }); //isDict -> to make active in class
});

router.get("/login", async(req, res) => {
    res.render(createViewPath("login"), {
        title: "Login",
        isLogin: true,
        // authors: authors.data,
    }); //isDict -> to make active in class
});

module.exports = router