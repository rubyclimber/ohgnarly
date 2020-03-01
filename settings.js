module.exports.apiUrl = () => {
    return process.env.GNARLY_API;
};

module.exports.apiKey = () => {
    return process.env.API_KEY;
}

module.exports.apiSender = () => {
    return process.env.API_SENDER;
}