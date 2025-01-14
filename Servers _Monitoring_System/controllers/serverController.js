const { Server } = require("../models/Server");
const serverService = require("../services/serverService");
const responseService = require("../services/responseService");

const getAllServers = async (req, res) => {
  try {
    const data = await serverService.getAllServers();
    res.send(data);
  } catch (error) {
    res.status("500").send(error);
  }
};

const getServerById = async (req, res) => {
  const server_id = req.params.server_id;
  try {
    const data = await serverService.getServerById(server_id);
    res.send(data);
  } catch (error) {
    res.status("500").send(error);
  }
};

const getServerDetailsAnd10LastReplies = async (req, res) => {
  const server_id = req.params.server_id;
  try {
    const response = await serverService.getServerById(server_id);

    const serverObj = new Server(response);
    const responses = await responseService.getXLastResponsesOfServer(
      server_id,
      10
    );

    res.send({ serverObj, responses });
  } catch (error) {
    res.sendStatus(error);
  }
};
const createServer = async (req, res) => {
  const body = req.body;
  try {
    const data = await serverService.createServer(body);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
const patchServer = async (req, res) => {
  try {

    const body = req.body;
  
    const server_id = req.params.server_id;

    const response = await serverService.patchServer(server_id, body);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
const deleteServer = async (req, res) => {
  const server_id = req.params.server_id;
  try {
    const response = await serverService.deleteServer(server_id);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};
const getAllServersHealth = async (req, res) => {
  try {
    const response = await serverService.getAllServersHealth();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

const getServerHistory = async (req, res) => {
  const server_id = req.params.server_id;
  try {
    const response = await responseService.getServerHistory(server_id);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

const wasServerHealthyAtTime = async (req, res) => {
  const { server_id, year, month, day, hour, minute } = req.params;
  try {
    const response = await responseService.wasServerHealthyAtTime(server_id, {
      year,
      month,
      day,
      hour,
      minute,
    });
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  wasServerHealthyAtTime,
  getServerHistory,
  getServerById,
  getAllServersHealth,
  deleteServer,
  patchServer,
  createServer,
  getAllServers,
  getServerDetailsAnd10LastReplies,
};
