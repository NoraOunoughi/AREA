const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();
const tok = "OTQwNjM5MTI0MzA0NTg0NzQ0.YgKUcw.gDfo0k8sW1P08NBhApikvJIqD-8";

// const {RunReaction} = require('./Reaction')

// router.get("/servers", async(req, res) => {
//     //const token = await getAccesTokenFromDb(req.body.uid)
//     token = "6XQu5xChZ5Fa8LRhJaDeEvif9EIEG6"
//     axios({
//         method: 'get',
//         url: "https://discordapp.com/api/users/@me/guilds",
//         headers: {
//             Authorization: (`Bearer ${token}`)
//         }
//     })
//     .then((response) => {
//         let changeValue = response.data.length;
//         console.log(changeValue)
//         //checkValue in db, if not exist : ajoute, if exist : compare and modify
//         //call runReaction.
//         return res.send(response.data)
//     })
// })

// router.get("/user", (req, res) => {
//     const username = req.body.username;
//     axios({
//         method: 'patch',
//         url: "https://discordapp.com/api/users/@me",
//         data: {
//             username: username
//         },
//         headers: {
//             Authorization: (`Bot ${tok}`)
//         }
//     })
//     .then((response) => {
//         return res.send(response.data)
//     })
// })

async function Servers(AreaObj){
    const token = await getAccesTokenFromDb(AreaObj.data().uid)
    await axios({
        method: 'get',
        url: "https://discordapp.com/api/users/@me/guilds",
        headers: {
            Authorization: (`Bearer ${token}`)
        }
    })
    .then(async(response) => {
        a = response.data.length
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
    }).catch((err) => console.log(err))
    return false;
}

async function ChangeUsername(AreaObj) {
    //const token = await getAccesTokenFromDb(AreaObj.data().uid)
    //const username = AreaObj.data().reactionParams[0]
    await axios({
        method: 'patch',
        url: "https://discordapp.com/api/users/@me",
        data: {
            username: AreaObj.data().reactionParams[0].toString()
        },
        headers: {
            Authorization: (`Bot ${tok}`),
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        //console.log(response)
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
    var accesTokenDiscord = doc.data().discordToken;
    if (accesTokenDiscord === null || accesTokenDiscord === undefined) {
      console.log('No discord token!');
      return null;
    }
    return accesTokenDiscord;
}

module.exports = {
    Servers : Servers,
    ChangeUsername : ChangeUsername,
    router: router
};

const {RunReaction} = require('./Reaction')