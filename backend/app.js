const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const uuid = require('short-uuid');

const app = express();

let courses;
const bookmarkedContentBlockIds = [];

const fetchCoursesFromJson = function() {
    courses = JSON.parse(fs.readFileSync('./courses.json', 'utf8'));
};

const returnCourseForId = function(id) {
    let foundCourse = courses.find(course => course.id == id);
    if (foundCourse == null) return null;

    if (foundCourse.content != null && foundCourse.content.length > 0) {
        foundCourse.content.forEach(contentBlock => {
            if (bookmarkedContentBlockIds.includes(contentBlock.id))
                contentBlock.bookmarked = true;
            else
            {
                if (contentBlock.hasOwnProperty('bookmarked'))
                    delete contentBlock.bookmarked;
            } 
        });
    }
    return foundCourse;
};

const updateCourseForId = function(id, course) {
    let foundCourseIndex = courses.findIndex(course => course.id == id);
    courses[foundCourseIndex] = {};
    Object.assign(courses[foundCourseIndex], course);
    saveCoursesToJson();
};

const returnBookmarkedContentBlocks = function() {
    const responseArray = [];
    bookmarkedContentBlockIds.forEach(id => {
        let foundBlock = findContentBlockWithId(id);
        foundBlock.bookmarked = true;
        responseArray.push(foundBlock);
    });
    return responseArray;
};

const allContentBlocks = function() {
    let contentBlocks = [];
    courses.forEach(course => {
        contentBlocks.push(...course.content);
    });
    return contentBlocks;
};

const findContentBlockWithId = function(id) {
    const allBlocks = allContentBlocks();
    return allBlocks.find(block => block.id == id);
};

const saveCoursesToJson = function() {
    const json = JSON.stringify(courses);
    fs.writeFile('courses.json', json, 'utf8', fetchCoursesFromJson);
};

fetchCoursesFromJson();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.get("/api/new-id", (req, res, next) => {
    res.status(200).json({
        id: uuid.generate()
    });
});

app.get("/api/courses", (req, res, next) => {
    res.status(200).json({
        message: "Courses fetched successfully",
        courses: courses
    });
});

app.get("/api/course/:uid", (req, res, next) => {
    res.status(200).json({
        message: "Course fetched successfully",
        course: returnCourseForId(req.params.uid)
    });
});

app.post("/api/course", (req, res, next) => {
    courses.push({
        id: uuid.generate()
    });
    saveCoursesToJson();
    res.status(200).json({
        message: "Empty course created successfully"
    });
});

app.post("/api/course/:uid", (req, res, next) => {
    updateCourseForId(req.params.uid, req.body);
    
    res.status(200).json({
        message: "Course updated successfully"
    });
});

app.post("/api/bookmark", (req, res, next) => {
    const id = req.body.id;
    const bookmarkIndex = bookmarkedContentBlockIds.indexOf(id);

    if (bookmarkIndex != -1) {
        res.status(404).json({
            message: "Block is already bookmarked, can't re-bookmark"
        });
        return;
    }

    bookmarkedContentBlockIds.push(id);

    res.status(200).json({
        message: `ContentBlock with id ${id} was added to bookmarked blocks`
    });
});

app.post("/api/unbookmark", (req, res, next) => {
    const id = req.body.id;
    const bookmarkIndex = bookmarkedContentBlockIds.indexOf(id);

    if (bookmarkIndex == -1) {
        res.status(404).json({
            message: "Block is not bookmarked, can't unbookmark"
        });
        return;
    }

    bookmarkedContentBlockIds.splice(bookmarkIndex, 1);

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

app.post("/api/save-db", (req, res, next) => {
    courses = req.body;
    saveCoursesToJson();
    
    res.status(200).json({
        message: "Course updated successfully"
    });
    
});

module.exports = app;