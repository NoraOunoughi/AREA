const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const querystring = require('query-string');
const { response } = require('express');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const config = require('./configIp');

// Config
const servFromWebIp = config.servFromWebIp;
const servFromMobileIp = config.servFromMobileIp;
const port = config.port;

// scope=email&
//  access_type=online&
//  redirect_uri=<URL_REDIRECTION>&
//  response_type=code&
//  client_id=<CLIENT_ID></CLIENT_ID>

router.get('/oauth2/authorize', (req, res) => {
    const scope = "https://mail.google.com/ https://www.googleapis.com/auth/youtube";
    const clientId = "";
    var from = req.query.from;

    var redirect_uri = from == 'mobile' ?
    'http://' + servFromWebIp + ':' + port + '/google/oauth2/callback?from=mobile'
    : 'http://' + servFromWebIp + ':' + "8081" + '/google/callback';

    // For Web
    res.header('Access-Control-Allow-Origin');
    if (from != "mobile") {
        return res.send({
            message: 'https://accounts.google.com/o/oauth2/auth?' +
                querystring.stringify({
                    access_type: 'online',
                    response_type: 'code',
                    client_id: clientId,
                    scope: scope,
                    redirect_uri: redirect_uri,
            })
        })
    // For Mobile
    } else {
        res.redirect('https://accounts.google.com/o/oauth2/auth?' +
            querystring.stringify({
                access_type: 'online',
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirect_uri,
        }));
    }
})

router.get('/oauth2/callback', async (req, res) => {
    const code = req.query.code;
    const from = req.query.from;
    console.log("----" + code);
    const Redirect_URI = from == 'mobile' ?
        'http://' + servFromWebIp + ':' + port + '/google/oauth2/callback?from=mobile'
        : 'http://' + servFromWebIp + ':' + "8081" + '/google/callback';

    axios({
        method: 'post',
        url: "https://oauth2.googleapis.com/token",
        data: {
            grant_type:'authorization_code',
            code:code,
            redirect_uri:Redirect_URI,
            client_id:clientID,
            client_secret:clientSecret
        },
        headers: {
            accept: 'application/x-www-form-urlencoded'
        }
    }).then((response) => {
        const accessToken = response.data.access_token;
        console.log("--- access ->" + accessToken);
        response.data.status = 200;
        return res.send(response.data)
    }).catch((error) => console.log(error));

});

module.exports = router;
