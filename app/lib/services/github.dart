import 'dart:convert';
import 'dart:core';
import 'package:app/services/formCreate.dart';
import 'package:app/utils/config.dart' as config;
import 'package:app/utils/design.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

class GitHubPage extends StatefulWidget {
  @override
  _GitHubPageState createState() => _GitHubPageState();
}

class _GitHubPageState extends State<GitHubPage> {
  // WebView
  late WebViewController _controllerUrl;

  // Pour GitHub server
  String servFromMobileIp = config.servFromMobileIp;
  String port = config.port;

  // BottomNavBar var
  final _selectedIndex = 0;

  // Page var
  Color? mainColor = const Color.fromRGBO(110, 84, 148, 1.0);
  bool _isConnected = false;
  int _currentStep = 0;
  StepperType stepperType = StepperType.vertical;

  @override
  void initState() {
    super.initState();
    getInfos();
  }

  @override
  void dispose() {
    super.dispose();
  }

  getInfos() async {
    String? uid = FirebaseAuth.instance.currentUser?.uid;
    await FirebaseFirestore.instance
        .collection('users')
        .doc(uid)
        .get()
        .then((DocumentSnapshot documentSnapshot) {
      if (documentSnapshot.exists) {
        print('Document data: ${documentSnapshot.data()}');
        Map<String, dynamic> data =
            documentSnapshot.data() as Map<String, dynamic>;
        if (data.containsKey("githubToken") &&
            data["githubToken"] != null &&
            data["githubToken"] != "") {
          _isConnected = true;
        } else {
          _isConnected = false;
        }
      } else {
        print('Document does not exist on the database');
        _isConnected = false;
      }
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return !_isConnected
        ? Scaffold(
            appBar: Design().myAppBar(context, "Github", mainColor),
            bottomNavigationBar:
                Design().myBottomNavBar(context, _selectedIndex),
            backgroundColor: Design().blackBackground,
            body: webViewGitHub(context))
        : FormCreate(
            servicePageName: 'Github',
            mainPageColor: mainColor,
          );
  }

  Widget webViewGitHub(BuildContext context) {
    return WebView(
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: (controller) {
        _controllerUrl = controller;
      },
      gestureNavigationEnabled: true,
      allowsInlineMediaPlayback: true,
      debuggingEnabled: true,
      initialUrl: "http://" +
          servFromMobileIp +
          ":" +
          port +
          "/github/oauth2/authorize?from=mobile",
      onPageFinished: (url) async {
        if (url.contains("/callback")) {
          String html = await _controllerUrl.runJavascriptReturningResult(
              "window.document.getElementsByTagName('pre')[0].outerHTML;");
          html = html.replaceAll('\\n', '');
          html = html.replaceAll("\\u003C", "<");
          html = html.replaceAll('\\"', '"');
          html = html.substring(
              '<pre style="word-wrap: break-word; white-space: pre-wrap;">'
                      .length +
                  1,
              html.length);
          html = html.substring(0, html.length - '</pre>'.length - 1);
          print(html);
          Map<String, dynamic> result = json.decode(html);
          if (result["status"] == 200) {
            String acc = result["access_token"];
            String? uid = FirebaseAuth.instance.currentUser?.uid;
            String body = json
                .encode({"uid": uid, "access_token": acc, "service": "github"});
            http.Response response = await http.post(
              Uri.parse(
                  "http://" + servFromMobileIp + ":" + port + "/db/savedb"),
              headers: {"Content-Type": "application/json"},
              body: body,
            );
            setState(() {
              _isConnected = true;
            });
          }
        }
      },
    );
  }
}
