 SSSSS  EEEEE  RRRR    V   V  EEEEE  RRRR    	 M     M  OOO   N   N  III  TTTTT  OOO   RRRR   III  N   N   GGG  
S       E      R   R   V   V  E      R   R   	 MM   MM O   O  NN  N   I     T   O   O  R   R   I   NN  N  G     
 SSS    EEEE   RRRR    V   V  EEEE   RRRR    	 M M M M O   O  N N N   I     T   O   O  RRRR    I   N N N  G  GG 
    S   E      R  R    V   V  E      R  R    	 M  M  M O   O  N  NN   I     T   O   O  R  R    I   N  NN  G   G 
SSSS    EEEEE  R   R    VVV   EEEEE  R   R   	 M     M  OOO   N   N  III    T    OOO   R   R  III  N   N  GGGG  

made by Yuval Dayan
Phone - 0545562940
email - ydayan232@gmail.com

table of contents 
1. how to change alert email
2. how to boot the program
3. API



1.Instructions how to change target email for alerts :
1.1.change directory to C:/path/Servers/Monitoring/System/config
1.2. open config.js
1.3. change target email

2.Instructions how to boot : 
2.1. open IDE
2.2. open terminal
2.3. change directory to C:/path/Servers/Monitoring/System/
2.4. in the terminal type and execute "npm install"
2.5. in the terminal type and execute "npm run start"
2.6. to test the application - use included postman collection and dumpfile.sql

3. API
3.1 PATCH method
	3.1.1Patch must include name, server_url , type and will overwrite all rows except for health
		example : {"name" : "google","server_ul" : "google.com" , "type" : "https"}
3.2 GET Methods
	3.2.1 GET localhost:3000/servers/serverlist 
	3.2.2 GET localhost:3000/servers/readServer/{server_id}
	3.2.3 GET localhost:3000/servers/allServersHealth
	3.2.3 GET localhost:3000/servers/serverHistory/{server_id}
	3.2.3 GET localhost:3000/servers/washealthy/13/14/1/2025/15/35   in order server_id/day/month/year/hour/minute
3.3 POST method
	3.2 localhost:3000/servers/        must include name,server_url,type optional username,passowrd,port
	example {
        "name": "milog",
        "server_url": "https://milog.co.il/",
        "type": "https",
	}
3.4 DELETE method
	3.4.1 localhost:3000/servers/{server_id}
						  
