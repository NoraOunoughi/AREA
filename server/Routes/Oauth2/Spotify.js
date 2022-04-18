const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const querystring = require('query-string');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const config = require('./configIp');

router.use(cors());

const servFromWebIp = config.servFromWebIp;
const servFromMobileIp = config.servFromMobileIp;
const port = config.port;

/// Server / Web Client Oauth steps:
///     - Client Web have code after authorize when redirect to 'http://' + servFromWebIp + ':' + "8081" + '/spotify/callback' in url query
///     - Client Web send request to Server Callback with Code to get access_token
///
///     - Server need to set redirect url to WebSite /spotify/callback in authorize request
///     ---> With this Client Web can get authorization code Spotify and make request callback with this authorization code
///     - Server need to response to this request GET localhost:8080/spotify/oauth/callback
///     ---> Make request to get access_token from authorization_code and send response access_token to Client Web

router.get('/oauth2/authorize', function(req, res) {
    var from = req.query.from;

    var scope = 'user-read-private user-read-email user-library-modify playlist-modify-private playlist-modify-public user-read-currently-playing user-follow-modify user-follow-read';
    const client_id = "91ae9b4f918d4a65ae6062c1fb067be6";

    // Ici on sait que la personne sur le callback vient du mobile ou du web
    // On peux changer la redirect_uri pour le web
    // Il faut ajouter l'adresse redirect dans les paramètres de l'app
    var redirect_uri = '';
    redirect_uri = from == 'mobile' ?
    'http://' + servFromMobileIp + ':' + port + '/spotify/oauth2/callback?from=mobile'
    : 'http://' + servFromWebIp + ':' + "8081" + '/spotify/callback';

    // For Web
    res.header('Access-Control-Allow-Origin');
    if (from != "mobile") {
        return res.send({
            message: 'https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: client_id,
                    scope: scope,
                    redirect_uri: redirect_uri,
            })
        })
    // For Mobile
    } else {
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
        }));
    }
});

/// GET Spotify Callback
/// Mobile auto callback
router.get('/oauth2/callback', async(req, res) => {
    const code = req.query.code;
    const from = req.query.from;
    console.log(code);

    // Ici on sait que la personne sur le callback vient du mobile ou du web
    // On peux changer la redirect_uri pour le web
    // Il faut ajouter l'adresse redirect dans les paramètres de l'app
    var redirect_uri = '';
    redirect_uri = from == 'mobile' ?
    'http://' + servFromMobileIp + ':' + port + '/spotify/oauth2/callback?from=mobile'
    : 'http://' + servFromWebIp + ':' + "8081" + '/spotify/callback';

    // App Spotify Infos
    const client_id = "91ae9b4f918d4a65ae6062c1fb067be6";
    const client_secret = "bcf2734667264f57b38325fb377059d4";
    const keyy = (client_id + ':' + client_secret).toString('base64');
    console.log(keyy)
    let key = client_id + ':' + client_secret;
    let buff = new Buffer(key);
    let base64data = buff.toString('base64');
    // console.log("this is the key enconding : ", base64data)

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirect_uri,
        },
        headers: {
            'Authorization': 'Basic ' + base64data,
            'Content-type': 'application/x-www-form-urlencoded'
        },
        json: true
    })
    .then(async(response) => {
        response.data.message = "User Successfully connected";
        response.data.status = 200;
        return res.send(response.data)
    })
    .catch((err) => {
        console.log(err)
    })
})

router.get('/oauth2/refresh_token', function(req, res) {
    const client_id = "91ae9b4f918d4a65ae6062c1fb067be6";
    const client_secret = "bcf2734667264f57b38325fb377059d4";
    var refresh_token = req.body.refresh_token;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        },
        params: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }
    })
});

module.exports = router;