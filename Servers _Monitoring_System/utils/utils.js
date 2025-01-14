const axios = require("axios");
const { Client } = require("ssh2");
const ftp = require("basic-ftp");
const { recordConnectionResponse } = require("../services/responseService");

// server type check ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// this is the bread and butter of this project. Here each function test the server's connection and returns an HTTP code
const checkHttpServer = async (serverObj) => {
  const { server_url, server_id } = serverObj;
  try {
    const response = await axios.get(server_url, { timeout: 45000 }); //timeout 45 seconds
    
    if (response) {
      recordConnectionResponse(server_id, true); // saves the connection attempt to the database as a successfuly connection

      return response.status;
    }
  } catch (error) {
    recordConnectionResponse(server_id, false);// saves the connection attempt to the database as an unsuccessfuly connection
    if (error.response) return error.response.status;
    return error.code;
  }
};

const checkSSHServer = async (serverObj, port = 22) => {
  const { server_id, server_url, username, password } = serverObj;
  const sshClient = new Client();
  
  return new Promise((resolve, reject) => {
    sshClient
      .on("ready", () => {
        sshClient.end();

        if (server_id) recordConnectionResponse(server_id, true); // saves the connection attempt to the database as a successfuly connection
        resolve(200);
      })
      .on("error", (error) => {
        if (server_id) recordConnectionResponse(server_id, false); // saves the connection attempt to the database as an unsuccessfuly connection

        if (error.code === "ECONNREFUSED") { //refused
          return reject(502); // HTTP 502: Bad Gateway
        }
    
        if (error.code === "ETIMEDOUT") { // connection attempt lasted more than 45 seconds
          return reject(504); // HTTP 504: Gateway Timeout
        }
    
        // bad username or password
        if (error.message.includes("authentication")) {
          return reject(401); // HTTP 401: Unauthorized
        }
        //incompatible
        if (error.message.includes("handshake failed")) {
          return reject(426); // HTTP 426: Upgrade Required
        }
        return reject(500)
      })
      .connect({
        host: server_url,
        port: serverObj.port ? serverObj.port : port,
        username: username,
        password: password,
        readyTimeout: 45000,
      });
  });
  
};

const checkFTPServer = async (serverObj, port = 21) => {
  const { server_id, server_url, username, password } = serverObj;
  const ftpClient = new ftp.Client();
  ftpClient.ftp.verbose = false; //logs socket information. set to false to keep the terminal clean
  ftpClient.ftp.timeout = 45000;
  ftpClient.ftp.passive = true; // opens communication only from client to server and avoids firewall whitelisting requirement

  try {
    // attempting connection
    await ftpClient.access({
      host: server_url,
      port: serverObj.port ? serverObj.port : port,
      user: username,
      password: password,
    });
    //connection successful
    ftpClient.close();
    recordConnectionResponse(server_id, true);
    return 200;
  } catch (error) {
    recordConnectionResponse(server_id, false);

    if (error.response) return error.response.status;
    return error.code;
  }
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
module.exports = {
  checkFTPServer,
  checkHttpServer,
  checkSSHServer,
};
