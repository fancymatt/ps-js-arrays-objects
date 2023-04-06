const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const bookmarkedContentBlocks = [];

const courses = JSON.parse(fs.readFileSync('./courses.json', 'utf8'));

const returnCourseForId = function(id) {
    // if the id is in the bookmark array, add the bookmarked: true property
    let foundCourse = courses.find(course => course.id == id);
    if (foundCourse == null) return null;

    foundCourse.content.forEach(contentBlock => {
        if (bookmarkedContentBlocks.includes(contentBlock.id)) {
            contentBlock.bookmarked = true;
        } else {
            contentBlock.bookmarked = false;
        }
    });

    return foundCourse;
};

const returnBookmarkedContentBlocks = function() {
    const responseArray = [];

    bookmarkedContentBlocks.forEach(id => {
        responseArray.push(findContentBlockWithId(id));
    });

    return responseArray;
};

const findContentBlockWithId = function(id) {
    let foundContentBlock = null;
    courses.forEach(course => {
        course.content.forEach(contentBlock => {
            if (contentBlock.id == id) {
                foundContentBlock = contentBlock;
            }
        });
    });
    return foundContentBlock;
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get("/api/courses", (req, res, next) => {
    const responseArray = [];

    courses.forEach(course => {
        let simpleCourse = {};
        simpleCourse.id = course.id;
        simpleCourse.title = course.title;
        responseArray.push(simpleCourse);
    });

    res.status(200).json({
        message: "Courses fetched successfully",
        courses: responseArray
    });
});

app.get("/api/course/:uid", (req, res, next) => {
    
    res.status(200).json({
        message: "Course fetched successfully",
        course: returnCourseForId(req.params.uid)
    });
});

app.post("/api/bookmark", (req, res, next) => {
    const id = req.body.id;
    const bookmarkIndex = bookmarkedContentBlocks.indexOf(id);

    if (bookmarkIndex != -1) {
        res.status(404).json({
            message: "Block is already bookmarked, can't re-bookmark"
        });
        return;
    }

    bookmarkedContentBlocks.push(id);
    res.status(200).json({
        message: `ContentBlock with id ${id} was added to bookmarked blocks`
    });
});

app.post("/api/unbookmark", (req, res, next) => {
    const id = req.body.id;
    const bookmarkIndex = bookmarkedContentBlocks.indexOf(id);

    if (bookmarkIndex == -1) {
        res.status(404).json({
            message: "Block is not bookmarked, can't unbookmark"
        });
        return;
    }

    bookmarkedContentBlocks.splice(bookmarkIndex, 1);
    res.status(200).json({
        message: `ContentBlock with id ${id} was removed from bookmarked blocks`
    });
});

app.get("/api/notebook", (req, res, next) => {
    let bookmarkedContentBlocks = returnBookmarkedContentBlocks();

    res.status(200).json({
        content: bookmarkedContentBlocks
    });

});

module.exports = app;