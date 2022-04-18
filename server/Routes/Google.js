const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
const btoa = require('btoa');
const { response } = require('express');
const querystring = require('query-string');

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();

const token = "ya29.A0ARrdaM-Hq1FwULknHq9xpb87eUdtA0fXz_zSUpG3td2HVN0WxcORMRn3cn4uPsURxMwAdObTNIzA2JW8B1twLRlWf4HRsi3Fr_-01SDE6ds7xaLxYx70QHZEd9lsai5a33LWwO0-hvyXtCjwbjyYooU4Crlg"

router.get("/getchannels", async (req, res) =>{
    //const token = await getAccesTokenFromDb(req.body.uid)
    axios({
        method: 'get',
        url: "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true",
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        },
    })
    .then((response) => {
        let nb = response.data.pageInfo.totalResults;
        console.log(nb)
        return res.send(response.data)
    })
})

// function getChannelId(channelname) {
//     const channelname = 'aMOODIEsqueezie'
//     axios({
//         method: 'get',
//         url: `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${channelname}`,
//         headers: {
//             Authorization: (`Bearer ${token}`),
//             accept: 'application/json'
//         },
//     })
//     .then((response) => {
//         return response.data.items[0].id
//     })
// }

router.get('/idchannel', (req, res) => {
    const channelname = 'aMOODIEsqueezie'
    axios({
        method: 'get',
        url: `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forUsername=${channelname}`,
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        },
    })
    .then((response) => {
        return response.data.items[0].id
    })
})

router.get("/unsubscribe", async (req, res) =>{
    //const token = await getAccesTokenFromDb(req.body.uid)
    const channelid = 'UCZ8TREbPfawhSvayVe5pqKg'
    axios({
        method: 'delete',
        url: "https://www.googleapis.com/youtube/v3/subscriptions",
        data: {
            id: 'UCZ8TREbPfawhSvayVe5pqKg'
        },
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        },
    })
    .then((response) => {
        //let nb = response.data.pageInfo.totalResults;
        //console.log(nb)
        return res.send(response.data)
    })
})

router.get("/sendmail", async (req, res) => {
    const token = await getAccesTokenFromDb(req.body.uid)
    const recipient = req.body.mail
    const message = req.body.content
    const subject = req.body.subject
    const mail = `From: <me@gmail.com>\nTo: <${recipient}>\nSubject: ${subject}\n\n${message}`;
    let buff = new Buffer(mail);
    let base64data = buff.toString('base64');
    axios({
        method: 'post',
        url: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        },
        data: {
            "raw": base64data
        }
    })
    .then((response) => {
        return res.send(response.data)
    })
})

async function getAccesTokenFromDb(uidReq) {
    const usersRef = db.collection('users').doc(uidReq);
    const doc = await usersRef.get();
    if (!doc.exists) {
      console.log('No such document!');
      return null;
    }
    var accesTokenGoogle = doc.data().googleToken;
    if (accesTokenGoogle === null || accesTokenGoogle === undefined) {
      console.log('No google token!');
      return null;
    }
    return accesTokenGoogle;
}

router.get('/oauth2/authorize', (req, res) => {
    const scope = "https://mail.google.com/ https://www.googleapis.com/auth/youtube";
    const clientId = "851421718570-hg45uvf78pjvavk3vk715skn3degqu9a.apps.googleusercontent.com";

    var redirect_uri = "http://localhost:8080/youtube/oauth2/callback";

    res.redirect('https://accounts.google.com/o/oauth2/auth?' +
            querystring.stringify({
                access_type: 'online',
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirect_uri,
        }));
})

router.get('/oauth2/callback', async (req, res) => {
    const code = req.query.code;
    console.log("----" + code);
    var Redirect_URI = "http://localhost:8080/youtube/oauth2/callback";
    const clientID = "851421718570-hg45uvf78pjvavk3vk715skn3degqu9a.apps.googleusercontent.com";
    const clientSecret = "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";

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
        return res.send(response.data)
    }).catch((error) => console.log(error));

});

router.get("/getmail", async (req, res) =>{
    axios({
        method: 'get',
        url: "https://www.googleapis.com/gmail/v1/users/me/messages",
        headers: {
            Authorization: (`Bearer ${token}`),
            accept: 'application/json'
        }
    })
    .then((response) => {
        let a = response.data.resultSizeEstimate
        console.log(a)
        return res.send(response.data.resultSizeEstimate)
    })
    .catch((err) => {
        console.log(err)
        return false
    })
})


module.exports = router;