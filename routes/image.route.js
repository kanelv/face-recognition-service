const image = require('../controllers/image.controller');

module.exports = app => {
  // to post image into server
  // post: localhost:3000/images
  app.post('/images', image.create);

  // to get idImage last
  // get: localhost:3000/images/number
  app.get('/images/number', image.number);

  // to get Image base64
  // get: localhost:3000/images/2
  app.get('/images/:userid', image.findOne);

  // Delete a Image with idImg
  // delete: localhost:3000/image/3
  app.delete('/images/:imgid', image.delete);

  // listAll
  // app.get('/listAll/', image.listAll)
  app.get('/listAll/:userids?', image.listAll);

  app.get('/images/dates/:userid', image.getDates);
};
