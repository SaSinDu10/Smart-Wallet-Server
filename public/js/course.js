"use strict";
async function getCourseDetails() {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get('courseId'));
    try {
        const response = await fetch(`/rest/courses/${searchParams.get('courseId')}`, {
            method: "GET"
        });
        const course = await response.json();
        console.log(course);
        if (course.isActive == true) {
            document.getElementById("coActivate").innerText = "Deactivate";
        }
        else {
            document.getElementById("coActivate").innerText = "Activate";
        }
        document.getElementById("coActivate").addEventListener("click", async function () {
            if (course.isActive == true) {
                await changeActivate(false);
            }
            else {
                await changeActivate(true);
            }
        });
        const courseName = document.getElementById("coName");
        courseName.textContent = course.name;
        const enrolledStudentTableBody = document.getElementById("coTable").children[1];
        course.students.forEach((student) => {
            const row = document.createElement("tr");
            const isActive = student.isActive ? 'checked' : '';
            row.innerHTML = `
        <td><a href="student.html?studentId=${student.id}">${student.id}</a></td>
        <td>${student.name}</td>
        <td><input type="checkbox" disabled="true" ${isActive}></td>
        
    `;
            enrolledStudentTableBody.appendChild(row);
        });
        const studentTableBody = document.getElementById("courseDetailsTable").children[1];
        const date = new Date(course.lastPaymentGeneration);
        const isActiveLabel = course.isActive ? "Active Course" : "Discontinued Course";
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${course.id}</td>
        <td>${isActiveLabel}</td>
        <td>${getMonthYear2(date)}</td>
        `;
        studentTableBody.appendChild(row);
        const generatePaymentButton = document.getElementById("generatePaymentButton");
        generatePaymentButton.addEventListener("click", async () => {
            const result = await generatePayments();
            if (result !== false) {
                alert(result.message);
            }
        });
    }
    catch (error) {
        console.error("Error:", error);
    }
}
getCourseDetails();
function getMonthYear2(date) {
    console.log(date);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}
async function changeActivate(state) {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const response = await fetch(`/rest/courses/${searchParams.get('courseId')}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH",
            body: JSON.stringify({
                isActive: state
            })
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        if (response.ok) {
            alert("Are you sure?");
            location.reload();
            console.log("State toggled successfully.");
        }
        else {
            console.log("Failed to update course state", jsonResponse);
        }
        console.log("State toggled successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function generatePayments() {
    const searchParams = new URLSearchParams(window.location.search);
    const courseId = searchParams.get('courseId');
    try {
        const response = await fetch(`/rest/courses/${courseId}/payments`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        return jsonResponse;
    }
    catch (error) {
        console.error("Error:", error);
        return false;
    }
}
//# sourceMappingURL=course.js.map