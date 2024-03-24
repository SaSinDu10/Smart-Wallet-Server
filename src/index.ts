import * as express from "express";
import * as cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

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

app.get('/rest/students', async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        return res.json(students);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

app.post('/rest/students', async (req, res) => {
    try {
        const { name } = req.body;
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


app.use(express.static('public'));

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
