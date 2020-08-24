const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
exports.uploadToSlack = async (file, channel, title, descriptions) => {
  const formData = new FormData();
  console.log("file.name====",file)
  const readStream = fs.createReadStream(file.path, {
    filename: file.filename,
    contentType: file.mimetype,
  });

  formData.append("file", readStream);
  // formData.append("token", process.env.SLACK_TOKEN);

  const options = {
    method: "POST",
    url: `${process.env.SLACK_API_URL}/files.upload`,
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      "Content-Type": "multipart/form-data, application/x-www-form-urlencoded",
      ...formData.getHeaders(),
    },
    data: formData,
    params: {
      token: process.env.SLACK_TOKEN,
      channels: channel,
      title: title,
      initial_comment: descriptions
    },
  };
  const response=await axios(options);
  return response
};

exports.createChannel = async (channel) => {
  const options = {
    method: "POST",
    url: `${process.env.SLACK_API_URL}/conversations.create`,
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded, application/json",
    },
    params: {name: channel}
  };
  const response=await axios(options);
  return response
}