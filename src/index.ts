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
        return res.status(500).json({ message: error });
    }
});

//getStudent
app.get('/rest/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {courses: true}
        });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.json(student);
    } catch (error: any) {
        return res.status(500).json({ message: error })
    }
})

//addStudent
app.post('/rest/students', async (req, res) => {
    try {
        const name = req.body.name;
        const addStudent = await prisma.student.create({
            data: {
                name,
            },
        });
        return res.status(201).json(addStudent);
    } catch (error: any) {
        return res.status(500).json({ message: error });
    }
});

//getCourses ///if loop for skip limit
app.get('/rest/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            skip: req.query.skip? parseInt(req.query.skip as string) : 0,
            take: req.query.limit? parseInt(req.query.limit as string) : 10,
        });
        return res.json(courses);
    } catch (error: any) {
        return res.status(500).json({ message: error });
    }
})

//getCourse
app.get('/rest/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.json(course);
    } catch (error: any) {
        return res.status(500).json({ message: error })
    }
})

//addCourses
app.post('/rest/courses', async (req, res) => {
    try {
        console.log(req.body);
        const addCourse = await prisma.course.create({
            data: {
                name: req.body.name,
                isActive: true
            }
        })

        return res.status(201).json(addCourse);
    } catch (error: any) {
        return res.status(500).json({ message: error });
    }
})

//updateStudent
app.patch('/rest/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const studentActiveState = req.body.isActive;

        const selectedStudent = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        })
        if (!selectedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: { isActive: studentActiveState }
        });
        return res.json({ message: "Student Active state update successfully", student: updatedStudent })

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
})

//updateCourse
app.patch("/rest/courses/:id", async (req, res) => {
    try {
        const courseId = req.params.id;
        const courseActiveState = req.body.isActive;

        const selectedCourse = await prisma.course.findUnique({ where: { id: courseId } })
        if (!selectedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const updateCourse = await prisma.course.update({
            where: { id: courseId },
            data: { isActive: courseActiveState }
        })
        return res.json({ message: 'Course Active state updated successfully', course: updateCourse });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
})

//getPayment
app.get('/rest/students/:id', async (req, res) => {
    try {
        const paymnet = await prisma.student.findMany();
        return res.json(paymnet);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
})

//assignCourseToStudent
app.post('/rest/students/:studentId/courses/:courseId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const courseId = req.params.courseId;

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                courses: {
                    connect: { id: courseId }
                }
            }
        })
        return res.status(201).json(updatedStudent)
    } catch (error: any) {
        return res.status(500).json({ message: error })
    }
})

//generatePayments
app.post('/rest/courses/:courseId/students/:studentId/payments', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.params.studentId;
        const course = await prisma.course.findUnique({ where: { id: courseId } });

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const generatePayment = await prisma.payment.create({
            data: {
                studentId: studentId,
                courseId: courseId,
            }
        })
        return res.json({ message: 'Payment Generated Succefully', payment: generatePayment })
    } catch (error: any) {
        console.error("Failed to generate payment:", error);
        return res.status(500).json({ message: error })
    }
})

//markPaymentDone
app.patch('/rest/payments/:id', async (req, res) => {
    try {
        const paymentId = req.params.id
        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        const updatedPayment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                markPaymentDone: true
            }
        });
        return res.json({ message: 'Payment marked as done', payment: updatedPayment });
    } catch (error: any) {
        return res.status(500).json({ message: error })
    }
})

//removeCourseFromStudent
app.delete('/rest/students/:studentId/courses/:courseId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const courseId = req.params.courseId;

        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                courses: {
                    disconnect: { id: courseId }
                }
            }
        });

        return res.json({ message: 'Course removed from student successfully', student: updatedStudent });
    } catch (error: any) {
        return res.status(500).json({ message: error })
    }
})

app.use(express.static('public'));

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
