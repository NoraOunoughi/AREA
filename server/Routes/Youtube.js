// const express = require("express");
// const axios = require("axios");
// const { google } = require("googleapis");

// const app = express();
// const apiKey = "AIzaSyAbJU9IwjCn1WQoivyHJD6ZXMVwr5Jw7fs";
// const youtube = google.youtube({
//   version: "v3",
//   auth: apiKey,
// });

// app.get("/", (req, res) => {
//   res.send(apiKey);
// });


// app.get("/search", async (req, res, next) => {
//   try {
//     const query = req.query.search_query;
//     const response = await youtube.search.list({
//       part: "snippet",
//       q: query,
//     });

//     const titles = response.data.items.map((item) => item.snippet.title);
//     res.send(titles);
//   } catch (err) {
//     next(err);
//   }
// });

//  function getAuthorizationPageUrl() {
//   const oauth2Client = new google.auth.OAuth2(
//     "741113046252-q7l9t7mc2q8ta5p49f6j2cuhmlsuvp93.apps.googleusercontent.com",
//     "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",
//     "http://localhost:3000"
//   );

//   // generate a url that asks permissions for Blogger and Google Calendar scopes
//   const scopes = [
//     'https://www.googleapis.com/auth/calendar'
//   ];

//   const url = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: 'offline',

//     // If you only need one scope you can pass it as a string
//     scope: scopes
//   });
//   //console.log(url)
//   return url
  
// }

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const querystring = require('query-string');

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();

// const {RunReaction} = require('./Reaction')

// router.get("/getchannels", async (req, res) =>{
//   const token = await getAccesTokenFromDb(req.body.uid)
//   axios({
//       method: 'get',
//       url: "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true",
//       headers: {
//           Authorization: (`Bearer ${token}`),
//           accept: 'application/json'
//       },
//   })
//   .then((response) => {
//       let nb = response.data.pageInfo.totalResults;
//       console.log(nb)
//       return res.send(response.data)
//   })
// })

// router.get('/idchannel', async(req, res) => {
//   const token = await getAccesTokenFromDb(req.body.uid)
//   const channelname = req.body.channel
//   axios({
//       method: 'get',
//       url: `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${channelname}`,
//       headers: {
//           Authorization: (`Bearer ${token}`),
//           accept: 'application/json'
//       },
//   })
//   .then((response) => {
//       return response.data.items[0].id
//   })
// })

// router.post("/unsubscribe", async (req, res) =>{
//   const token = await getAccesTokenFromDb(req.body.uid)
//   const id = req.body.id;
//   axios({
//       method: 'delete',
//       url: "https://www.googleapis.com/youtube/v3/subscriptions",
//       data: {
//           id: id
//       },
//       headers: {
//           Authorization: (`Bearer ${token}`),
//           accept: 'application/json'
//       },
//   })
//   .then((response) => {
//       //let nb = response.data.pageInfo.totalResults;
//       //console.log(nb)
//       return res.send(response.data)
//   })
// })

// router.get("/playlist", (req, res) => {
//   const token = "ya29.A0ARrdaM96Qjh2IOYdhK8CMJr7G3k4E7HB9Jd7F7cqkwB-uHwzZIf7o-pybdjhZscOvhBpdDkzEw-LX6mumeLCWBcDgU22raiyVomh7SIbDs3R44zvyHWqbmmw0oMZs1jMmX9VGGkaJmU5jdSj5r8PmGoTfRru"
//   axios({
//     method: "get",
//     url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true",
//     headers: {
//       Authorization: (`Bearer ${token}`),
//       accept: 'application/json'
//     },
//   })
//   .then((response) => {
//     return res.send(response.data)
//   })
// })

async function Channels(AreaObj) {
  const token = await getAccesTokenFromDb(AreaObj.data().uid)
  await axios({
      method: 'get',
      url: "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true",
      headers: {
          Authorization: (`Bearer ${token}`),
          accept: 'application/json'
      },
  })
  .then(async(response) => {
      let a = response.data.pageInfo.totalResults;
      console.log(a)
      if (AreaObj.data().checkValue == undefined) {
        //Faire changement dans db
        const docRef = db.collection('areas').doc(AreaObj.id)
        await docRef.update({
            checkValue: a
        });
        return true
    }
    if (AreaObj.data().checkValue != a) {
        const docRef = db.collection('areas').doc(AreaObj.id)
        await docRef.update({
            checkValue: a
        });
        RunReaction(AreaObj)
    }
    return true
  })
  .catch((err) => {
    console.log(err)
    return false
  })
}

async function Playlist(AreaObj) {
  const token = await getAccesTokenFromDb(AreaObj.data().uid)
  await axios({
      method: 'get',
      url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true",
      headers: {
          Authorization: (`Bearer ${token}`),
          accept: 'application/json'
      },
  })
  .then(async(response) => {
      let a = response.data.pageInfo.totalResults;
      console.log(a)
      if (AreaObj.data().checkValue == undefined) {
        //Faire changement dans db
        const docRef = db.collection('areas').doc(AreaObj.id)
        await docRef.update({
            checkValue: a
        });
        return true
    }
    if (AreaObj.data().checkValue != a) {
        const docRef = db.collection('areas').doc(AreaObj.id)
        await docRef.update({
            checkValue: a
        });
        RunReaction(AreaObj)
    }
    return true
  })
  .catch((err) => {
    console.log(err)
    return false
  })
}

async function getAccesTokenFromDb(uidReq) {
  const usersRef = db.collection('users').doc(uidReq);
  const doc = await usersRef.get();
  if (!doc.exists) {
    console.log('No such document!');
    return null;
  }
  var accesTokenGoogle = doc.data().googleToken;
  if (accesTokenGoogle === null || accesTokenGoogle === undefined) {
    console.log('No google token!');
    return null;
  }
  return accesTokenGoogle;
}

module.exports = {
  Channels : Channels,
  Playlist : Playlist,
  router : router
}

const {RunReaction} = require('./Reaction')