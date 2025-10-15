const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
//routes
const auth = require('./src/routes/authRoute');
const notify = require('./src/routes/notifyRoute');
const events = require('./src/routes/eventsRoute');
const teacher = require('./src/routes/teacherRoute')


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use('/api/auth', auth);
app.use('/api/notify', notify);
app.use('/api/events', events);
app.use('/api/teacher', teacher);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server running on localhost:${port}/`);
});
