const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors');
const axios = require('axios');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');
require("dotenv").config();

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

var port =8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const github = require('./Routes/Oauth2/Github');
// const githubService = require('./Routes/Github');
const spotify = require('./Routes/Oauth2/Spotify');
// const spotifyService = require('./Routes/Spotify');
// const weather = require('./Routes/Weather');
// const sg = require('./Routes/SG');
const discord = require('./Routes/Oauth2/Discord');
// const discordService = require('./Routes/Discord');
const dbRoutes = require('./Routes/Db');
const google = require('./Routes/Oauth2/Google')
// const gmail = require('./Routes/Gmail');
// const youtube = require('./Routes/Youtube');
const engine = require('./Routes/Engine');

app.use('/github', github);
app.use('/google', google)
// app.use('/services/github', githubService.router);
app.use('/spotify', spotify);
// app.use('/services/spotify', spotifyService.router);
// app.use('/weather', weather.router);
// app.use('/sg', sg);
app.use('/discord', discord);
// app.use('/services/discord', discordService.router);
app.use('/db', dbRoutes);
// app.use('/gmail', gmail.router);
// app.use('/youtube', youtube.router);

setInterval(function () { engine.Engine() }, 10000);
// To get req.ip
app.set('trust proxy', true);
// To set indentation in json res
app.set('json spaces', 4);

app.use("/about.json", (req, res) => {
  // Faut bien mettre ./about.json pour le chemin du fichier
  // Si ça lance pas en local (npm start) / Il faut copier B-YEP-area-noe/about.json dans B-YEP-area-noe/server/about.json
  // Si on met ../about.json ===> Docker ERROR
  var aboutJsonFile = require('./about.json');
  var clientIp = req.ip.toString();
  var currentTime = Date.now();

  aboutJsonFile.server.current_time = currentTime;
  console.log("Request at current_time: " + currentTime);

  // req.ip == "::1" if you are using Ipv4 localhost or 127.0.0.1
  if (clientIp == "::1")
    clientIp = "127.0.0.1";
  aboutJsonFile.client.host = clientIp;
  console.log("Request from client Ip: " + clientIp);
  
  res.setHeader('Content-Type', 'application/json');
  res.send(aboutJsonFile);
})

app.listen(port, () => {
    console.log('server listen on port :',port);
});