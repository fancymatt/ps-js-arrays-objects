const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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
                "title": "Password Guidelines",
                "content": "In your onboarding welcome pack you have been given information to access our password management system. This system is the repository for all shared company passwords. Any password necessary to perform your job responsibilities will be stored in the system and access will be shared with you.\nDo not copy any company passwords to external locations such as a personal text document or a physical note on your desk.\nIf you need access to a password which is not shared with you please contact your supervisor."
            },
            {
                "title": "Setting your Password",
                "content": "Set your password when you first start using company computers.",
                "color": "red"
            },
            {
                "title": "Changing your Password",
                "content": "You must change your password every 180 days."
            }
        ]
    };
    res.status(200).json({
        message: "Course fetched successfully",
        course: course
    });
})

module.exports = app;