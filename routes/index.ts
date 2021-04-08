import {Request, Response, Router} from "express";
import request from 'request';
import {Settings} from '../settings';

export class Routes {
    private readonly customHeaders: any;
    
    constructor() {
        this.customHeaders = {
            'api-key': Settings.apiKey(),
            'sender': Settings.apiSender()
        }
    }
    
    configureRoutes = (router: Router) => {
        router.get('/users', this.getToApi);
        router.post('/chat-login', this.postToApi);
        router.get('/messages', this.getToApi);
        router.get('/categories', this.getToApi);
        router.post('/messages', this.postToApi);
        router.post('/message', this.postToApi);
        return router
    }

    private postToApi = async (req: Request, res: Response) => {
        request.post(Settings.apiUrl() + req.originalUrl,
            {json: true, body: req.body, headers: this.customHeaders},
            (err, resp, body) => {
                if (err) {
                    return console.error(err);
                }

                console.log(body);
                res.send(body);
            });
    }

    private getToApi = async (req: Request, res: Response) => {
        request.get(Settings.apiUrl() + req.originalUrl,
            {json: true, headers: this.customHeaders},
            (err, resp, body) => {
                if (err) {
                    return console.error(err);
                }

                res.send(body);
            });
    }
}