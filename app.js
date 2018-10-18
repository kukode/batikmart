var express = require('express');
const path = require('path');
const cors = require('cors')
const indexRouter = require('./routes/index');
const clientRoute = require('./routes/client');
const passport = require('passport')


const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'gambar')));


app.use('/api', indexRouter);
app.use('/client', clientRoute);


app.listen(process.env.PORT ||  3000, function () {
    console.log("app running on port.", process.env.PORT ||  3000);
});


module.exports = app;
