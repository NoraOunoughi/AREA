const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());
const db = getFirestore();

// const {Block, Follow, CreateRepo} = require("./Github");
// const {AutomatedEmail} = require("./SG");
// const {SendMail} = require("./Gmail");
// const {CreatePlaylist} = require("./Spotify");
// const {ChangeUsername} = require("./Discord");

var array_reaction_name = ["AutomatedEmail", "SendMail", "CreatePlaylist", "ChangeUsername", "Block", "Follow", "CreateRepo"];

var array_of_functions = [
    function (AreaObj) { AutomatedEmail(AreaObj) },
    function (AreaObj) { SendMail(AreaObj) },
    function (AreaObj) { CreatePlaylist(AreaObj) },
    function (AreaObj) { ChangeUsername(AreaObj) },
    function (AreaObj) { Block(AreaObj)},
    function (AreaObj) {Follow(AreaObj)},
    function (AreaObj) {CreateRepo(AreaObj)}
]

async function RunReaction(AreaObj) {
    console.log("START RunReaction");

    console.log("AreaObj.reaction:", AreaObj.data().reaction);
    for (i = 0; i < array_reaction_name.length; i++) {
        if (array_reaction_name[i] == AreaObj.data().reaction) {
            await array_of_functions[i](AreaObj);
        }
    }
    return true;
}

module.exports = {
    RunReaction : RunReaction
};

const {Block, Follow, CreateRepo} = require("./Github");
const {AutomatedEmail} = require("./SG");
const {SendMail} = require("./Gmail");
const {CreatePlaylist} = require("./Spotify");
const {ChangeUsername} = require("./Discord");