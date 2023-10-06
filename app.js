const express = require('express');
const loginRoutes = require('./routes/login.js');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));


app.use(loginRoutes);


app.use((req,res,next) =>{
    res.status(404);
    res.send('<h2>Page not found</h2>');
})

app.listen(3000);

