import 'dart:convert';

import 'package:app/models/areaModel.dart';
import 'package:app/models/params.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'package:app/utils/config.dart' as config;

//////////////////
//              //
// Service Auth //
//              //
//////////////////
class ServiceAuth {
  Future<String?> getUid() async {
    String? uid = FirebaseAuth.instance.currentUser?.uid;
    return uid;
  }

  Future<void> firebaseSignedOut(context) async {
    await FirebaseAuth.instance.signOut();
    Navigator.pushNamedAndRemoveUntil(context, "/", (route) => false);
  }

  Future<UserCredential> signInWithGoogle() async {
    // Trigger the authentication flow
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

    // Obtain the auth details from the request
    final GoogleSignInAuthentication? googleAuth =
        await googleUser?.authentication;

    // Create a new credential
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth?.accessToken,
      idToken: googleAuth?.idToken,
    );

    // Once signed in, return the UserCredential
    UserCredential user =
        await FirebaseAuth.instance.signInWithCredential(credential);

    await ServiceStore().addGoogleUser(user.user?.uid, user.user?.email);

    return user;
  }

  Future<void> signInWithEmailPassword(
      context, String email, String password) async {
    try {
      UserCredential userCredential = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(email: email, password: password);
      if (userCredential.user?.uid != null) {
        await ServiceStore()
            .addUser(userCredential.user?.uid, userCredential.user?.email);
        Navigator.pushNamedAndRemoveUntil(
            context, "/account", (route) => false);
      }
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');
      } else if (e.code == 'email-already-in-use') {
        print('The account already exists for that email.');
      }
    } catch (e) {
      print(e);
    }
  }
}

////////////////////
//                //
//  Service Store //
//                //
////////////////////
class ServiceStore {
  FirebaseFirestore firestore = FirebaseFirestore.instance;

  Future<void> addUser(uid, email) {
    // Call the user's CollectionReference to add a new user
    CollectionReference users = FirebaseFirestore.instance.collection('users');
    return users
        .doc(uid)
        .set({
          'email': email,
        })
        .then((value) => print("User Added"))
        .catchError((error) => print("Failed to add user: $error"));
  }

  addGoogleUser(uid, email) async {
    // Call the user's CollectionReference to add a new user
    CollectionReference users = FirebaseFirestore.instance.collection('users');

    DocumentSnapshot doc = await users.doc(uid).get();
    if (doc.exists) {
      return;
    }
    users
        .doc(uid)
        .set({
          'email': email,
        })
        .then((value) => print("User Added"))
        .catchError((error) => print("Failed to add user: $error"));
  }

  modifyHouse(uid, houseName) async {
    CollectionReference users = FirebaseFirestore.instance.collection('users');

    DocumentSnapshot doc = await users.doc(uid).get();
    if (doc.exists) {
      users
          .doc(uid)
          .update({
            'house': houseName,
          })
          .then((value) => print("User House Updated"))
          .catchError((error) => print("Failed to House Updated: $error"));
    }
  }

  Future<String> getHouseBackground(String? _uid) async {
    if (_uid == null) return config.defaultHouseBackground.toString();
    DocumentSnapshot documentSnapshot =
        await FirebaseFirestore.instance.collection('users').doc(_uid).get();
    if (documentSnapshot.exists) {
      // print('Document data: ${documentSnapshot.data()}');
      Map<String, dynamic> data =
          documentSnapshot.data() as Map<String, dynamic>;
      if (data.containsKey("house")) {
        print("House Account Get");
        var house = config.allHousesBackground[data["house"]].toString();
        return house;
      }
    } else {
      print('Document does not exist on the database');
    }
    return config.defaultHouseBackground.toString();
  }

  Future<String> getHouseName(String? _uid) async {
    if (_uid == null) return "";
    DocumentSnapshot documentSnapshot =
        await FirebaseFirestore.instance.collection('users').doc(_uid).get();
    if (documentSnapshot.exists) {
      // print('Document data: ${documentSnapshot.data()}');
      Map<String, dynamic> data =
          documentSnapshot.data() as Map<String, dynamic>;
      if (data.containsKey("house")) {
        return data["house"];
      }
    } else {
      print('Document does not exist on the database');
    }
    return "";
  }
}

Params createParamFromItem(var item, var serviceName) {
  var newParam = Params(serviceName, item["name"], item["description"]);

  if (item["args"] != null) {
    var args = <String>[];
    for (var parmArg in item["args"]) {
      var name = parmArg["argName"];
      args.add(name);
    }
    newParam.args = args;
  }
  return newParam;
}

String getTokenName(String serviceName) {
  if (serviceName.toLowerCase() == "gmail" ||
      serviceName.toLowerCase() == "youtube") return "googleToken";
  return serviceName + "Token";
}

Future<List<List<Params>>> getParamsFromAboutJson(
    String fromPage, String uid) async {
  // All params action and reaction
  List<Params> allActions = <Params>[];
  List<Params> allReactions = <Params>[];
  Map<String, dynamic> docData = {};

  String servFromMobileIp = config.servFromMobileIp;
  String port = config.port;

  http.Response response = await http.get(
    Uri.parse("http://" + servFromMobileIp + ":" + port + "/about.json"),
    headers: {"Content-Type": "application/json"},
  );

  // print(response.body.toString());

  var jsonContent = json.decode(response.body.toString());

  DocumentSnapshot documentSnapshot =
      await FirebaseFirestore.instance.collection('users').doc(uid).get();
  if (documentSnapshot.exists) {
    docData = documentSnapshot.data() as Map<String, dynamic>;
  }

  // List serviceName don't need Oauth
  // var isNoOauth = [];

  for (var servicesItem in jsonContent["server"]["services"]) {
    if (servicesItem["actions"] != null) {
      var serviceName = servicesItem["name"].toString();
      for (var item in servicesItem["actions"]) {
        var tokenName = getTokenName(serviceName);
        // If it is service action of page
        if (fromPage == serviceName) {
          // If user connected to service
          if (docData.containsKey(tokenName) && docData[tokenName] != "") {
            var x = createParamFromItem(item, serviceName);
            allActions.add(x);
          }
          // If service don't need oauth
          // else if (isNoOauth.contains(serviceName)) {
          //   var x = Params(serviceName, item["name"], item["description"]);
          //   allActions.add(x);
          // }
          else if (servicesItem["isNotOauth"] != null &&
              servicesItem["isNotOauth"] == true) {
            var x = createParamFromItem(item, serviceName);
            allActions.add(x);
          }
        }
      }
    }

    if (servicesItem["reactions"] != null) {
      var serviceName = servicesItem["name"].toString();
      for (var item in servicesItem["reactions"]) {
        var tokenName = getTokenName(serviceName);
        // If connected to this service
        if (docData.containsKey(tokenName) && docData[tokenName] != "") {
          var x = createParamFromItem(item, serviceName);
          allReactions.add(x);
          // } else if (isNoOauth.contains(serviceName)) {
          //   // If service don't need oauth
          //   var x = Params(serviceName, item["name"], item["description"]);
          //   allReactions.add(x);
          // }
        } else if (servicesItem["isNotOauth"] != null &&
            servicesItem["isNotOauth"] == true) {
          var x = createParamFromItem(item, serviceName);
          allReactions.add(x);
        }
      }
    }
  }
  return [allActions, allReactions];
}

//
//
// Get all Area Infos of a User
//
//
Future<List<String>> getOwnedId(uid) async {
  DocumentSnapshot documentSnapshot =
      await FirebaseFirestore.instance.collection('users').doc(uid).get();
  if (documentSnapshot.exists) {
    Map<String, dynamic> data = documentSnapshot.data() as Map<String, dynamic>;
    if (data.containsKey("ownedAreaId")) {
      print("All Owned Area ID");
      List<String> allOwnedAreaId = List.from(data["ownedAreaId"]);
      print(allOwnedAreaId);
      return allOwnedAreaId;
    }
  } else {
    print('Document does not exist on the database');
  }
  return [];
}

////////////////////
//                //
//  Area Service  //
//                //
////////////////////
class AreaService {
  getArea(areaId) async {
    DocumentSnapshot documentSnapshot =
        await FirebaseFirestore.instance.collection('areas').doc(areaId).get();
    if (documentSnapshot.exists) {
      Map<String, dynamic> data =
          documentSnapshot.data() as Map<String, dynamic>;
      Area tmp = Area.fromJson(data, documentSnapshot.id);
      return tmp;
    } else {
      print('Document does not exist on the database');
    }
    return null;
  }

  getAllArea(uid) async {
    var ownedAreaId = await getOwnedId(uid);
    List<Area> allAreas = [];
    for (var areaId in ownedAreaId) {
      Area? newArea = await getArea(areaId);
      if (newArea != null) {
        allAreas.add(newArea);
        print(newArea.name);
        print(newArea.action);
        print(newArea.reaction);
        print("");
      }
    }
    return allAreas;
  }

  List<DropdownMenuItem<int>> createDropdownFromActionReaction(
      List<Params> allParams, base) {
    List<DropdownMenuItem<int>> menuItems = base;
    var index = 0;
    for (var item in allParams) {
      var newDrop = DropdownMenuItem(
          child: Text("[" + item.serviceName + "] " + item.description),
          value: index);
      menuItems.add(newDrop);
      index += 1;
    }
    return menuItems;
  }

  addNewArea(String? uid, Area newArea) async {
    List<String> actualOwneds = await getOwnedId(uid);
    String newId = "";
    // add new Area to bdd
    var objAdd = await FirebaseFirestore.instance.collection("areas").add({
      "name": newArea.name,
      "action": newArea.action,
      "actionParams": newArea.actionParams,
      "reaction": newArea.reaction,
      "reactionParams": newArea.reactionParams,
      "uid": uid,
    });
    newId = objAdd.id.toString();
    print("New area added with Id: " + newId);

    actualOwneds.add(newId);
    // Add new area id to ownedAreaId array of user
    await FirebaseFirestore.instance.collection("users").doc(uid).update({
      "ownedAreaId": actualOwneds,
    });
  }

  deleteArea(String? uid, String? areaId) async {
    print("Try to delete");
    print(uid);
    print(areaId);
    List<String> actualOwneds = await getOwnedId(uid);
    actualOwneds.remove(areaId);
    // Delete areaId in ownedAreaId
    await FirebaseFirestore.instance.collection("users").doc(uid).update({
      "ownedAreaId": actualOwneds,
    });
    // Delete area
    await FirebaseFirestore.instance.collection("areas").doc(areaId).delete();
  }
}
