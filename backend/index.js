const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//routes
const auth = require('./src/routes/authRoute');
const notify = require('./src/routes/notifyRoute');


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/auth', auth);
app.use('/api/notify', notify);


app.listen(port, () => {
    console.log(`Server running on localhost:${port}/`);
});
