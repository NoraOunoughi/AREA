import 'package:app/account.dart';
import 'package:app/areaPage.dart';
import 'package:app/inscription.dart';
import 'package:app/login.dart';
import 'package:app/services.dart';
import 'package:app/services/discord.dart';
import 'package:app/services/github.dart';
import 'package:app/services/gmail.dart';
import 'package:app/services/youtube.dart';
import 'package:app/services/meteo.dart';
import 'package:app/services/spotify.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(fontFamily: 'HarryPotterFont'),
      title: 'Area App',
      // Start the app with the "/" named route. In this case, the app starts
      // on the FirstScreen widget.
      initialRoute: '/',
      routes: {
        // When navigating to the "/" route, build the FirstScreen widget.
        '/': (context) => HomePage(),
        '/inscription': (context) => InscriptionPage(),
        '/account': (context) => AccountPage(),
        '/areas': (context) => AreaPage(),
        '/services': (context) => ServicesPage(),
        '/spotify': (context) => SpotifyPage(),
        '/discord': (context) => DiscordPage(),
        '/github': (context) => GitHubPage(),
        '/meteo': (context) => const MeteoPage(),
        '/youtube': (context) => YoutubePage(),
        '/gmail': (context) => GmailPage(),
      },
    ),
  );
  // // This is for login design UI
  /*
  SystemChrome.setSystemUIOverlayStyle(
    SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  */
}
