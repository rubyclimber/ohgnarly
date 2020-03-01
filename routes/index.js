module.exports = function(settings) {
    const express = require('express');
    const request = require('request');
    const router = express.Router();
    const customHeaders = {
        'api-key': settings.apiKey(), 
        'sender': settings.apiSender()
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
        console.log(settings.apiUrl);
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