import 'package:app/utils/design.dart';
import 'package:app/utils/functions.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/config.dart' as config;

class ServicesPage extends StatefulWidget {
  @override
  _ServicesPageState createState() => _ServicesPageState();
}

class _ServicesPageState extends State<ServicesPage> {
  // BottomNavBar var
  final _selectedIndex = 0;

  // Page var
  String? _uid;
  String _currentHouse = config.defaultHouseBackground;
  final List<String> entries = <String>[
    'Spotify',
    'Discord',
    'GitHub',
    'Meteo',
    'Youtube',
    'Gmail'
  ];
  final List<Color?> allColors = <Color?>[
    const Color.fromRGBO(30, 215, 96, 0.8),
    const Color.fromRGBO(35, 39, 60, 0.8),
    const Color.fromRGBO(110, 84, 148, 0.8),
    Colors.white.withOpacity(0.8),
    const Color.fromRGBO(40, 40, 40, 0.8),
    Colors.white.withOpacity(0.8),
  ];
  final List<Widget> allIcon = <Widget>[
    Image.asset('assets/logo_spotify.png', fit: BoxFit.contain),
    Image.asset('assets/discord.png', fit: BoxFit.contain),
    Image.asset('assets/logo_github.png', fit: BoxFit.contain),
    Image.asset('assets/logo_meteo.png', fit: BoxFit.contain),
    Image.asset('assets/logo_youtube.png', fit: BoxFit.contain),
    Image.asset('assets/gmail.png', fit: BoxFit.contain),
  ];
  final List<String> allRoutes = <String>[
    "/spotify",
    "/discord",
    "/github",
    "/meteo",
    "/youtube",
    "/gmail",
  ];

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
      appBar: Design().myAppBar(context, "All Services", null),
      bottomNavigationBar: Design().myBottomNavBar(context, _selectedIndex),
      backgroundColor: Design().blackBackground,
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage(_currentHouse),
            fit: BoxFit.cover,
          ),
        ),
        child: ListView.separated(
          padding: const EdgeInsets.all(8),
          itemCount: entries.length,
          itemBuilder: (BuildContext context, int index) {
            return InkWell(
              onTap: () =>
                  {Navigator.pushNamed(context, allRoutes.elementAt(index))},
              child: Container(
                decoration: BoxDecoration(
                    color: allColors.elementAt(index),
                    borderRadius: BorderRadius.all(Radius.circular(20))),
                height: 70,
                child: Row(children: <Widget>[
                  Container(
                    padding: const EdgeInsets.all(5),
                    width: 50,
                    height: 50,
                    child: allIcon.elementAt(index),
                  ),
                  Container(
                    padding: const EdgeInsets.all(5),
                    child: Text(
                      '${entries[index]} Service ',
                      style: TextStyle(
                        fontSize: 30,
                      ),
                    ),
                  )
                ]),
              ),
            );
          },
          separatorBuilder: (BuildContext context, int index) =>
              const Divider(),
        ),
      ),
    );
  }
}
