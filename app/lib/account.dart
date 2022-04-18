import 'dart:ui';
import 'package:app/utils/design.dart';
import 'package:app/utils/functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:app/utils/config.dart' as config;

class AccountPage extends StatefulWidget {
  @override
  _AccountPageState createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  // BottomNavBar var
  final _selectedIndex = 2;

  // Page var
  String? _uid;
  String _currentHouse = config.defaultHouseBackground;

  @override
  void initState() {
    super.initState();
    getInfos();
  }

  @override
  void dispose() {
    super.dispose();
  }

  getHouseBackground() async {
    var house = await ServiceStore().getHouseBackground(_uid);
    setState(() {
      _currentHouse = house;
    });
  }

  getInfos() async {
    var uid = await ServiceAuth().getUid();
    var house = await ServiceStore().getHouseBackground(uid);
    setState(() {
      _uid = uid;
      _currentHouse = house;
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      bottomNavigationBar: Design().myBottomNavBar(context, _selectedIndex),
      backgroundColor: Design().blackBackground,
      body: ScrollConfiguration(
        behavior: MyBehavior(),
        child: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage(_currentHouse),
              fit: BoxFit.cover,
            ),
          ),
          child: SingleChildScrollView(
            child: SizedBox(
              height: size.height,
              child: Stack(
                children: [
                  Column(
                    children: [
                      const SizedBox(
                        height: 50,
                      ),
                      Text(
                        'You are Logged',
                        style: TextStyle(
                          color: Colors.black.withOpacity(.9),
                          fontSize: 50,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                          wordSpacing: 4,
                        ),
                      ),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              component2(
                                'LOGOUT',
                                2.58,
                                () async {
                                  HapticFeedback.lightImpact();
                                  await ServiceAuth()
                                      .firebaseSignedOut(context);
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(
                        height: 30,
                      ),
                      Image.asset(
                        "assets/potter/logo.png",
                        height: 400,
                        width: 200,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          IconButton(
                            iconSize: 75,
                            onPressed: () async {
                              await ServiceStore()
                                  .modifyHouse(_uid, "gryffindor");
                              await getHouseBackground();
                            },
                            icon: Image.asset(
                                "assets/potter/house_logo/gryffindor.png"),
                          ),
                          IconButton(
                            iconSize: 75,
                            onPressed: () async {
                              await ServiceStore()
                                  .modifyHouse(_uid, "hufflepuff");
                              await getHouseBackground();
                            },
                            icon: Image.asset(
                                "assets/potter/house_logo/hufflepuff.png"),
                          ),
                          IconButton(
                            iconSize: 75,
                            onPressed: () async {
                              await ServiceStore()
                                  .modifyHouse(_uid, "ravenclaw");
                              await getHouseBackground();
                            },
                            icon: Image.asset(
                                "assets/potter/house_logo/ravenclaw.png"),
                          ),
                          IconButton(
                            iconSize: 75,
                            onPressed: () async {
                              await ServiceStore()
                                  .modifyHouse(_uid, "slytherin");
                              await getHouseBackground();
                            },
                            icon: Image.asset(
                                "assets/potter/house_logo/slytherin.png"),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget component2(String string, double width, VoidCallback voidCallback) {
    Size size = MediaQuery.of(context).size;
    return ClipRRect(
      borderRadius: BorderRadius.circular(15),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaY: 15, sigmaX: 15),
        child: InkWell(
          highlightColor: Colors.transparent,
          splashColor: Colors.transparent,
          onTap: voidCallback,
          child: Container(
            height: size.width / 8,
            width: size.width / width,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(.05),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Text(
              string,
              style:
                  TextStyle(color: Colors.white.withOpacity(.8), fontSize: 20),
            ),
          ),
        ),
      ),
    );
  }
}
