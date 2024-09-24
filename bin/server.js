var express                 = require('express');
var app                     = express();
var server                  = require('http').createServer(app);
var bodyParser              = require('body-parser');
var compress                = require('compression');
var cors                    = require('cors');
const v8                    = require('v8');

var authMiddleware          = require('../lib/middlewares/authMiddleware');
var apiLimitsMiddleware     = require('../lib/middlewares/apiLimitsMiddleware');
var wwwRedirectMiddleware   = require('../lib/middlewares/wwwRedirectMiddleware');


// Increase heap size
v8.setFlagsFromString('--max_old_space_size=16384');


// Middlewares
app.use(compress());
app.use(bodyParser.json());
app.use(cors());
// app.use(wwwRedirectMiddleware);
// app.use(authMiddleware);
// app.use(apiLimitsMiddleware);
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// EJS HTML engine
app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');


// Initialize the controllers
var apiController           = require('../lib/controllers/apiController')(app);
var frontController         = require('../lib/controllers/frontController')(app);


// Let's start the server!
if (!process.env.GRUNTED) {
    var settings = require('../server_config/settings.json');

    app.locals.baseUrl = settings.baseUrl;

    server.listen(settings.serverPort, function() {
        console.log('Listening on port %d', server.address().port);

        // For the tests
        if (server.startTests) {
            server.startTests();
        }
    });
}

module.exports = app;
