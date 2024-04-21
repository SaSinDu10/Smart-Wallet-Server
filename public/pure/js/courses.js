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
        const response = await fetch("/rest/courses", {
            method: 'GET'
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        if (jsonResponse) {
            const courses = jsonResponse;
            const coursesTableBody = document.getElementById("myTable").children[1];
            courses.forEach((course) => {
                const row = document.createElement("tr");
                const isActive = course.isActive ? 'checked' : '';
                const dateCellContent = course.lastPaymentGeneration ?
                    getMonthYear3(new Date(course.lastPaymentGeneration)) :
                    `<button onclick="generatePayment('${course.id}')">Generate Payment</button>`;
                row.innerHTML = `
                    <td><a href="course.html?courseId=${course.id}">${course.id}</a></td>
                    <td>${course.name}</td>
                    <td><input type="checkbox" disabled="true" ${isActive}></td>
                    <td>${dateCellContent}</td>
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
        const response = await fetch("/rest/courses", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                name: courseName
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