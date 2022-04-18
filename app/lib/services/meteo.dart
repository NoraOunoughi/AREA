import 'dart:core';
import 'package:app/services/formCreate.dart';
import 'package:app/utils/design.dart';
import 'package:app/utils/functions.dart';
import 'package:app/models/areaModel.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:app/models/params.dart';

class MeteoPage extends StatelessWidget {
  const MeteoPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const FormCreate(
      servicePageName: 'Weather',
      mainPageColor: Color.fromRGBO(215, 206, 30, 1.0),
    );
  }
}
