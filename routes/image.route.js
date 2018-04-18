module.exports = (app) => {
    const image = require("../controllers/image.controller");

    app.post('/images', image.create);
}