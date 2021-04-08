/**
 * Import dependencies
 * */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import Debug from 'debug';
import dotenv from 'dotenv';
import {Routes} from './routes/index';

dotenv.config();

const debug = Debug('ohgnarly:server');


/**
 * Configure express app
 * */
let port = normalizePort(process.env.PORT || '3000');
let app = express();

app.set('port', port);

const server = app.listen(port, onListening);

app.on('error', onError);

/**
 * Configure routes and middleware components
 * */
const appRoot = __dirname;//.replace('/dist', '')
console.log(path.join(appRoot, 'public', 'favicon.ico'));
app.use(favicon(path.join(appRoot, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(appRoot, 'public')));
app.use('/', new Routes().configureRoutes(express.Router()));

/**
 * Helper functions used in configuration.
 * */
function normalizePort(val: string) {
    console.log('port value: ' + val);
    const port = parseInt(val, 10);

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

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
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
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
