const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());
const db = getFirestore();

const {CheckAction} = require('./Actions')

// const docRef = db.collection('users').doc(user);
//             await docRef.update({
//                 spotifyToken: token,
//             });

// async function test(AreaObj){
//     value = AreaObj.data().actionParams;
//     console.log(value)
//     console.log(AreaObj.id)
//     if (value == "Paris") {
//         console.log("in function")
//         const docRef = db.collection('areas').doc(AreaObj.id)
//         await docRef.update({
//             actionParams: "Madrid"
//         });
//     }
//     checkValue = AreaObj.data().checkValue;
//     if (checkValue == undefined) {
//         console.log("in function checkValue")
//         const docRef = db.collection('areas').doc(AreaObj.id)
//         await docRef.update({
//             checkValue: "3"
//         });
//     }
//     return true
// }

async function Engine() {
    // const usersRef = await db.collection('areas').get();
    // console.log(usersRef)
    await db.collection("areas").get().then(function(querySnapshot) {
        querySnapshot.forEach(async function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            await CheckAction(doc)
            // test(doc)
            // console.log(doc.id, " => ", doc.data());
        });
    });
}

module.exports = {
    Engine : Engine
}