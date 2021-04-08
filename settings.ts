export class Settings {
    static apiUrl = () => {
        return process.env.GNARLY_API;
    }

    static apiKey = () => {
        return process.env.API_KEY;
    }

    static apiSender = () => {
        return process.env.API_SENDER;
    }
}