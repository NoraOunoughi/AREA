# AREA

The goal of this project is to discover, as a whole, the software platform that you have chosen through the creation of a business application.

## Description

Area is a web and mobile application who reunite multiple functionalities in one place.
<br>
The aim is to facilitate your daily question, like "do i need to take a coat to go outside today ?"

## List of our functionalities:

* Gmail <br>
    - Action -> Mails : Retrieves the number of the connected user's mails
    - Reaction -> SendMail : Send an e-mail to a recipient
* Youtube <br>
    - Action -> Channels : Retrieves the number of the connected user's subscribed channels <br>
             -> Playlist : Retrieves the number of the connected user's playlist
* Spotify <br>
    - Action -> Artists : Retrieves the number of the connected user's subscribed channels <br>
    - Reaction -> CreatePlaylist : Create a new playlist
* Discord <br>
    - Action -> Servers : Retrieves the number of the connected user's servers
* Github <br>
    - Action -> Repos : Retrieves the number of the connected user's repositories <br>
    -> Followers : Retrieves the number of the connected user's followers
    - Reaction -> CreateRepo : Creates a new repo <br>
    -> Block : Blocks a user <br>
    -> Follow : Follows a user
* Weather <br>
    - Action -> UvIndex : Retrieves the Uv Index of a city <br>
    -> Temperature : Retrieves the temperature of a city <br>
    -> Weather : Retrieves the weather of a city <br>
* SendGrid <br>
    - Reaction -> AutomatedEmail : Send an email to the connected user

## Our doc API

* [Github Oauth2](https://cloudy-crater-1565.postman.co/workspace/My-Workspace~2d48321b-a07a-4ee2-8d15-73a228c203d7/request/18510887-d9a34092-9123-4ad9-95fd-03898c294d71)
* [Spotify Oauth2](https://cloudy-crater-1565.postman.co/workspace/My-Workspace~2d48321b-a07a-4ee2-8d15-73a228c203d7/request/18510887-124b8e19-dd3c-44b0-a9d2-6aabf54267ce)
* [Discord Oauth2](https://cloudy-crater-1565.postman.co/workspace/My-Workspace~2d48321b-a07a-4ee2-8d15-73a228c203d7/request/18510887-b0ca3127-d710-43ec-8d75-354b0a2a3b27)
* [Google Oauth2](https://cloudy-crater-1565.postman.co/workspace/My-Workspace~2d48321b-a07a-4ee2-8d15-73a228c203d7/request/18510887-eb9310a2-4b16-4b46-95fd-b0fb65cb080d)
* [Save Access_token](https://cloudy-crater-1565.postman.co/workspace/My-Workspace~2d48321b-a07a-4ee2-8d15-73a228c203d7/request/18510887-2d35c151-11c9-46c2-8890-51345a18c3da)

## External API used

* [Github](https://docs.github.com/en/rest)
* [Spotify](https://developer.spotify.com/documentation/web-api/)
* [Discord](https://discord.com/developers/docs/intro)
* [Weather](https://openweathermap.org/api)
* [Sendgrid](https://sendgrid.com/solutions/email-api/)
* [Google](https://developers.google.com/apis-explorer)


## Getting Started
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=for-the-badge&logo=Flutter&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

### Dependencies

* Docker-compose


### Requires for Android Emulator
```
* adb reverse tcp:8080 tcp:8080
```

### Libraries

* fortawesome
* mui/material
* axios
* firebase
* firebase-auth
* react
* react-dom
* react-player
* react-router-dom

### Installing

* [Download Project](https://github.com/EpitechPromo2024/B-YEP-500-PAR-5-1-area-noe.jais)

### Executing program

* How to run the program
```bash
docker-compose build
docker-compose up
```
* Open web page
[Client](http://localhost:8081)

## Authors
Noe Jais, Lucas Lindemans, Nora Ounoughi, Pierre Dallara, Thomas Lopez

contact:
```
noe.jais@epitech.eu
```
```
lucas.lindemans@epitech.eu
```
```
nora.ounoughi@epitech.eu
```
```
pierre1.dallara@epitech.eu
```
```
thomas1.lopez@epitech.eu
```

## Commit Norm

- Commits have to be in english.
- Each commit should start with a square bracket enclosed key to declare the reason of the commit. Those keys can be found among those :
  ### [ADD] -- if you add files, features, and so on
  ### [FIX] -- if you were working on a bug or any form of default that you corrected 
  ### [DEL] -- if you removed files, features, assets, and so on
  ### [CHANGE] -- if you change something without adding any features or content

## Version History

* 0.1
    * Initial Release
