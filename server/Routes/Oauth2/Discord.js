const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const fetch = require('node-fetch');
const { response } = require('express');
const config = require('./configIp');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();
const tok = "OTM3NDMyOTQwODQ0MDUyNTEx.YfbqdQ.8YbxTw_xnAE0h7Z9iZU450NwW9Y";

var user;

const servFromMobileIp = config.servFromMobileIp;
const servFromWebIp = config.servFromWebIp;
const port = config.port;

router.get("/oauth2/authorize", function(req, res) {
    user = req.body.uid;
    const cliend_id = "940639124304584744";
    const scope = "guilds%20email%20identify";
    from = req.query.from;
    const redirect_uri = from == "mobile" ? 
    "http://" + servFromMobileIp + ":" + port + "/discord/oauth2/callback?from=mobile" :
    "http://" + servFromWebIp + ":" + "8081" + "/discord/callback";

    const url = "https://discord.com/oauth2/authorize?client_id=" + cliend_id + "&permissions=8&scope=" + scope + "&response_type=code&redirect_uri=" + redirect_uri;
    // For web
    if (from != "mobile") {
        return res.send({
            message: url
        })
    } 
    // For mobile
    else {
        res.redirect(url);
    }
})

/// GET Discord Callback
/// Mobile auto callback
router.get("/oauth2/callback", async function(req, res) {
    let code = req.query.code;
    let from = req.query.from;

    // Change redirect_uri depends request From Mobile or From Web
    const redirect_uri = from == "mobile" ?
    "http://" + servFromMobileIp + ":" + port + "/discord/oauth2/callback?from=mobile" :
    "http://" + servFromWebIp + ":" + "8081" + "/discord/callback";

    // App Discord Infos
    const CLIENT_ID = '940639124304584744';
    const CLIENT_SECRET = '0g92Fo5k1SI-md-6HSAEbsRM7-YNB1uU';


    let data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code' : code,
        'redirect_uri': redirect_uri,
        'scope':'guilds%20email%identify'
    };
    params = _encode(data);
    const response = await fetch(`https://discordapp.com/api/oauth2/token`, {
        method: 'POST',
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        body: params
    });
    const json = await response.json();
    json.message = "User Successfully connected";
    json.status = 200;
    return res.send(json)
})

function _encode(obj) {
    let string = "";
  
    for (const [key, value] of Object.entries(obj)) {
        if (!value) continue;
        string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return string.substring(1);
}

module.exports = router