const pgClient = require("../database/pg");

const recordConnectionResponse = async (server_id, response_healthy) => {
  const queryText = `insert into responses(server_id,response_healthy)
    values ($1,$2)`;

  try {
    const response = await pgClient.query(queryText, [
      server_id,
      response_healthy,
    ]);
    return response;
  } catch (error) {
    return error.detail ? error.detail : error;
  }
};

const getXLastResponsesOfServer = async (server_id, times) => {
  // GMT+0
  const queryText = `
  select * from responses
  where server_id = $1
  order by time desc
  limit $2;
  `;
  try {
    const response = await pgClient.query(queryText, [server_id, times]);
    return response.rows;
  } catch (error) {
    return error.detail ? error.detail : error;
  }
};

const getServerHistory = async (server_id) => {
  const queryText = `select * from responses
    where server_id = $1
    order by time desc`;
  console.log(queryText);

  try {
    const response = await pgClient.query(queryText, [server_id]);
    return response.rows;
  } catch (error) {
    return error.detail ? error.detail : error;
  }
};

const wasServerHealthyAtTime = async (server_id, time) => {
  const queryText = `
      select * from responses 
      where server_id = $1
      and extract(year from time) = $2
      and extract(month from time) = $3
      and extract(day from time) = $4
      and extract(hour from time) = $5
      and extract(minute from time) = $6
  `;

  const values = [
    server_id,
    time.year,
    time.month,
    time.day,
    time.hour,
    time.minute,
  ];

  try {
    let response = await pgClient.query(queryText, values);
    response = response.rows[0].response_healthy;
    console.log(response);
    return response ? "healthy" : "unhealthy";
  } catch (error) {
    return error.detail ? error.detail : error;
  }
};

module.exports = {
  wasServerHealthyAtTime,
  getServerHistory,
  recordConnectionResponse,
  getXLastResponsesOfServer,
};
