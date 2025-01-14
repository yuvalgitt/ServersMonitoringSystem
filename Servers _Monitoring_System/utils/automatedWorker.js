const { Server } = require("../models/Server");
const TimeStamp = require("../models/TimeStamp");
const { getXLastResponsesOfServer } = require("../services/responseService");
const {
  testServerHealth,
  getAllServers,
  patchServer,
} = require("../services/serverService");
const { notifyThatServerUnhealthy } = require("./emailAlert");

// Automated worker ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
const automatedWorker = async (urlArray) => {
  console.log(" \x1b[42m Automated worker started \x1b[0m");
  let timeStamp = new TimeStamp(); //time for the terminal log and not for the database
  timeStamp.logTime(); //displays the date and time in blue text
  //Purely cosmetic

  let index = 1; // keeps track of how many monitors per server occured
  // first attempts
  for (let i = 0; i < urlArray.length; i++) {
    try {
      if (!urlArray[i].server_url || !urlArray[i].type) continue; //avoid illegal server entries
      const server = new Server({ ...urlArray[i] });
      testServer(server); //
    } catch (error) {
      console.log(error);
    }
  }

  // checks every 60 seconds / 1 minute
  setInterval(async () => {
    index++;

    urlArray = await getAllServers(); // refereshes serverlist from the datebase to avoid checking deleting servers.
    timeStamp = new TimeStamp();
    timeStamp.logTime();
    for (let i = 0; i < urlArray.length; i++) {
      if (!urlArray[i].server_url || !urlArray[i].type) continue; //avoid illegal server entries
      const server = new Server({ ...urlArray[i] });
      testServer(server); //
      try {
      } catch (error) {
        console.log(error);
      }
    }
    if (index % 5 == 0) {
      for (let i = 0; i < urlArray.length; i++) {
        if (!urlArray[i].server_url || !urlArray[i].type) continue; //avoid illegal server entries

        const server = new Server(urlArray[i]);
        // const {server_id,name,server_url,type,username,password,port,health,} = urlArray[i];
        checkHealthy(server, 5);
      }
    }
    if (index % 3 == 0) {
      for (let i = 0; i < urlArray.length; i++) {
        if (!urlArray[i].server_url || !urlArray[i].type) continue; //avoid illegal server entries
        const server = new Server(urlArray[i]);
        checkUnHealthy(server);
      }
    }
  }, 60000); //60 seconds
};

//uses pre-existing function to test server health
const testServer = async (serverObj) => {
  const response = await testServerHealth(serverObj);
  console.log(
    `connection to \x1b[38;5;11m${serverObj.name}\x1b[0m  ${
      response === 200
        ? `is \x1b[42m OK \x1b[0m.`
        : `has \x1b[41m FAILED \x1b[0m.`
    }`
  );

  return response;
};

// this function receives a server object and how many times you want to check if there have been consecutive healthy responses to the
// server's url
// known issue - only updates every 6th interval because this function checks 3 responses back meaning current one is not checked
const checkHealthy = async (serverObj, times = 5) => {
  const response = await getXLastResponsesOfServer(serverObj.server_id, times);
  if (response.length > 0)
    //if server has at least one recorded response
    try {
      let flag = true;
      for (let i = 0; i < response.length; i++) {
        if (!response[i].response_healthy) {
          flag = false;
          return;
        }
      }
      
      if (flag && !serverObj.getCurrentHealth()) {
        //checks if the server has changed its status to avoid unecessary updates and emails
        console.log(`${serverObj.name} is now healthy`);
        serverObj.updateHealth(true); //updates the server object to be healthy
        patchServer((serverObj.server_id) ,{...serverObj}); // receives an object and not a server class .updates the server to be healthy in the database
      }
    } catch (error) {
      console.log(error);
    }
};
// this function receives a server object and how many times you want to check if there have been consecutive unhealthy responses to the
// server's url
// known issue - only updates every 4th interval because this function checks 3 responses back meaning current one is not checked
const checkUnHealthy = async (serverObj, times = 3) => {
  const response = await getXLastResponsesOfServer(serverObj.server_id, times);
  if (response.length > 0)
    try {
      let flag = true;
      for (let i = 0; i < response.length; i++) {
        if (response[i].response_healthy) {
          flag = false;
          return;
        }
      }

      if (flag && serverObj.getCurrentHealth()) {
        serverObj.updateHealth(false); //updates the server object to be unhealthy
        console.log(`${serverObj.name} is now unhealthy`);
        notifyThatServerUnhealthy(serverObj); //sends an alert mail to the configured mail in config/config.js
        patchServer(serverObj.server_id,{...serverObj}); //receives an object and not a server class . updates the server to be unhealthy in the database
      }
    } catch (error) {
      console.log(error);
    }
};

module.exports = {
  automatedWorker,
};
