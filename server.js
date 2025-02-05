const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const gitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app
    .use(bodyParser.json())

    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-key, Authorization")
        res.setHeader("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })

    .use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH']}))
    .use(cors({origin: '*'}))
    .use('/', require('./routes/index.js'))


mongodb.intDb((err) => {
    if (err) {
        console.log(err)
    }else{
        app.listen(port, () => (console.log(`Data Base is listening and Server started on port ${port}`)));
    }
}) 