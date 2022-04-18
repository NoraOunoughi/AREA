const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const { response } = require('express');
const querystring = require('query-string');

router.use(cors());

router.get('/authorize', function(req, res) {
    var scope = 'user-read-private user-read-email user-library-modify playlist-modify-private playlist-modify-public user-read-currently-playing user-follow-modify user-follow-read';
    const client_id = "1a89e0dae1ea420b8a3b93fa448f6a86";

    var redirect_uri = 'http://localhost:8080/spotify/callback';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
    }));
});

router.get('/callback', async(req, res) => {
    const code = req.query.code;
    console.log(code);


    var redirect_uri = 'http://localhost:8080/spotify/callback';

    const client_id = "1a89e0dae1ea420b8a3b93fa448f6a86";
    const client_secret = "d64ec05940f14188b896b4c3f436d1d4";
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

router.get("/createplaylist", async (req, res) => {
    //Pour tester avec le front, change la requête en post, décommente playlistname = req.body.name et commente playlsitname = "Test Area"
    //const playlistname = req.body.name
    const playlistname = "Test Area"
    //Pour token, tu devrais le récuperer de la db, mais la pour tester je l'ai mis en brut.
    const token = "BQDp7rYzp-VIguIHUfeKGaI62vYuG5zhkC6aogubmjPQHjaeZ1n8CEruN_reE-3HGuWxpoonWPwmIPUyHNlrpvPrOyRTXqhXfOXyWNFzC-RnMJCVMWd5fFxt_b_hqpE1ZV4Fdw1-d3RaxJmF6bJ0wF9hiGi43kVEKye9J3xptlcbY66wdqoRHWJriQ_4VYlfgSuD7bCXEy9vXCcNCuhPcBiNLAUOKMtPGxPdjGTBcEGvqQzHjQBb6_HrVJLg7jB4jBqGZA"
    axios({
        method: 'POST',
        url: "https://api.spotify.com/v1/me/playlists",
        data: JSON.stringify({
            "name": playlistname
        }),
        headers: {
            Authorization: (`Bearer ${token}`),
            'Content-type': 'application/json'
        }
    })
    .then((response) => {
        return res.send({
            message: "Playlist created",
            status:200
        })
    })
    .catch((err) => console.log(err))
})

router.get("/following", async (req, res) => {
    //let access_token = await getAccesTokenFromDb(req.body.uid);
    // if (access_token === null) {
    //     return res.send({
    //         message: "No Github accessToken",
    //         status: 400
    //     })
    // }
    const token = "BQDp7rYzp-VIguIHUfeKGaI62vYuG5zhkC6aogubmjPQHjaeZ1n8CEruN_reE-3HGuWxpoonWPwmIPUyHNlrpvPrOyRTXqhXfOXyWNFzC-RnMJCVMWd5fFxt_b_hqpE1ZV4Fdw1-d3RaxJmF6bJ0wF9hiGi43kVEKye9J3xptlcbY66wdqoRHWJriQ_4VYlfgSuD7bCXEy9vXCcNCuhPcBiNLAUOKMtPGxPdjGTBcEGvqQzHjQBb6_HrVJLg7jB4jBqGZA"
    axios({
        method: 'GET',
        url: "https://api.spotify.com/v1/me/following?type=artist",
        headers: {
            Authorization: (`Bearer ${token}`),
            'Content-type': 'application/json'
        }
    })
    .then((response) => {
        let a = response.data.artists.total
        console.log(a.length)
        return res.send({
            message: response.data.artists.total,
            status:200
        })
    })
    .catch((err) => console.log(err))
})

module.exports = router