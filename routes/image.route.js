module.exports = (app) => {
    const image = require("../controllers/image.controller");

    app.post('/images', image.create);
    app.get('/images/number', image.number);
    app.get('/images/:idUser', image.getImagebyIdUser)
}