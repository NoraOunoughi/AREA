import 'dart:convert';

import 'package:app/models/params.dart';
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'package:app/utils/config.dart' as config;

class Design {
  Color blackBackground = const Color(0xff192028);
  Color bottomNavBarBlack = const Color(0xff060809);
  Color firstGradient = const Color(0xffFD5E3D);
  Color secondGradient = const Color(0xffC43990);
  Color iconNavBar = Colors.white;

  Widget myBottomNavBar(context, _selectedIndex) {
    return BottomNavigationBar(
      iconSize: 30,
      selectedItemColor: firstGradient,
      unselectedItemColor: iconNavBar,
      backgroundColor: bottomNavBarBlack,
      currentIndex: _selectedIndex,
      selectedFontSize: 20,
      unselectedFontSize: 20,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.add),
          label: "Services",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: "Home",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: "Profile",
        ),
      ],
      onTap: (int index) {
        if (index == 0) {
          Navigator.pushNamedAndRemoveUntil(
              context, "/services", (route) => false);
        } else if (index == 1) {
          Navigator.pushNamedAndRemoveUntil(
              context, "/areas", (route) => false);
        } else if (index == 2) {
          Navigator.pushNamedAndRemoveUntil(
              context, "/account", (route) => false);
        }
      },
    );
  }

  AppBar myAppBar(context, String? tittle, Color? tittleColor) {
    return AppBar(
      centerTitle: true,
      title: tittle != null ? Text(tittle.toString()) : const Text(""),
      titleTextStyle: tittleColor != null
          ? TextStyle(
              color: tittleColor, fontSize: 30, fontFamily: "HarryPotterFont")
          : const TextStyle(fontSize: 30, fontFamily: "HarryPotterFont"),
      backgroundColor: blackBackground,
    );
  }
}

class MyPainter extends CustomPainter {
  final double radius;

  MyPainter(this.radius);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = LinearGradient(
              colors: [Design().firstGradient, Design().secondGradient],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight)
          .createShader(Rect.fromCircle(
        center: const Offset(0, 0),
        radius: radius,
      ));

    canvas.drawCircle(Offset.zero, radius, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class MyBehavior extends ScrollBehavior {
  @override
  Widget buildViewportChrome(
      BuildContext context, Widget child, AxisDirection axisDirection) {
    return child;
  }
}
