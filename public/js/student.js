"use strict";
async function getStudentDetails() {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const response = await fetch(`/rest/students/${searchParams.get("studentId")}`);
        const student = await response.json();
        if (student.isActive == true) {
            document.getElementById("stActivate").innerText = "Deactivete";
        }
        else {
            document.getElementById("stActivate").innerText = "Activete";
        }
        document.getElementById("stActivate").addEventListener("click", async function () {
            if (student.isActive == true) {
                await changeState(false);
            }
            else {
                await changeState(true);
            }
        });
        const studentName = document.getElementById("stName");
        studentName.textContent = student.name;
        const coursesTableBody = document.getElementById("coTable").children[1];
        student.courses.forEach((course) => {
            console.log("Course:", course.id, course.name, course.isActive);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="course.html?courseId=${course.id}">${course.id}</a></td>
                <td>${course.name}</td>
                <td>${course.isActive}</td>
                <td><button onclick="removeCourse('${course.id}')">Remove</button></td>
                
            `;
            coursesTableBody.appendChild(row);
        });
        const studentTableBody = document.getElementById("stTable").children[1];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.isActive}</td>  
        `;
        console.log("Row HTML:", row.innerHTML);
        studentTableBody.appendChild(row);
        console.log("First Table loaded successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
getStudentDetails();
async function paymentCourseSelect() {
    const searchParams = new URLSearchParams(window.location.search);
    const studentId = searchParams.get('studentId');
    try {
        const response = await fetch(`/rest/students/${studentId}`, {
            method: "GET"
        });
        const jsonResponse = await response.json();
        console.log("Received data:122", jsonResponse);
        const courses = jsonResponse.courses;
        const paymentCourseDropdown = document.getElementById("paymentDropdown");
        paymentCourseDropdown.innerHTML = "";
        const optionDefault = document.createElement("option");
        optionDefault.value = "";
        optionDefault.textContent = "Select a Course";
        optionDefault.disabled = true;
        optionDefault.selected = true;
        paymentCourseDropdown.appendChild(optionDefault);
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.id;
            option.textContent = course.name;
            paymentCourseDropdown.appendChild(option);
        });
    }
    catch (error) {
        console.error("Error:", error);
    }
}
paymentCourseSelect();
async function getPaymentTable(courseId) {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get("studentId"));
    const response = await fetch(`/rest/students/${searchParams.get("studentId")}`, {
        method: "GET"
    });
    const jsonResponse = await response.json();
    console.log("Received data:", jsonResponse);
    const data = jsonResponse.data;
    console.log(data);
    if (data) {
        const payments = data;
        const coursesTableBody = document.getElementById("paymentTable").children[1];
        coursesTableBody.innerHTML = "";
        payments.forEach((payment) => {
            const date = new Date();
            const payDate = payment.payedTime ? new Date() : null;
            const isPaymentDone = payment.payedTime ? "Done" : "Not Yet";
            const row = document.createElement("tr");
            if (payDate) {
                row.innerHTML = `
                    <td>${payment.id}</td>
                    <td>${getMonthYear(date)}</td>
                    <td>${getPaidTime(payDate)}</td>
                    <td>${isPaymentDone}</td>
                `;
            }
            else {
                const markAsPaidButton = document.createElement("button");
                markAsPaidButton.textContent = "Mark as Paid";
                markAsPaidButton.addEventListener("click", async () => {
                    alert("Are you sure?");
                    await markPaymentDone(payment.id, row);
                });
                const cell = document.createElement("td");
                cell.appendChild(markAsPaidButton);
                row.innerHTML = `
                    <td>${payment.id}</td>
                    <td>${getMonthYear(date)}</td>
                    <td></td>
                    <td>${isPaymentDone}</td>
                `;
                row.cells[2].appendChild(cell);
            }
            coursesTableBody.appendChild(row);
        });
    }
}
function getMonthYear(date) {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}
function getPaidTime(date) {
    const paidDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return paidDate;
}
async function changeState(state) {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const response = await fetch(`/rest/students/${searchParams.get("studentId")}`, {
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
            console.log("Failed to update student state", jsonResponse);
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function showAssignCourse() {
    const assignCourseDialog = document.getElementById("assignCourseDialog");
    assignCourseDialog.showModal();
    try {
        const response = await fetch("/rest/courses", {
            method: "GET"
        });
        if (!response.ok) {
            throw new Error("Failed to fetch courses");
        }
        const courses = await response.json();
        const courseDropdown = document.getElementById("courseDropdown");
        courseDropdown.innerHTML = "";
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.id;
            option.textContent = course.name;
            courseDropdown.appendChild(option);
        });
    }
    catch (error) {
        console.error("Error fetching course data:", error);
    }
}
function assignDialog() {
    const dialog = document.getElementById("assignCourseDialog");
    dialog.close();
}
async function assignCourse() {
    const assignCourseDropdown = document.getElementById("courseDropdown");
    const selectedCourseId = assignCourseDropdown.value;
    console.log("Selected course ID:", selectedCourseId);
    assignDialog();
    const searchParams = new URLSearchParams(window.location.search);
    try {
        const response = await fetch(`/rest/students/${searchParams.get("studentId")}/courses/${selectedCourseId}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const jsonResponse = await response.json();
        console.log("Received data2:", jsonResponse);
        location.reload();
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function removeCourse(courseId) {
    const searchParams = new URLSearchParams(window.location.search);
    const studentId = searchParams.get('studentId');
    try {
        const response = await fetch(`/rest/students/${studentId}/courses/${courseId}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE"
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        location.reload();
        console.log("Course removed successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function markPaymentDone(paymentId, row) {
    try {
        const response = await fetch("/rest/payments/:id", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH"
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        console.log("Mark Payment Done successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
//# sourceMappingURL=student.js.map