import "./discord.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

/// Web Client / Server Oauth steps:
///     - Client Web have code in query params
///     ---> After authorize request
///     ---> You login and be redirect to 'http://' + localhost + ':' + "8081" + '/discord/callback'
///     ---> This is this page
///     ---> You can finally get code
///     ---> Make request GET to Server /discord/oauth2/callback with code to get access_token in response

export default function DiscordCallback() {
  const [userId] = useState(window.localStorage.getItem('uid'));

  useEffect(() => {
    const callbackFlow = async () => {
      // We get discord authorization code from url query params
      var urlSearch = window.location.search
      console.log(urlSearch)
      let code = new URLSearchParams(urlSearch).get("code")
      console.log(code)
  
      // GET on callback with code in query params
      // Server make request discord with redirect_uri http://localhost:8080/discord/oauth2/callback
      try {   
          const response = await axios.get("http://localhost:8080/discord/oauth2/callback", {
              params: {
                  code: code,
              },
          })
          // We get and print response from server callback here
          console.log(response)
          var discordAccessToken = response.data.access_token
          if (response.status === 200 && discordAccessToken !== undefined && discordAccessToken !== "") {
          console.log(discordAccessToken)
          try {
              const postTokenResponse = await axios.post("http://localhost:8080/db/savedb", {
                  uid: userId,
                  service: "discord",
                  access_token: discordAccessToken
              })
              console.log(postTokenResponse)
              if (postTokenResponse.status === 200) {
                  console.log(postTokenResponse.statusText)
                  // Redirige to discord area si connecté
                  window.location.href = "/discord/area"
              }
          } catch (e) {
              console.log(e)
          }
              
          }
      } catch (e) {
          console.log(e)
      }
    }
    callbackFlow()
  });

  return (
    <div className="discord">
    </div>
  );
}