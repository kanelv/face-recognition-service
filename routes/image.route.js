import { create, number, findOne, deleteOne, listAll, getDates }  from "../controllers/image.controller.js";

export const imageRoute = app => {
  // to post image into server
  // post: localhost:3000/images
  app.post('/images', create);

  // to get idImage last
  // get: localhost:3000/images/number
  app.get('/images/number', number);

  // to get Image base64
  // get: localhost:3000/images/2
  app.get('/images/:userid', findOne);

  // Delete a Image with idImg
  // delete: localhost:3000/image/3
  app.delete('/images/:imgid', deleteOne);

  // listAll
  // app.get('/listAll/', image.listAll)
  app.get('/listAll/:userids?', listAll);

  app.get('/images/dates/:userid', getDates);
};
