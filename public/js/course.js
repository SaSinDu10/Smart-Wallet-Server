"use strict";
async function getCourseDetails() {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get('courseId'));
    try {
        const url = "http://155.248.246.152:8081/graphql";
        const query = `
          query Query($getCourseId: ObjectId!) {
              GetCourse(id: $getCourseId) {
                _id
                isActive
                lastPaymentGeneration
                name
                students {
                  _id
                  isActive
                  name
                  courses {
                    lastPaymentGeneration
                  }
                }
              }
            }
        `;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    "getCourseId": searchParams.get('courseId')
                }
            }),
        };
        const response = await fetch(url, options);
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        const data = jsonResponse.data;
        if (data.GetCourse) {
            const courseDetails = data.GetCourse;
            if (courseDetails.isActive == true) {
                document.getElementById("coActivate").innerText = "Deactivete";
            }
            else {
                document.getElementById("coActivate").innerText = "Activete";
            }
            document.getElementById("coActivate").addEventListener("click", async function () {
                if (courseDetails.isActive == true) {
                    await changeActivate(false);
                }
                else {
                    await changeActivate(true);
                }
            });
            const courseName = document.getElementById("coName");
            courseName.textContent = courseDetails.name;
            const enrolledStudentTableBody = document.getElementById("coTable").children[1];
            courseDetails.students.forEach((student) => {
                const row = document.createElement("tr");
                row.innerHTML = `
        <td><a href="studentProfile.html?studentId=${student._id}">${student._id}</a></td>
        <td>${student.name}</td>
        <td>${student.isActive}</td>
        
    `;
                enrolledStudentTableBody.appendChild(row);
            });
            const studentTableBody = document.getElementById("courseDetailsTable").children[1];
            const date = new Date(courseDetails.lastPaymentGeneration);
            const isActiveLabel = courseDetails.isActive ? "Active Course" : "Discontinued Course";
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${courseDetails._id}</td>
        <td>${isActiveLabel}</td>
        <td>${getMonthYear2(date)}</td>
    `;
            studentTableBody.appendChild(row);
            const generatePaymentButton = document.getElementById("generatePaymentButton");
            generatePaymentButton.addEventListener("click", async () => {
                alert("Generated payments");
                await genaratePayment();
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
getCourseDetails();
function getMonthYear2(date) {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}
async function changeActivate(state) {
    const searchParams = new URLSearchParams(window.location.search);
    const courseId = searchParams.get('courseId');
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
          mutation Mutation($courseId: ObjectId!, $course: CourseUpdate!) {
            UpdateCourse(courseId: $courseId, course: $course)
          }
        `,
                variables: {
                    courseId: courseId,
                    course: { "isActive": state }
                },
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        const toggledActivate = jsonResponse.data.UpdateCourse;
        if (toggledActivate == true) {
            location.reload();
        }
        console.log("State toggled successfully.");
    }
    catch (error) {
        console.error("Error:", error);
    }
}
async function genaratePayment() {
    const searchParams = new URLSearchParams(window.location.search);
    const courseId = searchParams.get('courseId');
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
            mutation Mutation($courseId: ObjectId!) {
            GeneratePayments(courseId: $courseId)
        }
      `,
                variables: {
                    "courseId": courseId
                }
            }),
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
//# sourceMappingURL=course.js.map