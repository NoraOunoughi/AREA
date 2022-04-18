import 'package:app/utils/design.dart';
import 'package:app/utils/functions.dart';
import 'package:app/models/areaModel.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/config.dart' as config;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:ui';

class AreaPage extends StatefulWidget {
  @override
  _AreaPageState createState() => _AreaPageState();
}

class _AreaPageState extends State<AreaPage> {
  // BottomNavBar var
  final _selectedIndex = 1;

  // Page var
  final String _currentBackground = "assets/potter/hogwarts_background.jpg";
  String? _uid;
  String _currentHouse = "";
  String _currentHousBackground = "";
  List<Area> _allOwnedArea = [];

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
    var uid = await ServiceAuth().getUid();
    var house = await ServiceStore().getHouseName(uid);
    var houseBackground = await ServiceStore().getHouseBackground(uid);
    List<Area> allAreas = await AreaService().getAllArea(uid);
    setState(() {
      _uid = uid;
      _currentHousBackground = houseBackground;
      _currentHouse = house;
      _allOwnedArea = allAreas;
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: Design().myAppBar(context, "Area List", null),
      bottomNavigationBar: Design().myBottomNavBar(context, _selectedIndex),
      backgroundColor: Design().blackBackground,
      body: ScrollConfiguration(
        behavior: MyBehavior(),
        child: Container(
          width: size.width,
          height: size.height,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage(_currentHousBackground == ""
                  ? _currentBackground
                  : _currentHousBackground),
              fit: BoxFit.cover,
            ),
          ),
          child: _allOwnedArea.isEmpty
              ? displayNoArea()
              : SingleChildScrollView(
                  child: SizedBox(
                      height: size.height,
                      child: ListView.builder(
                          itemCount: _allOwnedArea.length,
                          padding: const EdgeInsets.only(top: 10.0),
                          itemBuilder: (context, index) {
                            Area actual = _allOwnedArea[index];
                            return areaCard(actual);
                          }))),
        ),
      ),
    );
  }

  Widget displayNoArea() {
    Size size = MediaQuery.of(context).size;
    return Container(
      padding: EdgeInsets.only(top: size.height / 3.5),
      child: Center(
        child: Column(
          children: [
            const Text(
              "You don't have any Area",
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.w600),
            ),
            const Text(
              "You want create a new one ?",
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.w600),
            ),
            const Text(
              "Click Here",
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800),
            ),
            ClipRRect(
              borderRadius: BorderRadius.circular(15),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaY: 15, sigmaX: 15),
                child: InkWell(
                  highlightColor: Colors.transparent,
                  splashColor: Colors.transparent,
                  onTap: () {
                    Navigator.popAndPushNamed(context, "/services");
                  },
                  child: Container(
                    height: size.width / 8,
                    width: size.width / 1.5,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(.05),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Text(
                      "Create new Area",
                      style: TextStyle(
                          color: Colors.white.withOpacity(.8), fontSize: 40),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget areaCard(Area actual) {
    var logoName = _currentHouse;
    var realLogo;
    if (logoName == "") {
      realLogo = "assets/potter/logo.png";
    } else {
      switch (logoName) {
        case "gryffindor":
          realLogo = "assets/potter/house_logo/gryffindor.png";
          break;
        case "hufflepuff":
          realLogo = "assets/potter/house_logo/hufflepuff.png";
          break;
        case "ravenclaw":
          realLogo = "assets/potter/house_logo/ravenclaw.png";
          break;
        case "slytherin":
          realLogo = "assets/potter/house_logo/slytherin.png";
          break;
        default:
          realLogo = "assets/potter/logo.png";
      }
    }
    print(logoName);
    print(realLogo);
    return Card(
        color: Colors.white.withOpacity(0.9),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
          ListTile(
            leading: Padding(
              padding: const EdgeInsets.only(top: 2, bottom: 2),
              child: Image.asset(realLogo, fit: BoxFit.contain),
            ),
            trailing: IconButton(
                icon: const Icon(Icons.delete_outline),
                onPressed: () async {
                  await AreaService().deleteArea(_uid, actual.id);
                  List<Area> allAreas = await AreaService().getAllArea(_uid);
                  setState(() {
                    _allOwnedArea = allAreas;
                  });
                }),
            title: Text(
              actual.name,
              style: const TextStyle(
                fontSize: 30,
              ),
            ),
            subtitle: Column(
              children: [
                Text('Action: ${actual.action}',
                    style: const TextStyle(
                      fontSize: 25,
                    )),
                Text('Reaction: ${actual.reaction}',
                    style: const TextStyle(
                      fontSize: 25,
                    )),
              ],
            ),
          ),
        ]));
  }
}
