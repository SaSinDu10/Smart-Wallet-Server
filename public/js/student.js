"use strict";
async function main() {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const response = await fetch(`/rest/students/${searchParams.get("studentId")}`);
        const student = await response.json();
        const studentName = document.getElementById("stName");
        studentName.textContent = student.name;
        const btnActivateStudent = document.getElementById("stActivate");
        if (student.isActive == true) {
            btnActivateStudent.innerText = "Deactivate";
        }
        else {
            btnActivateStudent.innerText = "Activate";
        }
        btnActivateStudent.addEventListener("click", async function () {
            if (student.isActive == true) {
                await activateStudent(false);
            }
            else {
                await activateStudent(true);
            }
        });
        const studentTableBody = document.getElementById("stTable").children[1];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.isActive}</td>  
        `;
        studentTableBody.appendChild(row);
        const assignCourseDialog = document.getElementById("assignCourseDialog");
        document.getElementById("btnShowAssignCourseDialog").addEventListener('click', () => {
            assignCourseDialog.showModal();
        });
        fillAllCoursesDropDown();
        const assignCourseDropdown = document.getElementById("courseDropdown");
        document.getElementById("btnAssignCourse").addEventListener('click', async () => {
            const selectedCourseId = assignCourseDropdown.value;
            const searchParams = new URLSearchParams(window.location.search);
            try {
                await fetch(`/rest/students/${searchParams.get("studentId")}/courses/${selectedCourseId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                });
                location.reload();
            }
            catch (error) {
                console.error("Error:", error);
            }
        });
        const coursesTableBody = document.getElementById("coTable").children[1];
        student.courses.forEach((course) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="course.html?courseId=${course.id}">${course.id}</a></td>
                <td>${course.name}</td>
                <td>${course.isActive}</td>
                <td><button onclick="removeCourse('${course.id}')">Remove</button></td>
            `;
            coursesTableBody.appendChild(row);
        });
        const paymentCourseDropdown = document.getElementById("paymentDropdown");
        paymentCourseDropdown.innerHTML = "";
        const optionDefault = document.createElement("option");
        optionDefault.value = "";
        optionDefault.textContent = "Select a Course";
        optionDefault.disabled = true;
        optionDefault.selected = true;
        paymentCourseDropdown.appendChild(optionDefault);
        student.courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.id;
            option.textContent = course.name;
            paymentCourseDropdown.appendChild(option);
        });
        paymentCourseDropdown.addEventListener('change', async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const response = await fetch(`/rest/payments?studentId=${searchParams.get("studentId")}&courseId=${paymentCourseDropdown.value}`, {
                method: "GET"
            });
            const payments = await response.json();
            if (payments) {
                const coursesTableBody = document.getElementById("paymentTable").children[1];
                coursesTableBody.innerHTML = "";
                payments.forEach((payment) => {
                    const date = new Date();
                    const payDate = payment.payedTime ? new Date(payment.payedTime) : null;
                    const isPaymentDone = payment.payedTime ? "Done" : "Not Yet";
                    const row = document.createElement("tr");
                    if (payDate) {
                        row.innerHTML = `
                            <td>${payment.id}</td>
                            <td>${getMonthYear(payDate)}</td>
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
                        row.innerHTML = `
                            <td>${payment.id}</td>
                            <td>${getMonthYear(date)}</td>
                            <td></td>
                            <td>${isPaymentDone}</td>
                        `;
                        row.cells[2].appendChild(markAsPaidButton);
                    }
                    coursesTableBody.appendChild(row);
                });
            }
        });
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function fillAllCoursesDropDown() {
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
function getMonthYear(date) {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}
function getPaidTime(date) {
    const paidDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return paidDate;
}
async function activateStudent(state) {
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
async function markPaymentDone(paymentId, row) {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const studentId = searchParams.get('studentId');
        await fetch(`/rest/students/${studentId}/payments/${paymentId}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PATCH"
        });
        location.reload();
    }
    catch (error) {
        console.error("Error:", error);
    }
}
//# sourceMappingURL=student.js.map