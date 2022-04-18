import "./gmail.scss";
import axios from "axios";
// import { auth } from '../../components/firebase/firebase';
import { getDoc, doc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import React, { useState, useEffect } from "react";
import gmailLogo from '../../assets/gmail.png';

export default function Gmail() {
  const [userId] = useState(window.localStorage.getItem('uid'));
  // Si const [urlOauth, setUrlOauth] = useState("");
  // setUrlOauth refresh la page et on perde l'authorize url
  // sans setter pas de refresh et utiliser urlOaurh = "http://localhost......."
  var [urlOauth] = useState("");
  
  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    localStorage.removeItem("yt");
    const getgmailToken = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef)
      if (docSnap.exists) {
        const data = docSnap.data();
        console.log("Document data:", data);
        if (data.googleToken !== undefined) {
          console.log("Document GoogleToken:", data.googleToken);
          // Redirige to gmail area si connecté
          window.location.href = "/gmail/area"
        }
      }
    }
    // Don't need await here useEffect handle it
    getgmailToken()
  });

  const Oauthgmail = async () => {
    try {
      const response = await axios.get("http://localhost:8080/google/oauth2/authorize")
      urlOauth = response.data.message;
      window.location.href = urlOauth;
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="gmail">
      <div className="gmail-container">
        <button className="myButton-gmail" onClick={() => Oauthgmail()}>
          <img src={gmailLogo} alt="logo" className="gmail-logo" /> Login gmail
        </button>
      </div>
    </div>
  );
} 