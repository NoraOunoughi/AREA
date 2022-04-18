// const GMAIL_API_KEY = "AIzaSyA-6jkiqPkaEtQaN9GJFKFiRwDZhrUbvF4"; // TO MODIFY and immport from DB
// const fetch = require("node-fetch")

// async function SendMail() {
//     const url = `gmail/v1/users/me/messages/send?key=${GMAIL_API_KEY}`;
//     let response = await fetch(url, {
//         method: "POST",
//         headers: {
//             // To COMPLETE with message/email adress of receiver and object
//         }
//     })
//     let body = await response.text();
// //     body = JSON.parse(body)
// //     console.log(body)
// }
// SendMail()

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const btoa = require('btoa');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();


// router.get("/getmail", async (req, res) =>{
//     //const token = await getAccesTokenFromDb(req.body.uid)
//     const token = "ya29.A0ARrdaM9zWHPwhXv2PMBoI_6O3Bf_t9LvCDpqzOIZj4OBlwwiB7R0SvYcvdXPZioYbHOUyGqGND4uBUborOnILuXMbCa1t57FPvn0qkBsqHnHSoE7X7M1kuZ2sKOmNVOqTWX3eNZYaA5pHESB8MO7cLVc8-fV"
//     axios({
//         method: 'get',
//         url: "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=500",
//         headers: {
//             Authorization: (`Bearer ${token}`),
//             accept: 'application/json'
//         }
//     })
//     .then((response) => {
//         let a = response.data.resultSizeEstimate
//         // if (AreaObj.changeValue == "") {
//         //     //Faire changement dans db
//         // }
//         // if (AreaObj.changeValue != a) {
//         //     //call RunReaction(AreaObj)
//         // }
//         // return true
//         console.log(response.data.messages.length)
//         return res.send(response.data)
//     })
//     .catch((err) => {
//         console.log(err)
//         return false
//     })
// })

// router.post("/sendmail", async (req, res) => {
//     const token = await getAccesTokenFromDb(req.body.uid)
//     const recipient = req.body.mail
//     const message = req.body.content
//     const subject = req.body.subject
//     const mail = `From: <me@gmail.com>\nTo: <${recipient}>\nSubject: ${subject}\n\n${message}`;
//     let buff = new Buffer(mail);
//     let base64data = buff.toString('base64');
//     axios({
//         method: 'post',
//         url: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
//         headers: {
//             Authorization: (`Bearer ${token}`),
//             accept: 'application/json'
//         },
//         data: {
//             "raw": base64data
//         }
//     })
//     .then((response) => {
//         return res.send(response.data)
//     })
// })

// const {RunReaction} = require('./Reaction')


async function Mail(AreaObj) {
    const token = await getAccesTokenFromDb(AreaObj.data().uid)
    await axios({
        method: 'get',
        url: "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=500",
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        }
    })
    .then(async(response) => {
        let a = response.data.resultSizeEstimate
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
            console.log("in it")
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

async function SendMail(AreaObj) {
    const token = await getAccesTokenFromDb(AreaObj.data().uid)
    const recipient = AreaObj.data().reactionParams[0]
    const message = AreaObj.data().reactionParams[1]
    const subject = AreaObj.data().reactionParams[2]
    const mail = `From: <me@gmail.com>\nTo: <${recipient}>\nSubject: ${subject}\n\n${message}`;
    let buff = new Buffer(mail);
    let base64data = buff.toString('base64');
    await axios({
        method: 'post',
        url: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        },
        data: {
            "raw": base64data
        }
    })
    .then((response) => {
        console.log(response)
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
    SendMail : SendMail,
    Mail : Mail,
    router: router
}

const {RunReaction} = require('./Reaction')