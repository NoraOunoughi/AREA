const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());
const db = getFirestore();

router.post('/addArea', (req, res) => {
    const userid = req.body.uid;
    const nameofArea = req.body.nameArea;
    const serviceaction = req.body.serviceaction;
    const action = req.body.action;
    const argaction = req.body.argaction;
    const changevalue = req.body.changevalue;
    const servicereaction = req.body.servicereaction;
    const reaction = req.body.reaction;
    const argreaction1 = req.body.argreaction1;
    const argreaction2 = req.body.argreaction2;
    const argreaction3 = req.body.argreaction3;

    //Remplir structure db à partir de uid
})

router.post('/delArea', (req, res) => {
    const user = req.body.uid;
    const nameofArea = req.body.nameArea;

    //Appel DB, supp l'object Area avec le nom nameofArea du user(uid)
})

router.post('/modifArea', (req, res) => {
    const userid = req.body.uid;
    const nameofArea = req.body.nameArea;
    const serviceaction = req.body.servicereaction;
    const reaction = req.body.reaction;
    const argreaction1 = req.body.argreaction1;
    const argreaction2 = req.body.argreaction2;
    const argreaction3 = req.body.argreaction3;

    //Appel DB pour modif l'area nameofArea avec userId
})