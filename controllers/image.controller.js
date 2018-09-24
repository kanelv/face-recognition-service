const fs = require('fs');
const Image = require('../models/image.model');
const User = require('../models/user.model');

const listResult = [];
let imageUpdate = [];

// get number Image to set imgid
function getNumber() {
  return new Promise((resolve, reject) => {
    Image.findOne()
      .sort({ createdAt: -1 })
      .exec((err, image) => {
        if (err) reject(err);
        else if (!image) {
          resolve(0);
        } else {
          resolve(parseInt(image.imgid, 10));
        }
      });
  });
}

// cover image to base64 string
function base64Encode(file) {
  const bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}

// Create and Save a new Image
exports.create = (req, res) => {
  //   console.error('Hey! This is your image');

  if (!req.files) {
    res.status(400).send({
      message: 'No files were uploaded'
    });
  }
  //   else {
  //     console.log(req.files);
  //   }

  const imageFile = req.files.img;
  const userId = imageFile.name.split('_')[0];

  // new user
  new Promise((resolve, reject) => {
    // save image
    getNumber()
      .then(number => {
        // console.log(imgpath);
        const imgPath = `./uploadImg/${imageFile.name.split('_')[0]}_${(
          number + 1
        ).toString()}.jpg`;

        const newImage = new Image({
          userid: userId || 'Unknown User',
          imgid: (number + 1).toString(),
          imgpath: `./uploadImg/${imageFile.name.split('_')[0]}_${(
            number + 1
          ).toString()}.jpg`
        });

        imageFile.mv(imgPath, err => {
          //   console.log('save file here');
          if (err) res.status(500).send(err);
        });
        newImage
          .save()
          .then(() => {
            return {
              imageName: `${newImage.userid}_${newImage.imgid}.jpg`,
              base64str: base64Encode(newImage.imgpath),
              createdAt: newImage.createdAt
            };
          })
          .then(imageData => {
            // console.log('That is image');
            // console.log(image);
            // check userid existed
            User.findOne({ userid: userId })
              .then(user => {
                // console.log(userid);
                // user isn't exist
                if (!user) {
                  const userData = new User({
                    userid: userId,
                    fullname: 'No Name',
                    email: `example ${userId}@dn.com`,
                    class: 'No Class',
                    address: 'No address'
                  });

                  userData
                    .save()
                    .then(data => {
                      //   console.log('create new user');
                      resolve({
                        image: imageData,
                        user: {
                          fullname: data.fullname,
                          email: data.email,
                          class: data.class,
                          address: data.address
                        }
                      });
                    })
                    .catch(err => {
                      return res.status(500).send({
                        message:
                          err.message ||
                          'Some error occured while creating the User'
                      });
                    });
                } else {
                  // user is exist
                  // add userid into imageUpdate
                  imageUpdate.push(userId);
                  resolve({
                    image: imageData,
                    user: {
                      fullname: user.fullname,
                      email: user.email,
                      class: user.class,
                      address: user.address
                    }
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || 'Some error occured while creating the User'
                });
              });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || 'Some error occured while creating the User'
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message ||
            'Some error occured while creating the Image on Database'
        });
      });
  })
    .then(data => {
      // Process in to listResult array
      imageUpdate = Array.from(new Set(imageUpdate));
      //   console.log(imageUpdate);
      listResult[userId] = data;
      res.status(200).send({
        message: 'add image successfull'
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occured while creating the User'
      });
    });
};

// list all
exports.listAll = (req, res) => {
  let userids = [];
  // console.log(req.params);
  if (!req.params.userids) {
    userids = [];
  } else {
    userids = req.params.userids.split(',');
  }

  new Promise((resolve, reject) => {
    // console.log(userids);
    // console.log(imageUpdate);
    if (imageUpdate.length > 0) {
      resolve(arrayDiff(userids, imageUpdate));
    } else {
      resolve(userids);
    }
    if (userids === undefined) {
      reject({
        message: 'userids cannot empty'
      });
    }
  })
    .then(data => {
      console.log('love you so much');
      console.log(data);
      for (var k in listResult) {
        if (!data.includes(k)) {
          res.write(`${JSON.stringify(listResult[k])},`);
        }
      }
    })
    .then(() => {
      // res.write("}")
      res.end();
    })
    .catch(err => {
      throw err;
    });
};

// get number to assign imgid
exports.number = (req, res) => {
  Image.findOne()
    .sort({ createdAt: -1 })
    .exec((err, image) => {
      if (err)
        res.status(500).send({
          message: err.message || 'Some error occured while get number Image'
        });
      res.send(image.imgid);
    });
};

// get Imge last of User by userid
exports.findOne = (req, res) => {
  new Promise((resolve, reject) => {
    // find image and covert base64
    Image.findOne({ userid: req.params.userid })
      .sort({ createdAt: -1 })
      .exec((err, image) => {
        if (err) reject(err);
        else {
          //   var imageName = image.userid + '_' + image.imgid + '.jpg';

          const img = {
            imageName: `${image.userid}_${image.imgid}.jpg`,
            base64str: base64Encode(image.imgpath),
            createdAt: image.createdAt
          };
          resolve(img);
        }
      });
  })
    .then(image => {
      // find user and response
      User.findOne({ userid: req.params.userid })
      .exec((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || 'Some error occured while get image by userid'
          });
        else {
            res.status(200).send({
                img: image,
                user: {
                    fullname:  data.fullname,
                    email: data.email,
                    class: data.class,
                    address: data.address
                }
            });
      }
    })
    .catch(err => {
      throw err;
      res.status(500).send({
        message: err.message
      });
    });
},

exports.delete = (req, res) => {
  Image.findOneAndRemove({ imgid: req.params.imgid })
    .then(image => {
      if (!image) {
        return res.status(404).send({
          message: `Image not found with imgid ${req.params.imgid}`
        });
      }

      try {
        fs.unlinkSync(image.imgpath);
        return res.status(200).send({
          message: `Successfully deleted ${image.userid}_${image.imgid}.jpg`
        });
      } catch (err) {
        throw err;
      }
    })
    .catch(err => {
      throw err;
    });
},

// get date of all image by userid
exports.getDates = (req, res) => {
  const dateOfAllImage = [];
  //   console.log(`get images dates have ${req.params.userid}`);
  Image.find({ userid: req.params.userid })
    .then(images => {
      if (images.length === 0) {
        res.status(400).send({
          message: 'Nothing images dependence userid'
        });
      } else {
        images.forEach(image => {
          const date = image.createdAt.toJSON();
          dateOfAllImage.push(date);
        });
        res.status(200).send({
          dates: dateOfAllImage
        });
      }
    })
    .catch(err => {
      throw err;
    });
},

// get the difference between two arrays right
function arrayDiff(a1, a2) {
  const a = [];
  const diff = [];
  for (let i = 0; i < a1.length; i + 1) {
    a[a1[i]] = true;
  }

  for (let i = 0; i < a2.length; i + 1) {
    if (a[a2[i]]) delete a[a2[i]];
    delete a2[i];
  }

  for (let k in a) {
    diff.push(k);
  }

  return diff;
},

module.exports.listResult = listResult;
