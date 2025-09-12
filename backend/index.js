const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//routes
const auth = require('./src-teacher/routes/authRoute');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Import routes
app.use('/api/teacher/auth', auth);



app.listen(port, () => {
    console.log(`Server running on localhost:${port}/`);
});
