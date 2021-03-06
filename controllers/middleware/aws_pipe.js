const util = require("util");
const multer = require("multer");
const maxSize = 2 * 4092 * 4092;
const sharp = require("sharp");
var fs = require("fs");
const models = require("../../models");

// Configure aws
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
let s3 = new AWS.S3();

//configure multer
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
const multerMemoryStorage = multer.memoryStorage();

const download_aws = async (req, res) => {
  //console.log(req.params.name);
  try {
    let fName = req.params.name;
    let data = await s3
      .getObject({
        Bucket: "geneolos3bucket",
        Key: `user_images/${fName}`,
      })
      .promise();
    let file = Buffer.from(data.Body);

    console.log(file);

    res.send(file);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};

const download_aws_public = async (req, res) => {
  let fName = req.params.name;
  let uuid = fName.split(".")[0];

  try {
    let currentFamilyMember = await models.family_member.findOne({
      where: {
        uuid_family_member: uuid,
      },
      raw: true,
    });
    //console.log(currentFamilyMember);
    let currentFamilyTree = await models.family_tree.findOne({
      where: {
        uuid_family_tree: currentFamilyMember.uuid_family_tree,
      },
      raw: true,
    });
    //console.log(currentFamilyTree);
    if (currentFamilyTree.isPublic === false) {
      throw new Error("Family tree not public");
    }

    let data = await s3
      .getObject({
        Bucket: "geneolos3bucket",
        Key: `user_images/${uuid}.jpeg`,
      })
      .promise();
    let file = Buffer.from(data.Body);

    console.log(file);

    res.send(file);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};

const get_button_thumbnail = async (req, res) => {
  let publicName = req.params.public_name;
  try {
    let resp = await models.family_tree.findOne({
      where: {
        publicName,
      },
      raw: true,
    });
    //console.log("get_button_thumbnail: " + publicName);
    //console.log(resp);
    if (resp === null) {
      throw new Error("Family tree not found");
    }
    if (resp.isPublic !== true) {
      throw new Error("Family tree not public");
    }

    let data = await s3
      .getObject({
        Bucket: "geneolos3bucket",
        Key: `user_images/${resp.focal_member}.jpeg`,
      })
      .promise();
    let file = Buffer.from(data.Body);

    console.log(file);

    res.send(file);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};

const multerMiddleware = util.promisify(
  multer({
    storage: multerMemoryStorage,
    limits: { fileSize: maxSize },
    fileFilter: multerFilter,
  }).single("file")
);

const upload_aws = async (req, res) => {
  //not protected by JWT!!!!
  if (!req.file) {
    return res.sendStatus(400);
  }
  const filename = req.file.originalname;
  const newFilename = filename.substr(0, filename.lastIndexOf(".")) || filename;
  let img = await sharp(req.file.buffer)
    //can do clever stuff here like crop to focus on the face
    .resize(240, 240)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
  console.log(img);
  try {
    let uploadedFile = await s3
      .upload({
        Bucket: "geneolos3bucket",
        Key: `user_images/${newFilename}.jpeg`,
        Body: img,
      })
      .promise();
    console.log("Success: " + uploadedFile);
  } catch (err) {
    console.log("Error: " + err);
  }
  res.sendStatus(200);
};

module.exports = {
  download_aws,
  download_aws_public,
  get_button_thumbnail,
  multerMiddleware,
  upload_aws,
};
