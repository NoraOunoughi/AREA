const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());
const db = getFirestore();

// const {Repos, Followers} = require("./Github");
// const { Mail } = require("./Gmail");
// const  {Artists} = require("./Spotify");
// const {Servers} = require("./Discord");
// const {UvIndex, Temperature, Weather} = require("./Weather");
// const {Channels} = require("./Youtube")

const weather = require('./Weather')
const gmail = require('./Gmail')
const github = require('./Github')
const spotify = require('./Spotify')
const discord = require('./Discord')
const youtube = require('./Youtube')

var array_action_name = ["UvIndex", "Temperature", "Weather", "Repos", "Followers", "Artists", "Mails", "Channels", "Playlist", "Servers"];

var array_of_functions_action = [
    function (AreaObj) { weather.UvIndex(AreaObj) },
    function (AreaObj) { weather.Temperature(AreaObj) },
    function (AreaObj) { weather.Weather(AreaObj) },
    function (AreaObj) { github.Repos(AreaObj) },
    function (AreaObj) { github.Followers(AreaObj)},
    function (AreaObj) {spotify.Artists(AreaObj)},
    function (AreaObj) {gmail.Mail(AreaObj)},
    function (AreaObj) {youtube.Channels(AreaObj)},
    function (AreaObj) {youtube.Playlist(AreaObj)},
    function (AreaObj) {discord.Servers(AreaObj)}
]

async function CheckAction(AreaObj) {
    console.log("START CheckAction");
    console.log(AreaObj.data().action)
    if (AreaObj.data().action == "Weather") {
        console.log("Detecte bien")
    }
    for (i = 0; i < array_of_functions_action.length; i++) {
        if (array_action_name[i] == AreaObj.data().action) {
            await array_of_functions_action[i](AreaObj);
        }
    }
    return false;
}

module.exports = {
    CheckAction : CheckAction
}