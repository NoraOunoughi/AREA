import 'dart:core';
import 'package:app/utils/design.dart';
import 'package:app/utils/functions.dart';
import 'package:app/models/areaModel.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:app/models/params.dart';

class FormCreate extends StatefulWidget {
  final String servicePageName;
  final Color? mainPageColor;
  const FormCreate(
      {Key? key, required this.servicePageName, required this.mainPageColor})
      : super(key: key);

  @override
  _FormCreateState createState() => _FormCreateState();
}

class _FormCreateState extends State<FormCreate> {
  final List<String> _allActionsWithArgs = ["Weather"];
  final List<dynamic> _allReactionsWithArgs = [
    "github",
    "spotify",
    "gmail",
    "discord",
  ];
  String _serviceName = "";
  // BottomNavBar var
  final _selectedIndex = 0;

  // Page var
  final _dropdownFormKey = GlobalKey<FormState>();
  String? _uid;
  Color? _mainColor;
  StepperType stepperType = StepperType.vertical;
  List<Params> _allActions = <Params>[];
  List<Params> _allReactions = <Params>[];
  final TextEditingController _controllerActionParam = TextEditingController();
  final TextEditingController _controllerReactionParam =
      TextEditingController();
  final TextEditingController _controllerReactionExtra1Param =
      TextEditingController();
  final TextEditingController _controllerReactionExtra2Param =
      TextEditingController();
  final TextEditingController _controllerName = TextEditingController();
  final String _currentBackground = "assets/potter/hogwarts_background.jpg";

  // Form Action
  int _selectedAction = -1;
  int _selectedReaction = -1;
  List<DropdownMenuItem<int>> _allActionsDrop = [
    const DropdownMenuItem(child: Text("Select Action"), value: -1),
  ];
  List<DropdownMenuItem<int>> _allReactionsDrop = [
    const DropdownMenuItem(child: Text("Select Reaction"), value: -1),
  ];

  @override
  void initState() {
    super.initState();
    _mainColor = widget.mainPageColor;
    _serviceName = widget.servicePageName;
    getInfos();
  }

  @override
  void dispose() {
    super.dispose();
    _controllerActionParam.dispose();
    _controllerReactionParam.dispose();
    _controllerReactionExtra1Param.dispose();
    _controllerReactionExtra2Param.dispose();
    _controllerName.dispose();
  }

  getInfos() async {
    String? uid = FirebaseAuth.instance.currentUser?.uid;
    List<List<Params>> allParams = await getParamsFromAboutJson(
        _serviceName.toLowerCase(), uid.toString());

    _uid = uid;
    _allActions = allParams.elementAt(0);
    _allReactions = allParams.elementAt(1);
    _allActionsDrop =
        AreaService().createDropdownFromActionReaction(_allActions, [
      const DropdownMenuItem(child: Text("Select Action"), value: -1),
    ]);
    _allReactionsDrop =
        AreaService().createDropdownFromActionReaction(_allReactions, [
      const DropdownMenuItem(child: Text("Select Reaction"), value: -1),
    ]);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: Design().myAppBar(context, _serviceName, _mainColor),
      bottomNavigationBar: Design().myBottomNavBar(context, _selectedIndex),
      backgroundColor: Design().blackBackground,
      body: Container(
        width: size.width,
        height: size.height,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage(_currentBackground),
            fit: BoxFit.cover,
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 50),
          child: Form(
            key: _dropdownFormKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Drop Actions
                DropdownButtonFormField(
                    style: const TextStyle(
                      fontFamily: "HarryPotterFont",
                      fontSize: 20,
                    ),
                    decoration: InputDecoration(
                      errorStyle: const TextStyle(
                        fontSize: 20,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                            color: Design().blackBackground, width: 1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      border: OutlineInputBorder(
                        borderSide: BorderSide(
                            color: Design().blackBackground, width: 1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      filled: true,
                      fillColor: Colors.grey.shade900.withOpacity(0.8),
                    ),
                    validator: (value) {
                      if (value == -1) {
                        return "You can't select this";
                      } else {
                        return null;
                      }
                    },
                    dropdownColor: Colors.grey.shade800.withOpacity(0.9),
                    value: _selectedAction,
                    onChanged: (int? newValue) {
                      setState(() {
                        _selectedAction = newValue!;
                      });
                    },
                    items: _allActionsDrop),
                // Params Action
                paramNeedArgs(context, _controllerActionParam),
                // Espace
                const SizedBox(
                  height: 40,
                ),
                // Drop Reactions
                DropdownButtonFormField(
                    style: const TextStyle(
                      fontFamily: "HarryPotterFont",
                      fontSize: 20,
                    ),
                    decoration: InputDecoration(
                      errorStyle: const TextStyle(
                        fontSize: 20,
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                            color: Design().blackBackground, width: 1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      border: OutlineInputBorder(
                        borderSide: BorderSide(
                            color: Design().blackBackground, width: 1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      filled: true,
                      fillColor: Colors.grey.shade900.withOpacity(0.8),
                    ),
                    validator: (value) =>
                        value == -1 ? "You can't select this" : null,
                    dropdownColor: Colors.grey.shade800.withOpacity(0.9),
                    value: _selectedReaction,
                    onChanged: (int? newValue) {
                      setState(() {
                        _selectedReaction = newValue!;
                      });
                    },
                    items: _allReactionsDrop),
                // Params Reaction
                paramReactionNeedArgs(context),
                // Espace
                const SizedBox(
                  height: 50,
                ),
                // Params Name
                textFormParam(context, "Area Name", _controllerName,
                    "Please select a name for your area"),
                // Espace
                const SizedBox(
                  height: 50,
                ),
                // Bouton Create
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    primary: Colors.grey.shade900,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 10),
                    textStyle: const TextStyle(
                        fontSize: 30, fontFamily: "HarryPotterFont"),
                  ),
                  onPressed: () async {
                    if (_dropdownFormKey.currentState!.validate()) {
                      await createArea();
                    }
                  },
                  child: const Text(
                    "Create Area",
                  ),
                ),
                const SizedBox(
                  height: 50,
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget paramNeedArgs(
      BuildContext context, TextEditingController myController) {
    if (_selectedAction != -1 && _allActions[_selectedAction].args.isNotEmpty) {
      var firstArg = _allActions[_selectedAction].args[0];
      return textFormParam(context, "Param " + firstArg, myController,
          "Please enter a " + firstArg);
    }
    return Container();
  }

  Widget paramReactionNeedArgs(BuildContext context) {
    if (_selectedReaction != -1 &&
        _allReactions[_selectedReaction].args.isNotEmpty) {
      var len = _allReactions[_selectedReaction].args.length;
      if (len == 1) {
        var actualArg = _allReactions[_selectedReaction].args[0];
        return textFormParam(context, "Param " + actualArg,
            _controllerReactionParam, "Please enter a " + actualArg);
      } else if (len >= 2) {
        var actualArg = _allReactions[_selectedReaction].args[0];
        var actualArg1 = _allReactions[_selectedReaction].args[1];
        return Column(
          children: [
            textFormParam(context, "Param " + actualArg,
                _controllerReactionParam, "Please enter a " + actualArg),
            textFormParam(context, "Param " + actualArg1,
                _controllerReactionExtra1Param, "Please enter a " + actualArg1),
            len == 3
                ? textFormParam(
                    context,
                    "Param " + _allReactions[_selectedReaction].args[2],
                    _controllerReactionExtra2Param,
                    "Please enter a " +
                        _allReactions[_selectedReaction].args[2])
                : Container()
          ],
        );
      }
    }
    return Container();
  }

  Widget textFormParam(BuildContext context, String? myLabel,
      TextEditingController myController, String? myHint) {
    return Padding(
      padding: const EdgeInsets.all(5),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey,
          borderRadius: BorderRadius.circular(15.0),
        ),
        child: Padding(
          padding: const EdgeInsets.only(left: 15, right: 15, top: 5),
          child: TextFormField(
            decoration: InputDecoration(
              labelStyle: const TextStyle(
                fontSize: 20,
              ),
              errorStyle: const TextStyle(
                fontSize: 20,
              ),
              border: InputBorder.none,
              labelText: myLabel,
            ),
            validator: (value) => value == null || value == "" ? myHint : null,
            controller: myController,
          ),
        ),
      ),
    );
  }

  Widget createReactionsTextField(BuildContext context) {
    if (_selectedReaction == -1) return Container();
    if (_allReactionsWithArgs
        .contains(_allReactions[_selectedReaction].serviceName)) {
      print(_allReactions[_selectedReaction].name);
      if (_allReactions[_selectedReaction].name == "SendMail") {
        return Column(
          children: <Widget>[
            textFormParam(context, "Reaction Param", _controllerReactionParam,
                "Please enter a param"),
            textFormParam(context, "Reaction Param",
                _controllerReactionExtra1Param, "Please enter a param"),
            textFormParam(context, "Reaction Param",
                _controllerReactionExtra2Param, "Please enter a param"),
          ],
        );
      } else {
        return textFormParam(context, "Reaction Param",
            _controllerReactionParam, "Please enter a param");
      }
    }
    return Container();
  }

  createArea() async {
    print("Validate Area");
    var name = _controllerName.text;
    var action = _allActions[_selectedAction].name;
    var reaction = _allReactions[_selectedReaction].name;
    String actionArgs = "";
    var reactionArgs = <String>[];

    if (_allActions[_selectedAction].args.isNotEmpty) {
      actionArgs = _controllerActionParam.text;
    }
    if (_allReactions[_selectedReaction].args.isNotEmpty) {
      for (var i = 0; i < _allReactions[_selectedReaction].args.length; i++) {
        switch (i) {
          case 0:
            reactionArgs.add(_controllerReactionParam.text);
            break;
          case 1:
            reactionArgs.add(_controllerReactionExtra1Param.text);
            break;
          case 2:
            reactionArgs.add(_controllerReactionExtra2Param.text);
            break;
          default:
        }
      }
    }
    print(name);
    print(action);
    print(actionArgs);
    print(reaction);
    print(reactionArgs);
    Area newArea =
        Area(name, action, actionArgs, reaction, reactionArgs, "", "", "");
    AreaService().addNewArea(_uid, newArea);
    Navigator.popAndPushNamed(context, "/services");
  }
}
