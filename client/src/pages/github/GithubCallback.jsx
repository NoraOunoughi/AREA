import "./github.scss";
import axios from "axios";
import React, { useState, useEffect } from "react";

/// Web Client / Server Oauth steps:
///     - Client Web have code in query params
///     ---> After authorize request
///     ---> You login and be redirect to 'http://' + localhost + ':' + "8081" + '/github/callback'
///     ---> This is this page
///     ---> You can finally get code
///     ---> Make request GET to Server /github/oauth2/callback with code to get access_token in response

export default function GithubCallback() {
  const [userId] = useState(window.localStorage.getItem('uid'));

  useEffect(() => {
    const callbackFlow = async () => {
      // We get github authorization code from url query params
      var urlSearch = window.location.search
      console.log(urlSearch)
      let code = new URLSearchParams(urlSearch).get("code")
      console.log(code)
  
      // GET on callback with code in query params
      // Server make request github with redirect_uri http://localhost:8080/github/oauth2/callback
      try {   
          const response = await axios.get("http://localhost:8080/github/oauth2/callback", {
              params: {
                  code: code,
              },
          })
          // We get and print response from server callback here
          console.log(response)
          var githubAccessToken = response.data.access_token
          if (response.status === 200 && githubAccessToken !== undefined && githubAccessToken !== "") {
          console.log(githubAccessToken)
          try {
              const postTokenResponse = await axios.post("http://localhost:8080/db/savedb", {
                  uid: userId,
                  service: "github",
                  access_token: githubAccessToken
              })
              console.log(postTokenResponse)
              if (postTokenResponse.status === 200) {
                  console.log(postTokenResponse.statusText)
                  // Redirige to github area si connecté
                  window.location.href = "/github/area"
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
    <div className="github">
    </div>
  );
}