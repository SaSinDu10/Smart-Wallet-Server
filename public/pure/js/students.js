"use strict";
async function students() {
    try {
        const response = await fetch("/rest/students", {
            method: "GET",
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        if (jsonResponse) {
            const students = jsonResponse;
            const studentsTableBody = document.getElementById("myTable").children[1];
            students.forEach((student) => {
                const row = document.createElement("tr");
                const isActive = student.isActive ? 'checked' : '';
                row.innerHTML = `
                    <td><a href="student.html?studentId=${student.id}">${student.id}</a></td>
                    <td>${student.name}</td>
                    <td><input type="checkbox" disabled="true" ${isActive}></td>
                    
                `;
                studentsTableBody.appendChild(row);
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
function showDialog() {
    const dialog = document.getElementById("regStudent");
    dialog.showModal();
}
function closeDialog() {
    const dialog = document.getElementById("regStudent");
    dialog.close();
}
function createStudent() {
    const studentName = document.getElementById("studentName");
    closeDialog();
    addStudent(studentName.value);
}
async function addStudent(studentName) {
    try {
        const response = await fetch("/rest/students", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                name: studentName
            })
        });
        const jsonResponse = await response.json();
        console.log("Received data:", jsonResponse);
        location.reload();
    }
    catch (error) {
        console.error("Error:", error);
    }
}
//# sourceMappingURL=students.js.map