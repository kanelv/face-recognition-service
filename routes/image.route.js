module.exports = (app) => {
    const image = require("../models/image.model");

    app.post('/images', image.create);
}