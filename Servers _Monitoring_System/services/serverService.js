const { Server } = require("../models/Server");
const pgClient = require("../database/pg");
const {
  checkHttpServer,
  checkSSHServer,
  checkFTPServer,
} = require("../utils/utils");

const getAllServers = async () => {
  try {
    const response = await pgClient.query("select * from servers");
    return response.rows;
  } catch (error) {
    throw error;
  }
};

const getServerById = async (server_id) => {
  try {
    const response = await pgClient.query(
      `select * from servers where server_id=${server_id}`
    );

    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

const getAllServersHealth = async () => {
  const queryText = `select server_id,name,health from servers`;
  try {
    const response = await pgClient.query(queryText);
    return response.rows;
  } catch (error) {
    return error.detail ? error.detail : error;
  }
};

const createServer = async (body) => {
  const values = [
    body.name,
    body.server_url,
    body.type,
    body.username,
    body.password,
    body.port,
  ];
  const queryText = `insert into servers(name, server_url, type, username, password, port) values($1,$2,$3,$4,$5,$6)`;
  try {
    const response = await pgClient.query(queryText, values);
    return response;
  } catch (error) {
    if (error.detail) return error.detail;
    return error;
  }
};

const patchServer = async (server_id, patchBody) => {
  const values = [
    patchBody.name, //1
    patchBody.server_url, //2
    patchBody.type, //3
    patchBody.username, //4
    patchBody.password, //5
    patchBody.port, //6
    server_id, //7
  ];
  const queryText = `update servers 
    set 
    name=$1, server_url=$2, type=$3, username=$4, password = $5, port = $6 
    where server_id =$7`;
  try {
    const response = await pgClient.query(queryText, values);
    rowsAffected = response.rowCount;

    return { rowsAffected };
  } catch (error) {
    console.log(error);

    if (error.detail) return error.detail;
    return error;
  }

  throw new Error("parameter is not of Server class");
};

const deleteServer = async (server_id) => {
  const deleteResponsesQuery = "delete from responses where server_id=$1";
  const queryText = `delete from servers where server_id=$1`;
  try {
    await pgClient.query(deleteResponsesQuery, [server_id]);
    const response = await pgClient.query(queryText, [server_id]);
    return `${response.command} server named : ${server_id}`;
  } catch (error) {
    return error.detail ? error.detail : error;
  }
};

//this function routes the serverObj depending on its type e.g. 'http' , 'ssh' , 'ftp'
const testServerHealth = async (serverObj, port) => {
  const type = serverObj.type;
  if (type === "http" || type === "https") {
    const response = await checkHttpServer(serverObj, port);
    return response;
  } else if (type === "ssh") {
    const response = await checkSSHServer(serverObj, port);
    return response;
  } else if (type === "ftp") {
    try {
      const response = await checkFTPServer(serverObj, port);
      return response;
    } catch (error) {
      return error;
    }
  } else {
    console.error(
      `\x1b[41m ${serverObj.type} type is unsupported. Remove server from database. server_id : ${serverObj.server_id} \x1b[0m .`
    );
  }
};

module.exports = {
  getServerById,
  getAllServersHealth,
  deleteServer,
  patchServer,
  createServer,
  getAllServers,
  testServerHealth,
};
