const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const bookmarkedContentBlocks = [];

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
    const courses = [
        {
            id: "001",
            title: "Test course"
        },
        {
            id: "002",
            title: "In the Workplace"
        },
        {
            id: "003",
            title: "Harrassment and You"
        }
    ];
    res.status(200).json({
        message: "Courses fetched successfully",
        courses: courses
    });
});

app.get("/api/course/1", (req, res, next) => {
    const course = {
        "title": "IT Security",
        "content": [
            {
                "id": "001.01",
                "title": "Password Guidelines",
                "content": "In your onboarding welcome pack you have been given information to access our password management system. This system is the repository for all shared company passwords. Any password necessary to perform your job responsibilities will be stored in the system and access will be shared with you.\nDo not copy any company passwords to external locations such as a personal text document or a physical note on your desk.\nIf you need access to a password which is not shared with you please contact your supervisor."
            },
            {
                "id": "001.02",
                "title": "Setting your Password",
                "content": "Set your password when you first start using company computers.",
                "color": "red"
            },
            {
                "id": "001.03",
                "title": "Changing your Password",
                "content": "You must change your password every 180 days."
            }
        ]
    };
    res.status(200).json({
        message: "Course fetched successfully",
        course: course
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

module.exports = app;