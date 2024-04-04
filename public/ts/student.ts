async function getStudentDetails() {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const response = await fetch(`/rest/students/${searchParams.get("studentId")}`);
        const student: {
            id: string;
            isActive: boolean;
            name: string;
            courses: {
                id: string;
                name: string;
                isActive: boolean;
                lastPaymentGeneration?: string;
                studentId?: string 
            }[]
        } = await response.json();
        //console.log("Received data:", student);

        if (student.isActive == true) {
            document.getElementById("stActivate")!.innerText = "Deactivete";
        } else {
            document.getElementById("stActivate")!.innerText = "Activete";
        }

        document.getElementById("stActivate")!.addEventListener("click", async function () {
            if (student.isActive == true) {
                await changeState(false);
            } else {
                await changeState(true);
            }
        });

        const studentName = document.getElementById("stName") as HTMLElement;
        studentName.textContent = student.name;

        const coursesTableBody = document.getElementById("coTable")!.children[1];
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

        const studentTableBody = document.getElementById("stTable")!.children[1];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.isActive}</td>  
        `;
        console.log("Row HTML:", row.innerHTML);
        studentTableBody.appendChild(row);



        console.log("First Table loaded successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
}
getStudentDetails();

//to-do
// async function paymentCourseSelect() {

//     const searchParams = new URLSearchParams(window.location.search);
//     const studentId = searchParams.get('studentId');
//     try {
//         const response = await fetch("http://155.248.246.152:8081/graphql", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//                 Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
//             },
//             body: JSON.stringify({
//                 query: `
//                     query GetStudent($getStudentId: ObjectId!) {
//                         GetStudent(id: $getStudentId) {
//                         _id
//                         isActive
//                         name
//                         courses {
//                             _id
//                             isActive
//                             name
//                             lastPaymentGeneration
//                         }
//                         }
//                     }
//                 `,
//                 variables: {
//                     getStudentId: studentId
//                 },
//             }),
//         });
//         const jsonResponse: {
//             "data": {
//                 "GetStudent": {
//                     "_id": string,
//                     "isActive": boolean,
//                     "name": string,
//                     "courses":
//                     {
//                         "_id": string,
//                         "isActive": boolean,
//                         "name": string,
//                         "lastPaymentGeneration": number
//                     }[]
//                 }
//             }
//         } = await response.json();
//         console.log("Received data:122", jsonResponse);
//         const courses = jsonResponse.data?.GetStudent.courses;

//         const paymentCourseDropdown = document.getElementById("paymentDropdown") as HTMLSelectElement;
//         paymentCourseDropdown.innerHTML = "";
//         const optionDefault = document.createElement("option");
//         optionDefault.value = "";
//         optionDefault.textContent = "Select a Course";
//         optionDefault.disabled = true;
//         optionDefault.selected = true;
//         paymentCourseDropdown.appendChild(optionDefault);
//         courses.forEach(course => {
//             const option = document.createElement("option");
//             option.value = course._id;
//             option.textContent = course.name;
//             paymentCourseDropdown.appendChild(option);
//         });

//     } catch (error) {
//         console.error("Error:", error);
//     }

// }
// paymentCourseSelect();

async function getPaymentTable(courseId: string) {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get("studentId"));
    const response = await fetch("http://155.248.246.152:8081/graphql", {

        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
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
        const payments: {
            "_id": string,
            "time": {
                "added": number,
                "payed": number
            };
        }[] = data.GetPayments;

        const coursesTableBody = document.getElementById("paymentTable")!.children[1];
        coursesTableBody.innerHTML = "";
        payments.forEach((payment) => {
            const date = new Date(payment.time.added)
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
            } else {
                const markAsPaidButton = document.createElement("button");
                markAsPaidButton.textContent = "Mark as Paid";
                markAsPaidButton.addEventListener("click", async () => {
                    alert("Are you sure?")
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

function getMonthYear(date: Date) {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}

function getPaidTime(date: Date) {
    const paidDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return paidDate;
}


async function changeState(state: boolean) {
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
            alert ("Are you sure?");
            location.reload();
            console.log("State toggled successfully.");
        } else {
            console.log("Failed to update student state", jsonResponse);
            
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function showAssignCourse() {
    const assignCourseDialog = document.getElementById("assignCourseDialog") as HTMLDialogElement;
    assignCourseDialog.showModal();

    try {
        const response = await fetch("/rest/courses", {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch courses");
        }

        const courses: { id: string, name: string }[] = await response.json();

        const courseDropdown = document.getElementById("courseDropdown") as HTMLSelectElement;
        courseDropdown.innerHTML = "";

        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.id;
            option.textContent = course.name;
            courseDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching course data:", error);
    }
}

function assignDialog() {
    const dialog = document.getElementById("assignCourseDialog") as HTMLDialogElement;
    dialog.close();
}

async function assignCourse() {
    const assignCourseDropdown = document.getElementById("courseDropdown") as HTMLSelectElement;
    const selectedCourseId = assignCourseDropdown.value;
    console.log("Selected course ID:", selectedCourseId);
    assignDialog();
    const searchParams = new URLSearchParams(window.location.search);
    //const studentId = searchParams.get('studentId');
    try {
        const response = await fetch(`/rest/students/${searchParams.get("studentId")}/courses/${searchParams.get("courseId")}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const jsonResponse = await response.json();
        console.log("Received data2:", jsonResponse);
        //location.reload();
        console.log("State toggled successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
}


async function removeCourse(courseId: string) {
    // const searchParams = new URLSearchParams(window.location.search);
    // const studentId = searchParams.get('studentId');
    try {
        const response = await fetch("/rest/students/:studentId/courses/:courseId", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE"
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        location.reload();
        console.log("Course removed successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
}

async function markPaymentDone(paymentId: string, row: HTMLElement) {
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
    } catch (error) {
        console.error("Error:", error);
    }
}




