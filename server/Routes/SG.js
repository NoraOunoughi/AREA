const express = require('express');
const router = express.Router();
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

router.use(cors());

const db = getFirestore();

async function getUserFromDb(uidReq) {
  const usersRef = db.collection('users').doc(uidReq);
  const doc = await usersRef.get();
  if (!doc.exists) {
    console.log('No such document!');
    return null;
  }
  var useremail = doc.data().email;
  if (useremail === null || useremail === undefined) {
    console.log('No user email');
    return null;
  }
  return useremail;
}

// router.post("/sendmail", async (req, res) =>{
//     const apiKey = "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";
//     const recipient = req.body.uid;
//     sgMail.setApiKey(apiKey);
//     let useremail = await getUserFromDb(recipient);
//     if (useremail === null) {
//       return res.send({
//         message : "No email available",
//         status: 400
//       })
//     }
//     const msg = {
//         to: useremail,
//         from: 'nora.ounoughi@epitech.eu',
//         subject: 'Reaction from Area Potter',
//         text: `Welcome ${useremail}, this is an automated email from AreaPotter Team\nPlease don't reply.`,
//         //html: '<strong>Area Potter</strong>',
//     }
//     sgMail
//         .send(msg)
//         .then(() => {
//           console.log('Email sent')
//           return true
//         })
//         .catch((error) => {
//           console.error(error)
//           return false
//         })
// })

async function AutomatedEmail(AreaObj) {
  const apiKey = "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";
    sgMail.setApiKey(apiKey);
    let useremail = await getUserFromDb(AreaObj.data().uid);
    if (useremail === null) {
      return false
    }
    const msg = {
        to: useremail,
        from: 'nora.ounoughi@epitech.eu',
        subject: 'Reaction from Area Potter',
        text: `Welcome ${useremail}, this is an automated email from AreaPotter Team\nPlease don't reply.`,
        //html: '<strong>Area Potter</strong>',
    }
    await sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
          return true
        })
        .catch((error) => {
          console.error(error)
          return false
        })
}

module.exports = {
  AutomatedEmail : AutomatedEmail,
  router: router
}
