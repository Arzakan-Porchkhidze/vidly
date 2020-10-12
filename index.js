const mongoose = require('mongoose');
const express = require('express');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const app = express();

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('connected to mongoDB...'))
    .catch(err => console.error('could not connect to mongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));