/* All functions that should be shared between pages */

let courses = null;

const parseCourseListJsonAsCourseList = function(jsonCoursesList) {
    courses = [];
    jsonCoursesList.forEach(course => {
        courses.push(parseCourseJsonAsCourse(course));
    });
};

const parseCourseJsonAsCourse = function(jsonCourse) {
    let coursePrototype = {
        title: "New course",
        author: "No author",
        id: "No id"
    };

    const newCourse = Object.create(coursePrototype);
    Object.assign(newCourse, jsonCourse);
    
    newCourse.content = [];

    if (jsonCourse.content != null && jsonCourse.content.length > 0) {
        jsonCourse.content.forEach(contentBlock => {
            newCourse.content.push(parseJsonAsContentBlock(contentBlock));
        });
    }
    
    return newCourse;
};

const parseJsonAsContentBlock = function(jsonBlock) {
    const contentBlockPrototype = {
        id: "no id",
        title: "no title",
        content: "no content",
        bookmarked: false,
        bookmark: function() {
            this.bookmarked = true;
            fetch('http://localhost:8000/api/bookmark', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "id": this.id })
            });
        },
        unbookmark: function() {
            this.bookmarked = false;
            fetch('http://localhost:8000/api/unbookmark', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "id": this.id })
            });
        }
    };

    const newContentBlock = Object.create(contentBlockPrototype);
    Object.assign(newContentBlock, jsonBlock);
    return newContentBlock;
};