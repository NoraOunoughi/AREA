const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();

// const {RunReaction} = require('./Reaction')


// router.get("/repos",  async (req, res) => {
//     // let access_token = await getAccesTokenFromDb(req.body.uid);
//     // if (access_token === null) {
//     //     return res.send({
//     //         message: "No Github accessToken",
//     //         status: 400
//     //     })
//     // }
//     // console.log(Githubtoken);
//     access_token = "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"
//     axios({
//         method: "get",
//         url: 'https://api.github.com/user/repos',
//         headers: {
//             Authorization: `Bearer ${access_token}`
//         }
//     })
//     .then((response) =>{
//         a = response.data
//         return res.send({
//             message: a.length,
//             status:200
//         })
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// router.post("/block", async (req, res) =>{
//     let access_token = await getAccesTokenFromDb(req.body.uid);
//     let username = req.body.username;
//     if (access_token === null) {
//         return res.send({
//             message: "No Github accessToken",
//             status: 400
//         })
//     }
//     console.log(Githubtoken);
//     axios({
//         method: "put",
//         url: `https://api.github.com/user/blocks/${username}`,
//         headers: {
//             Authorization: `Bearer ${access_token}`,
//         }
//     })
//     .then((response) =>{
//         return res.send({
//             message: `Successful Block ${username}`,
//             status:200
//         })
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// router.post("/follow", async (req, res) =>{
//     let access_token = await getAccesTokenFromDb(req.body.uid);
//     let username = req.body.username;
//     if (access_token === null) {
//         return res.send({
//             message: "No Github accessToken",
//             status: 400
//         })
//     }
//     console.log(Githubtoken);
//     axios({
//         method: "put",
//         url: `https://api.github.com/user/following/${username}`,
//         headers: {
//             Authorization: `Bearer ${access_token}`,
//         }
//     })
//     .then((response) =>{
//         return res.send({
//             message: `following ${username} done`,
//             status:200
//         })
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// router.get("/followers", async (req, res) =>{
//     // let access_token = await getAccesTokenFromDb(req.body.uid);
//     // if (access_token === null) {
//     //     return res.send({
//     //         message: "No Github accessToken",
//     //         status: 400
//     //     })
//     // }
//     // console.log(Githubtoken);
//     access_token = "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";
//     axios({
//         method: "get",
//         url: "https://api.github.com/user/followers",
//         headers: {
//             Authorization: `Bearer ${access_token}`,
//         }
//     })
//     .then((response) =>{
//         a = response.data;
//         console.log(a)
//         return res.send({
//             message: a.length,
//             status:200
//         })
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

// router.post("/createrepo", async (req, res) =>{
//     let access_token = await getAccesTokenFromDb(req.body.uid);
//     if (access_token === null) {
//         return res.send({
//             message: "No Github accessToken",
//             status: 400
//         })
//     }
//     console.log(Githubtoken);
//     let _name = req.body.name
//     axios({
//         method: 'POST',
//         url: "https://api.github.com/user/repos",
//         data: JSON.stringify({
//             "name": _name
//         }),
//         headers: {
//             Authorization: `Bearer ${access_token}`,
//         }
//     })
//     .then((response) =>{
//         console.log(response.data)
//         return res.send({
//             message: "repo created",
//             status:200
//         })
//     })
//     .catch((err) => {
//         console.log(err)
//     })
// })

async function Repos(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    if (access_token === null) {
        return false
    }
    console.log(access_token);
    await axios({
        method: "get",
        url: 'https://api.github.com/user/repos',
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })
    .then(async(response) =>{
        a = response.data.length
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

async function Followers(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    if (access_token === null) {
        return false
    }
    console.log(access_token);
    await axios({
        method: "get",
        url: "https://api.github.com/user/followers",
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    .then(async(response) =>{
        a = response.data.length
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
    })
}

async function Block(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    if (access_token === null) {
        return false
    }
    console.log(access_token);
    await axios({
        method: "put",
        url: `https://api.github.com/user/blocks/${AreaObj.data().reactionParams[0]}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    .then((response) =>{
        console.log(response.data)
        return true
    })
    .catch((err) => {
        console.log(err)
    })
}

async function Follow(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    if (access_token === null) {
        return false
    }
    console.log(access_token);
    await axios({
        method: "put",
        url: `https://api.github.com/user/following/${AreaObj.data().reactionParams[0]}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    .catch((err) => {
        console.log(err)
        return false
    })
    return true;
}

async function CreateRepo(AreaObj) {
    let access_token = await getAccesTokenFromDb(AreaObj.data().uid);
    if (access_token === null) {
        return false
    }
    console.log(access_token);
    await axios({
        method: 'POST',
        url: "https://api.github.com/user/repos",
        data: JSON.stringify({
            "name": AreaObj.data().reactionParams[0]
        }),
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    .catch((err) => {
        console.log(err)
        return false
    })
    return true;
}

async function getAccesTokenFromDb(uidReq) {
    const usersRef = db.collection('users').doc(uidReq);
    const doc = await usersRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return null;
    }
    var accesTokenGithub = doc.data().githubToken;
    if (accesTokenGithub === null || accesTokenGithub === undefined) {
      console.log('No github token!');
      return null;
    }
    return accesTokenGithub;
}

module.exports = {
    Block : Block,
    Follow : Follow,
    Followers : Followers,
    CreateRepo : CreateRepo,
    Repos : Repos,
    router: router
}

const {RunReaction} = require('./Reaction')