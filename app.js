var express = require('express');
const path = require('path');
const cors = require('cors')
const indexRouter = require('./routes/index');
const passport = require('passport')


const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);


app.listen(process.env.PORT ||  3000, function () {
    console.log("app running on port.", process.env.PORT ||  3000);
});


module.exports = app;
