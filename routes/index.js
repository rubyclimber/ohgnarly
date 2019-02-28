module.exports = function(settings) {
    const express = require('express');
    const request = require('request');

    const router = express.Router();
    const customHeaders = {
        'api-key': 'M1lxUG7MdBbvsaPEjono+w==', 
        'sender': 'ohGnarlyChat'
    }

    router.get('/users', getToApi);

    router.post('/chat-login', postToApi);

    router.get('/messages', getToApi);

    router.get('/categories', getToApi);

    router.post('/messages', postToApi);

    function postToApi(req, res) {
        request.post(settings.apiUrl + req.originalUrl,
            {json: true, body: req.body, headers: customHeaders},
            (err, resp, body) => {
                if (err) {
                    return console.error(err);
                }

                res.send(body);
            });
    }

    function getToApi(req, res) {
        request.get(settings.apiUrl + req.originalUrl,
            {json: true, headers: customHeaders},
            (err, resp, body) => {
                if (err) {
                    return console.error(err);
                }

                res.send(body);
            });
    }

    return router;
}