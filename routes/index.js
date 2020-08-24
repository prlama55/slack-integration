const express = require("express");
const router = express.Router();
const multer = require("multer");
const {uploadToSlack, createChannel} = require("../helper/upload");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Welcome" });
});

/* POST upload to slack. */
router.post("/api/upload", upload.single("uploadedFile"), async function (
  req,
  res
) {
  const response = await uploadToSlack(
    req.file,
    req.body.channel,
    req.body.title,
    req.body.description
  );
  let data=response.data
  let error=response.data
  let status=response.status
  console.log("error====",error)
  if(error.error==='channel_not_found'){
const channelResponse=await createChannel(req.body.channel)
console.log("channelResponse=====",channelResponse.data)
    if(channelResponse.error){
      res.status(channelResponse.status).json({
        data: channelResponse.error,
      });
    }else{
      const responseData = await uploadToSlack(
          req.file,
          req.body.channel,
          req.body.title,
          req.body.description
      );
      data=responseData.data
      error=responseData.data
      status=responseData.status
    }
  }
  res.status(status).json({
    data: error ? error : data,
  });
});
module.exports = router;
