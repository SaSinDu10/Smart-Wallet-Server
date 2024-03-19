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
    const url = "http://155.248.246.152:8081/graphql";
    const query = `
            query Query {
                GetStudents {
                    _id
                    isActive
                    name
                }
            }
        `;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
      },
      body: JSON.stringify({ query }),
    };
    //console.log("test 1");
    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    console.log("Received data:", jsonResponse);

    const data = jsonResponse.data;
    if (data.GetStudents) {
      const students: {
        _id: String;
        isActive: Boolean;
        name: String;
      }[] = data.GetStudents;

      const studentsTableBody = document.getElementById("myTable")!.children[1];
      students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td><a href="studentProfile.html?studentId=${student._id}">${student._id}</a></td>
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
    const url = "http://155.248.246.152:8081/graphql";
    const query = `
    mutation Mutation($student: StudentInput!) {
      AddStudent(student: $student)
    }
        `;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDlkZTQyZGMyYjI3Y2Q4ZjE0MDE3OTEiLCJpYXQiOjE3MDU5MjgxMjN9.k_vS11NYSfhaHHOl7jjUl2t7UCfdTGeythCsk0Hr89g",
      },
      body: JSON.stringify({
        query: query,
        variables: {
          student: { name: studentName },
        },
      }),
    };

    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    console.log("Received data:", jsonResponse);
    location.reload();
    
  } catch (error) {
    console.error("Error:", error);
  }
}
