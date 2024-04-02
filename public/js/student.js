"use strict";
async function getStudentDetails() {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get("studentId"));
    try {
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: `
            query GetStudent($getStudentId: ObjectId!) {
                GetStudent(id: $getStudentId) {
                    _id
                    isActive
                    name
                    courses {
                        _id
                        name
                        isActive
                        lastPaymentGeneration
                    }
                }
            }`,
                variables: {
                    getStudentId: searchParams.get("studentId"),
                },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        const student = jsonResponse.data.GetStudent;
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
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="courseDetails.html?courseId=${course._id}">${course._id}</a></td>
                <td>${course.name}</td>
                <td>${course.isActive}</td>
                <td><button onclick="removeCourse('${course._id}')">Remove</button></td>
                
            `;
            coursesTableBody.appendChild(row);
        });
        const studentTableBody = document.getElementById("stTable").children[1];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student._id}</td>
            <td>${student.isActive}</td>  
        `;
        studentTableBody.appendChild(row);
        console.log("Table loaded successfully.");
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
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: `
                    query GetStudent($getStudentId: ObjectId!) {
                        GetStudent(id: $getStudentId) {
                        _id
                        isActive
                        name
                        courses {
                            _id
                            isActive
                            name
                            lastPaymentGeneration
                        }
                        }
                    }
                `,
                variables: {
                    getStudentId: studentId
                },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:122", jsonResponse);
        const courses = jsonResponse.data?.GetStudent.courses;
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
            option.value = course._id;
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
    const response = await fetch("http://155.248.246.152:8081/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
        },
        body: JSON.stringify({
            query: `
            query GetPayment($studentId: ObjectId!, $courseId: ObjectId!) {
                GetPayments(studentId: $studentId, courseId: $courseId) {
                    _id
                    time {
                        added
                        payed
                    }
                }
            }`,
            variables: {
                studentId: searchParams.get("studentId"),
                courseId: courseId,
            },
        }),
    });
    const jsonResponse = await response.json();
    console.log("Received data:", jsonResponse);
    const data = jsonResponse.data;
    console.log(data);
    if (data.GetPayments) {
        const payments = data.GetPayments;
        const coursesTableBody = document.getElementById("paymentTable").children[1];
        coursesTableBody.innerHTML = "";
        payments.forEach((payment) => {
            const date = new Date(payment.time.added);
            const payDate = payment.time.payed ? new Date(payment.time.payed) : null;
            const isPaymentDone = payment.time.payed ? "Done" : "Not Yet";
            const row = document.createElement("tr");
            if (payDate) {
                row.innerHTML = `
                    <td>${payment._id}</td>
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
                    await markPaymentDone(payment._id, row);
                });
                const cell = document.createElement("td");
                cell.appendChild(markAsPaidButton);
                row.innerHTML = `
                    <td>${payment._id}</td>
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
    const searchParams = new URLSearchParams(window.location.search);
    const studentId = searchParams.get('studentId');
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
                mutation Mutation($studentId: ObjectId!, $student: StudentUpdate!) {
                    UpdateStudent(studentId: $studentId, student: $student)
                }
            `,
                variables: {
                    studentId: studentId,
                    student: { "isActive": state }
                },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        const toggledStudent = jsonResponse.data.UpdateStudent;
        if (toggledStudent == true) {
            location.reload();
        }
        console.log("State toggled successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function showAssignCourse() {
    const assignCourseDialog = document.getElementById("assignCourseDialog");
    assignCourseDialog.showModal();
    try {
        const query = `
            query {
                GetCourses {
                    _id
                    name
                }
            }
        `;
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({ query }),
        });
        const jsonResponse = await response.json();
        const courses = jsonResponse.data.GetCourses;
        const courseDropdown = document.getElementById("courseDropdown");
        courseDropdown.innerHTML = "";
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course._id;
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
    const studentId = searchParams.get('studentId');
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
                    mutation Mutation($studentId: ObjectId!, $courseId: ObjectId!) {
                        AssignCourseToStudent(studentId: $studentId, courseId: $courseId)
                    }
                `,
                variables: {
                    studentId: studentId,
                    courseId: selectedCourseId
                },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        location.reload();
        console.log("State toggled successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function removeCourse(courseId) {
    const searchParams = new URLSearchParams(window.location.search);
    const studentId = searchParams.get('studentId');
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
                    mutation Mutation($studentId: ObjectId!, $courseId: ObjectId!) {
                        RemoveCourseFromStudent(studentId: $studentId, courseId: $courseId)
                    }
                `,
                variables: {
                    studentId: studentId,
                    courseId: courseId
                },
            }),
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
        const response = await fetch("http://155.248.246.152:8081/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: `
                    mutation MarkPaymentDone($paymentId: ObjectId!) {
                        MarkPaymentDone(paymentId: $paymentId)
                    }
                `,
                variables: {
                    paymentId: paymentId
                },
            }),
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