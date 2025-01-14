const express = require("express");
const router = express.Router();
const serverController = require('../controllers/serverController');

//returns the list of all server in the database ↓
router.get("/serverList", serverController.getAllServers);
//returns server details and 10 last reponses ↓  !BEWARE! RETURNS THE TIME IN UTC / GMT+0
router.get("/readServer/:server_id", serverController.getServerDetailsAnd10LastReplies);
// returns all servers and their current health status ↓
router.get("/allServersHealth" , serverController.getAllServersHealth)
// returns a servers full history of responses from latest to oldest ↓ BEWARE! RETURNS THE TIME IN UTC / GMT+0
router.get("/serverHistory/:server_id" , serverController.getServerHistory)
// by given timestamp , returns if server was healthy at that time ! .  ↓
router.get("/washealthy/:server_id/:day/:month/:year/:hour/:minute" , serverController.wasServerHealthyAtTime)
// creates server with parameters included in the body
router.post("/", serverController.createServer)
// patches the server with new information included in the body
router.patch("/:server_id" , serverController.patchServer)
// deletes a server by given server_id
router.delete("/:server_id" , serverController.deleteServer)

module.exports = router;
