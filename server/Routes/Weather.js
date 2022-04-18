const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
var fahrenheitToCelsius = require('fahrenheit-to-celsius');
//const {RunReaction} = require('./Reaction')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();

//const { response } = require('express');

router.use(cors());


// router.get('/UV' , (req, res) => {
//     let apiKey = "39eee3e3cab87d2652ee49f0884e6561";
//     let city = "paris";
//     let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

//     axios.get(url)
//         .catch(error => {
//             console.log("Error weather request")
//         })
//         .then((response) => {
//             if (response.data.main == undefined){
//                 return res.send({
//                     status:400,
//                     message:"City not found"
//                 })
//             }
//             else {
//                 let long = `${response.data.coord.lon}`;
//                 let lat = `${response.data.coord.lat}`;
//                 let urluv = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${long}`;
//                 axios.get(urluv)
//                     .catch(error => {
//                         console.log("error")
//                     })
//                     .then(response => {
//                         let uvmessage = `${response.data.value}`;
//                         return res.send ({
//                             message: uvmessage
//                         })
//                     })
//             }
//         });
// });

// router.get('/tempcity', (req, res) => {
//     let apiKey = "39eee3e3cab87d2652ee49f0884e6561";
//     let city = "paris";
//     let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

//     axios.get(url)
//         .catch(error => {
//             console.log("Error: weather map request")
//         })
//         .then(response => {
//             if (response.data.main == undefined){
//                 return res.send({
//                     status:400,
//                     message:"City not found"
//                 })
//             }
//             else {
//                 let celsius = fahrenheitToCelsius(response.data.main.temp);
//                 let weatherText = `${celsius.toFixed(0)}`;
//                 return res.send ({
//                     message: weatherText,
//                     status:200
//                 })
//             }
//         });
// });

// router.get('/weathercity', (req, res) => {
//     let apiKey = "39eee3e3cab87d2652ee49f0884e6561";
//     let city = "paris";
//     let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

//     axios.get(url)
//         .catch(error => {
//             console.log("Error: weather map request")
//         })
//         .then(response => {
//             if (response.data.main == undefined){
//                 return res.send({
//                     status:400,
//                     message:"City not found"
//                 })
//             }
//             else {
//                 return res.send ({
//                     message: response.data.weather[0].main,
//                     status:200
//                 })
//             }
//         });
// });

async function UvIndex(AreaObj) {
    let apiKey = "39eee3e3cab87d2652ee49f0884e6561";
    let city = AreaObj.data().actionParams;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    console.log("In UV")
    axios.get(url)
        .catch(error => {
            console.log("Error weather request")
            return false
        })
        .then((response) => {
            if (response.data.main == undefined){
                return false
            }
            else {
                let long = `${response.data.coord.lon}`;
                let lat = `${response.data.coord.lat}`;
                let urluv = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${long}`;
                axios.get(urluv)
                    .catch(error => {
                        console.log(error)
                        return false
                    })
                    .then(async (response) => {
                        let a = response.data.value
                        if (AreaObj.data().checkValue == undefined) {
                            //Faire changement dans db
                            const docRef = db.collection('areas').doc(AreaObj.id)
                            await docRef.update({
                                checkValue: a
                            });
                            return true
                        }
                        if (AreaObj.data().checkValue != a) {
                            const docRef = db.collection('areas').doc(AreaObj.id)
                            await docRef.update({
                                checkValue: a
                            });
                            RunReaction(AreaObj)
                        }
                        return true
                    })
            }
        });
}

async function Temperature(AreaObj) {
    let apiKey = "39eee3e3cab87d2652ee49f0884e6561";
    let city = AreaObj.data().actionParams;
    console.log(city)
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    console.log("in temperature")
    axios.get(url)
        .catch(error => {
            console.log("Error: weather map request")
            return false
        })
        .then(async (response) => {
            if (response.data.main == undefined){
                console.log("Wrong city")
                return false
            }
            else {
                let celsius = fahrenheitToCelsius(response.data.main.temp);
                let a = celsius.toFixed(0);
                console.log("     ", a)
                if (AreaObj.data().checkValue == undefined) {
                    //Faire changement dans db
                    const docRef = db.collection('areas').doc(AreaObj.id)
                    await docRef.update({
                        checkValue: a
                    });
                    return true
                }
                if (AreaObj.data().checkValue != a) {
                    const docRef = db.collection('areas').doc(AreaObj.id)
                    await docRef.update({
                        checkValue: a
                    });
                    RunReaction(AreaObj)
                }
                return true
            }
        });
}

async function Weather(AreaObj) {
    let apiKey = "39eee3e3cab87d2652ee49f0884e6561";
    let city = AreaObj.data().actionParams;
    console.log(city)
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    console.log("In weather")
    axios.get(url)
        .catch(error => {
            console.log(error)
            return false
        })
        .then(async (response) => {
            if (response.data.main == undefined){
                return false
            }
            else {
                let a = response.data.weather[0].main;
                if (AreaObj.data().checkValue == undefined) {
                    //Faire changement dans db
                    const docRef = db.collection('areas').doc(AreaObj.id)
                    await docRef.update({
                        checkValue: a
                    });
                    return true
                }
                if (AreaObj.data().checkValue != a) {
                    const docRef = db.collection('areas').doc(AreaObj.id)
                    await docRef.update({
                        checkValue: a
                    });
                    RunReaction(AreaObj)
                }
                return true
            }
        });
}

module.exports = {
    Weather : Weather,
    Temperature : Temperature,
    UvIndex : UvIndex,
    router: router
};

const {RunReaction} = require('./Reaction')