/**
 * Import dependencies
 * */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const debug = require('debug')('ohgnarly:server');

/**
 * Load settings by environment
 */
let environment = process.env.NODE_ENV || 'development';
let settings;
if (environment === 'production') {
    settings = require('./settings');
} else {
    settings = require(`./settings.${environment}`);
}

/**
 * Configure express app
 * */
let app = express();
let port = normalizePort(process.env.PORT || '3000');


app.set('port', port);

app.listen(port)

app.on('error', onError);
app.on('listening', onListening);

/**
 * Configure routes and middleware components
 * */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Helper functions used in configuration. 
 * */
function normalizePort(val) {
    console.log('port value: ' + val);
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}
  
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
