const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const querystring = require('query-string');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const config = require('./configIp');

router.use(cors());

const db = getFirestore();
var user;

const addr_ip = config.addr_ip;
const servFromWebIp = config.servFromWebIp;
const servFromMobileIp = config.servFromMobileIp;
const port = config.port;

router.get('/oauth2/authorize', function(req, res) {
    var redirect_uri = '';
    user = req.body.uid
    const from = req.query.from;
    const clientId = from == "mobile" ?
        "0ff8d62e7f0a2457ce40" :
        "e993b956dd88f9b64d8a";
    var scope = 'repo,user';
    redirect_uri = from == 'mobile' ?
    'http://' + servFromMobileIp + ':' + port + '/github/oauth2/callback?from=mobile'
    : 'http://' + servFromWebIp + ':' + "8081" + '/github/callback';
    res.header('Access-Control-Allow-Origin');
    if (from != "mobile") {
        return res.send({
            message: 'https://github.com/login/oauth/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: clientId,
                    scope: scope,
                    redirect_uri: redirect_uri,

            })
        })
    } else {
        res.redirect('https://github.com/login/oauth/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirect_uri,

        }));
    }
})

router.get('/oauth2/callback', async(req, res) => {
    const code = req.query.code;
    console.log("----" + code);
    const from = req.query.from;
    const clientID = from == "mobile" ?
        "0ff8d62e7f0a2457ce40" :
        "e993b956dd88f9b64d8a";
    const clientSecret = from == "mobile" ?
    "e80e631c875e0b796895f7f6e37459a27c221253" :
    "b766ff31fe49599ba3f1c9e85c0f17e44a73f891";
    var redirect_uri = '';
    redirect_uri = from == 'mobile' ?
    'http://' + servFromMobileIp + ':' + port + '/github/oauth2/callback?from=mobile'
    : 'http://' + servFromWebIp + ':' + "8081" + '/github/callback';


    axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?client_id=' + clientID + '&client_secret=' + clientSecret + '&code=' + code,
        params: {
            redirect_uri: redirect_uri,
        },
        headers: {
            accept: 'application/json'
        },
    }).then(async(response) => {
        response.data.message = "User Successfully connected";
        response.data.status = 200;
        return res.send(response.data)
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;