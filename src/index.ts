import * as express from "express";
import * as cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

//login
app.post('/rest/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'No such user' });
        }
        
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        return res.json({ message: 'Login successful', user });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

//getStudents
app.get('/rest/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        return res.json(students);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

//addStudent
app.post('/rest/students', async (req, res) => {
    try {
        const name = req.body.name;
        const addStudent = await prisma.student.create({
            data: {
                name,
            },
        });
        return res.json({ message: 'Student created successfully', student: addStudent });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

//getCourses            ///// skip limit add
app. get('/rest/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        return res.json(courses);
    } catch (error: any) {
        return res.status(500).json({message:error.message});
    }
})

//addCourses
app.post('/rest/courses', async (req, res) => {
    try{
        const addCourse = await prisma.course.create({
            data: {
                name: req.body.name,
                isActive: true
            }
        })
        return res.json({message: 'Course created successfuly', course:addCourse});
    } catch (error: any) {
        return res.status(500).json({message: error.message});
    }
})

//updateStudent
app.patch('/rest/students/:id', async (req,res) => {
    try {
        const studentId = req.params.id;
        const studentActiveState = req.body.isActive;
        const selectedStudent = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        })
        if (!selectedStudent) {
            return res.status(404).json({message: "Student not found"});
        }
        const updateStudent = await prisma.student.update({
            where: {id: studentId},
            data: {isActive: studentActiveState}
        });
        return res.json({message: "Student Active state update successfully", student:updateStudent})

    } catch (error: any) {
        return res.status(500).json({message:error.message});
    }
})

//updateCourse
app.patch("/rest/courses/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const courseActiveState = req.body.isActive;

        const selectedCourse = await prisma.course.findUnique({where: {id: courseId}})
        if (!selectedCourse) {
            return res.status(404).json({message: 'Course not found'});
        }
        const updateCourse = await prisma.course.update({
            where: {id: courseId},
            data: {isActive: courseActiveState}
        })
        return res.json({ message: 'Course Active state updated successfully', course: updateCourse });
    } catch (error: any) {
        return res.status(500).json({message:error.message});
    }
})

//getPayment
app.get('/rest/students/:id', async (req, res) => {
    try {
        const paymnet = await prisma.student.findMany();
        return res.json(paymnet);
    } catch (error: any) {
        return res.status(500).json({message:error.message});
    }
})



app.use(express.static('public'));

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
