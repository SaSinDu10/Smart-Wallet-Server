function showDialog() {
  const dialog = document.getElementById("regStudent") as HTMLDialogElement;
  dialog.showModal();
}

function closeDialog() {
  const dialog = document.getElementById("regStudent") as HTMLDialogElement;
  dialog.close();
}

function createStudent() {
  const studentName = document.getElementById(
    "studentName"
  ) as HTMLInputElement;
  closeDialog();
  addStudent(studentName.value);
}

async function getStudents() {
  try {
    const response = await fetch("/rest/students", {
      method: "GET",
    });
    const jsonResponse = await response.json();
    console.log("Received data:", jsonResponse);

    if (jsonResponse) {
      const students: {
        id: string;
        isActive: boolean;
        name: string;
      }[] = jsonResponse;

      const studentsTableBody = document.getElementById("myTable")!.children[1];
      students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td><a href="student.html?studentId=${student.id}">${student.id}</a></td>
                    <td>${student.name}</td>
                    <td>${student.isActive}</td>
                    
                `;
        studentsTableBody.appendChild(row);
      });

      console.log("Table loaded successfully.");
    } else {
      console.error("Data received is not in the expected format");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
getStudents();

async function addStudent(studentName: string) {
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
    
  } catch (error) {
    console.error("Error:", error);
  }
}
