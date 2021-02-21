const path = require('path');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');
require('dotenv').config();

let indexRouter = require('./routes/index');
let subdivisionsRouter = require('./routes/subdivisions')
let repairsRouter = require('./routes/repairs');

const port = process.env.PORT || 3000;

app.engine('.hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/subdivisions', subdivisionsRouter);
app.use('/repairs', repairsRouter);

app.listen(port, () => {
    console.log(`Express web app available at localhost: ${port}`);
});