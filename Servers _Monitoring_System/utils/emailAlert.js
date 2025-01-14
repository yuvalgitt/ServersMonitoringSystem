const nodemailer = require("nodemailer");
const { Server } = require("../models/Server");
const { alertMail } = require("../config/config");

const notifyThatServerUnhealthy = async (serverObj) => {
  const { name, server_id } = serverObj;
  if (!serverObj instanceof Server) {
    console.log("invalid parameter");
    return;
  }
  const user = "yuvalprojects232@gmail.com";
  const appPassword = "pfxn eaad rynd jvdm";

  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: user,
    to: alertMail, //determined in config/config.js
    subject: "Server Health Status Alert!",
    text: `server id(${server_id}) : ${name} is unhealthy`,
  };
  try {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) return error;
      return `Alert email sent successfuly ${info.response}`;
    });
  } catch (error) {
    console.log("mail alert - ", error);
    return error;
  }
};

module.exports = {
  notifyThatServerUnhealthy,
};
