// require libraries
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Handlebars = require('handlebars');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const checkAuthen = require('./middleware/checkAuthen');

// middlewear
var exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
// override with POST having ?_method=DELETE or ?_method=PUT


app.use(bodyParser.urlencoded({ extended: true }), methodOverride('_method'));
// templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main',
handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(checkAuthen);
const mongoDB = 'mongodb+srv://meka_1904:987654321@cluster0.w26lw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });


const reviews = require('./controllers/reviews')(app);
const comments = require('./controllers/comments')(app);
require('./controllers/auth.js')(app);

// app route
app.listen(2000, () => {
  console.log('App listening on port 2000!')
})