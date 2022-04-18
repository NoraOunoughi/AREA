const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const fetch = require('node-fetch');
const { response } = require('express');
const config = require('./configIp');

router.use(cors());

const addr_ip = config.addr_ip;
const port = config.port;

router.get("/oauth2/authorize", (req, res) => {
    //const uid = req.body.uid;
    
    const client_id = "3013962676295.3071880761889";
    res.redirect("https://slack.com/oauth/v2/authorize?scope=&amp;user_scope=chat%3Awrite%3Auser%2Cidentify%2Cstars%3Aread&amp;redirect_uri=http://" + addr_ip + ":" + port + "/slack/oauth2/callback&amp;client_id=3013962676295.3071880761889")
})

router.get("/oauth2/callback", (req, res) =>{
    const code = req.query.code;
    const client_id = "3013962676295.3071880761889";
    const client_secret = "9b8e3bb0618fda2de613891f783dd831";

    const oauthUrl = 'https://slack.com/api/oauth.access?' +
    'client_id=' + client_id + '&' +
    'client_secret=' + client_secret + '&' +
    'code=' + code;

    axios(oauthUrl, {
        method: 'post',
        headers: {
            accept:"application/json"
        }
    })
    .then((response) => {
        const access_token = response.data.access_token;
        return res.send({
            message: access_token,
            status:200
        })
    })
    .catch((err) =>{console.log(err)})
})

module.exports = router