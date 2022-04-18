const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());
const db = getFirestore();

// const reaction = require('./Reaction')

// router.post("/createplaylist", async (req, res) => {
//     let access_token = await getAccesTokenFromDb(req.body.uid);
//     const playlistname = req.body.name
//     if (access_token === null) {
//         return res.send({
//             message: "No Github accessToken",
//             status: 400
//         })
//     }
//     axios({
//         method: 'POST',
//         url: "https://api.spotify.com/v1/me/playlists",
//         data: JSON.stringify({
//             "name": playlistname
//         }),
//         headers: {
//             Authorization: (`Bearer ${token}`),
//             'Content-type': 'application/json'
//         }
//     })
//     .then((response) => {
//         return res.send({
//             message: "Playlist created",
//             status:200
//         })
//     })
//     .catch((err) => console.log(err))
// })

// router.get("/following", async (req, res) => {
//     // let access_token = await getAccesTokenFromDb(req.body.uid);
//     // if (access_token === null) {
//     //     return res.send({
//     //         message: "No Github accessToken",
//     //         status: 400
//     //     })
//     // }
//     access_token = "BQBBoyXrpK8-amMRjZgm4ryHf_YCxOgflwCjwadmUUR3nLBySHCA4AQkm4nBDBhhaz2B0K8dRhg3FVHJ3AQ7q3nBbz6XANiQj3c_sK0n4lurwDyx5TTzuNsfhi0IETeia8ZOyoScHDfO0OnuSC5FdDJCuxHSnvRR4QpFQUd1FOGAfZWYKtUwRybhOaV4r2IpimDkQl8KmSAEZSvAkBlAEAG8n2_xIqIn9SzgjxlhHbWR6YEmftMLC9FJCcSxqHXltU0ShA"
//     axios({
//         method: 'GET',
//         url: "https://api.spotify.com/v1/me/following?type=artist",
//         headers: {
//             Authorization: (`Bearer ${access_token}`),
//             'Content-type': 'application/json'
//         }
//     })
//     .then((response) => {
//         const a = response.data.artists.items
//         const b = a.length
//         const size = "9"
//         if (size == b.toString())
//             console.log("pas besoin soString")
//         console.log(a.length)
//         return res.send({
//             message: response.data,
//             status:200
//         })
//     })
//     .catch((err) => console.log(err))
// })

async function Artists(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    if (access_token === null) {
        return false
    }
    await axios({
        method: 'GET',
        url: "https://api.spotify.com/v1/me/following?type=artist",
        headers: {
            Authorization: (`Bearer ${access_token}`),
            'Content-type': 'application/json'
        }
    })
    .then(async(response) => {
        let a = response.data.artists.items
        let size = a.length
        //console.log(a)
        if (AreaObj.data().checkValue == undefined) {
            //Faire changement dans db
            const docRef = db.collection('areas').doc(AreaObj.id)
            await docRef.update({
                checkValue: size.toString()
            });
            return true
        }
        if (AreaObj.data().checkValue != size.toString()) {
            const docRef = db.collection('areas').doc(AreaObj.id)
            await docRef.update({
                checkValue: size.toString()
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

async function CreatePlaylist(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    const playlistname = AreaObj.data().reactionParams[0];
    console.log(playlistname)
    await axios({
        method: 'POST',
        url: "https://api.spotify.com/v1/me/playlists",
        data: JSON.stringify({
            "name": playlistname
        }),
        headers: {
            Authorization: (`Bearer ${access_token}`),
            'Content-type': 'application/json'
        }
    })
    .then((response) => {
        //console.log(response.data)
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
    var accesTokenSpotify = doc.data().spotifyToken;
    if (accesTokenSpotify === null || accesTokenSpotify === undefined) {
      console.log('No Spotify token!');
      return null;
    }
    return accesTokenSpotify;
}

module.exports = {
    CreatePlaylist : CreatePlaylist,
    Artists : Artists,
    router: router
};

const {RunReaction} = require('./Reaction')