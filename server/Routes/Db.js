const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());
const db = getFirestore();

router.post("/savedb", async(req, res) => {
    let user = req.body.uid;
    let service = req.body.service;
    let token = req.body.access_token;
    // Pas possible de donner en param le nom du champs
    // Champs était tout le temps = service
    // Dans bdd c'était pas spotifyToken=... mais service=...
    // Pareil pour githubToken=... cétait sercice=...
    // obligé de spécifié comme ça
    if (service == "spotify") {
        const docRef = db.collection('users').doc(user);
            await docRef.update({
                spotifyToken: token,
            });
        return res.send({
            message: "Successfully saved in DB",
            status: 200
        })
    } else if (service == "github") {
        const docRef = db.collection('users').doc(user);
            await docRef.update({
                githubToken: token,
            });
        return res.send({
            message: "Successfully saved in DB",
            status: 200
        })
    } else if (service == "discord") {
        const docRef = db.collection('users').doc(user);
            await docRef.update({
                discordToken: token,
            });
        return res.send({
            message: "Successfully saved in DB",
            status: 200
        })
    } else if (service == "google") {
        const docRef = db.collection('users').doc(user);
        await docRef.update({
            googleToken: token,
        });
        return res.send({
            message: "Successfully saved in DB",
            status: 200
        })
    }
})

module.exports = router;