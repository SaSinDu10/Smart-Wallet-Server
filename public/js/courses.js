"use strict";
function showCreateCourseDialog() {
    const createDialog = document.getElementById("createDialog");
    createDialog.showModal();
}
function closeCreateCourseDialog() {
    const createDialog = document.getElementById("createDialog");
    createDialog.close();
}
function createCourse() {
    const courseName = document.getElementById("courseName");
    closeCreateCourseDialog();
    addCourse(courseName.value);
}
async function getCourses() {
    try {
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: `
                query Query {
                    GetCourses {
                        name
                        _id
                        isActive
                        lastPaymentGeneration
                    }
                }`,
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        const data = jsonResponse.data;
        if (data.GetCourses) {
            const courses = data.GetCourses;
            const coursesTableBody = document.getElementById("myTable").children[1];
            courses.forEach((course) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><a href="courseDetails.html?courseId=${course._id}">${course._id}</a></td>
                    <td>${course.name}</td>
                    <td>${course.isActive}</td>
                    <td>${new Date(course.lastPaymentGeneration).toLocaleString()}</td>
                `;
                coursesTableBody.appendChild(row);
            });
            console.log("Table loaded successfully.");
        }
        else {
            console.error("Data received is not in the expected format");
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}
getCourses();
async function addCourse(courseName) {
    try {
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: `
                mutation Mutation($course: CourseInput!) {
                AddCourse(course: $course)
            }
        `,
                variables: {
                    course: { name: courseName },
                },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        location.reload();
    }
    catch (error) {
        console.error("Error:", error);
    }
}
function getMonthYear3(date) {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}
//# sourceMappingURL=courses.js.map