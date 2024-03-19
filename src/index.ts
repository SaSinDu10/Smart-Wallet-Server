const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const app = express();
app.use(express.json());
//app.use(express.urlencoded({extends: true}));
app.use(cors());

app.get('/rest/students', (req, res) => {
    //res.render("login");
    const {username,password} = req.body

    try{
        const check = collection.findOne({username:username})

        if (check) {
            res.json("exist");
        }
        else{
            res.json("notexist");
        }
    }
    catch(e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/rest/students', async (req, res) => {
    try {
        const { name, id } = req.body;
        res.json({ message: 'Student created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.put('/rest/students/:student_id', async (req, res) => {
    try {
        const studentId = req.params.student_id;
        const { name, id } = req.body;
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(express.static('public'));

//port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

