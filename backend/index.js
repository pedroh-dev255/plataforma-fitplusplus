const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//routes
const auth = require('./src-teacher/routes/authRoute');
const classRoute = require('./src-teacher/routes/classRoute');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// teacher routes
app.use('/api/teacher/auth', auth);
app.use('/api/teacher/class', classRoute);

// student routes



app.listen(port, () => {
    console.log(`Server running on localhost:${port}/`);
});
