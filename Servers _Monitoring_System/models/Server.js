class Server {
  constructor({server_id,name,server_url,type,username,password,health,port}) {
    if (!server_url || !type) {
      throw new Error(`missing parameters type or url` );
    }
    this.server_id = server_id;
    this.name = name; // Name of the server
    this.server_url = server_url; // URL of the server
    this.type = type; // Type of server (e.g., web, database)
    this.username = username; // Username for server authentication
    this.password = password; // Password for server authentication
    this.health = health; // Server health status (e.g., 'healthy', 'unhealthy')
    this.port = port; // Port the server is listening on
  }
  
  getCurrentHealth() {
    return this.health
  }

  updateHealth(healthStatus) {
    this.health = healthStatus;
  }
}

module.exports = { Server };
