import 'package:app/utils/design.dart';
import 'package:app/utils/functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:ui';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  // Design login UI var
  late AnimationController controller1;
  late AnimationController controller2;
  late Animation<double> animation1;
  late Animation<double> animation2;
  late Animation<double> animation3;
  late Animation<double> animation4;

  // Page var
  final TextEditingController _controllerEmail = TextEditingController();
  final TextEditingController _controllerPass = TextEditingController();
  @override
  void initState() {
    super.initState();

    controller1 = AnimationController(
      vsync: this,
      duration: Duration(
        seconds: 5,
      ),
    );
    animation1 = Tween<double>(begin: .1, end: .15).animate(
      CurvedAnimation(
        parent: controller1,
        curve: Curves.easeInOut,
      ),
    )
      ..addListener(() {
        setState(() {});
      })
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          controller1.reverse();
        } else if (status == AnimationStatus.dismissed) {
          controller1.forward();
        }
      });
    animation2 = Tween<double>(begin: .02, end: .04).animate(
      CurvedAnimation(
        parent: controller1,
        curve: Curves.easeInOut,
      ),
    )..addListener(() {
        setState(() {});
      });

    controller2 = AnimationController(
      vsync: this,
      duration: Duration(
        seconds: 5,
      ),
    );
    animation3 = Tween<double>(begin: .41, end: .38).animate(CurvedAnimation(
      parent: controller2,
      curve: Curves.easeInOut,
    ))
      ..addListener(() {
        setState(() {});
      })
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) {
          controller2.reverse();
        } else if (status == AnimationStatus.dismissed) {
          controller2.forward();
        }
      });
    animation4 = Tween<double>(begin: 170, end: 190).animate(
      CurvedAnimation(
        parent: controller2,
        curve: Curves.easeInOut,
      ),
    )..addListener(() {
        setState(() {});
      });

    Timer(Duration(milliseconds: 2500), () {
      controller1.forward();
    });

    controller2.forward();
  }

  @override
  void dispose() {
    controller1.dispose();
    controller2.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Design().blackBackground,
      body: ScrollConfiguration(
        behavior: MyBehavior(),
        child: SingleChildScrollView(
          child: SizedBox(
            height: size.height,
            child: Stack(
              children: [
                Positioned(
                  top: size.height * (animation2.value + .58),
                  left: size.width * .21,
                  child: CustomPaint(
                    painter: MyPainter(50),
                  ),
                ),
                Positioned(
                  top: size.height * .98,
                  left: size.width * .1,
                  child: CustomPaint(
                    painter: MyPainter(animation4.value - 30),
                  ),
                ),
                Positioned(
                  top: size.height * .5,
                  left: size.width * (animation2.value + .8),
                  child: CustomPaint(
                    painter: MyPainter(30),
                  ),
                ),
                Positioned(
                  top: size.height * animation3.value,
                  left: size.width * (animation1.value + .1),
                  child: CustomPaint(
                    painter: MyPainter(60),
                  ),
                ),
                Positioned(
                  top: size.height * .1,
                  left: size.width * .8,
                  child: CustomPaint(
                    painter: MyPainter(animation4.value),
                  ),
                ),
                Column(
                  children: [
                    Expanded(
                      flex: 5,
                      child: Padding(
                        padding: EdgeInsets.only(top: size.height * .1),
                        child: Text(
                          'Area Potter',
                          style: TextStyle(
                            color: Colors.white.withOpacity(.7),
                            fontSize: 60,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                            wordSpacing: 4,
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 7,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(15),
                            child: BackdropFilter(
                              filter: ImageFilter.blur(
                                sigmaY: 15,
                                sigmaX: 15,
                              ),
                              child: Container(
                                height: size.width / 7,
                                width: size.width / 1.2,
                                alignment: Alignment.center,
                                padding:
                                    EdgeInsets.only(right: size.width / 30),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(.05),
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: TextField(
                                  controller: _controllerEmail,
                                  style: TextStyle(
                                      fontSize: 25,
                                      color: Colors.white.withOpacity(.8)),
                                  cursorColor: Colors.white,
                                  keyboardType: TextInputType.emailAddress,
                                  decoration: InputDecoration(
                                    prefixIcon: Icon(
                                      Icons.email_outlined,
                                      color: Colors.white.withOpacity(.7),
                                    ),
                                    border: InputBorder.none,
                                    hintMaxLines: 1,
                                    hintText: "Email...",
                                    hintStyle: TextStyle(
                                        fontSize: 25,
                                        color: Colors.white.withOpacity(.5)),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(15),
                            child: BackdropFilter(
                              filter: ImageFilter.blur(
                                sigmaY: 15,
                                sigmaX: 15,
                              ),
                              child: Container(
                                height: size.width / 7,
                                width: size.width / 1.2,
                                alignment: Alignment.center,
                                padding:
                                    EdgeInsets.only(right: size.width / 30),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(.05),
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: TextField(
                                  controller: _controllerPass,
                                  style: TextStyle(
                                      fontSize: 25,
                                      color: Colors.white.withOpacity(.8)),
                                  cursorColor: Colors.white,
                                  obscureText: true,
                                  keyboardType: TextInputType.text,
                                  decoration: InputDecoration(
                                    prefixIcon: Icon(
                                      Icons.lock_outline,
                                      color: Colors.white.withOpacity(.7),
                                    ),
                                    border: InputBorder.none,
                                    hintMaxLines: 1,
                                    hintText: "Password...",
                                    hintStyle: TextStyle(
                                        fontSize: 25,
                                        color: Colors.white.withOpacity(.5)),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              component2(
                                'Login',
                                2.58,
                                () async {
                                  HapticFeedback.lightImpact();
                                  try {
                                    UserCredential userCredential =
                                        await FirebaseAuth.instance
                                            .signInWithEmailAndPassword(
                                                email: _controllerEmail.text,
                                                password: _controllerPass.text);
                                    Navigator.pushNamedAndRemoveUntil(
                                        context, "/account", (route) => false);
                                  } on FirebaseAuthException catch (e) {
                                    if (e.code == 'user-not-found') {
                                      print('No user found for that email.');
                                    } else if (e.code == 'wrong-password') {
                                      print(
                                          'Wrong password provided for that user.');
                                    }
                                  }
                                  // Fluttertoast.showToast(
                                  //     msg: 'Login button pressed');
                                },
                              ),
                              //SizedBox(width: size.width / 20),
                              // component2(
                              //   'Forgotten password!',
                              //   2.58,
                              //   () {
                              //     HapticFeedback.lightImpact();
                              //     Fluttertoast.showToast(
                              //         msg: 'Forgotten password button pressed');
                              //   },
                              // ),
                            ],
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "If you don't have account",
                                style: TextStyle(
                                    fontSize: 20,
                                    color: Colors.white.withOpacity(0.6)),
                              ),
                              SizedBox(width: size.width / 20),
                              InkWell(
                                child: Text(
                                  "Create new account",
                                  style: TextStyle(
                                    fontSize: 20,
                                    color: Colors.white.withOpacity(0.8),
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                onTap: () {
                                  Navigator.popAndPushNamed(
                                      context, "/inscription");
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      flex: 6,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          component3(
                            () async {
                              HapticFeedback.lightImpact();
                              UserCredential user =
                                  await ServiceAuth().signInWithGoogle();
                              print("LOGIN GOOGLE OK");
                              if (user.user?.uid != null) {
                                Navigator.pushNamed(context, '/account');
                              }
                            },
                          ),
                          SizedBox(height: size.height * .05),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
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
            height: size.width / 7,
            width: size.width / 1.8,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(.05),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Text(
              string,
              style: TextStyle(
                fontSize: 30,
                color: Colors.white.withOpacity(.8),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget loginGoogle(size) {
    return InkWell(
      child: Container(
        decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(Radius.circular(20))),
        child: Row(children: <Widget>[
          Container(
            alignment: Alignment.center,
            child: Image.asset('assets/logo_google.png', fit: BoxFit.contain),
          ),
          Container(
            padding: const EdgeInsets.all(5),
            child: const Text(
              'Sign in with Google',
              style: TextStyle(
                fontSize: 30,
              ),
            ),
          )
        ]),
      ),
    );
  }

  Widget component3(VoidCallback voidCallback) {
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
            height: size.width / 7,
            width: 250,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(.05),
              borderRadius: BorderRadius.circular(15),
            ),
            child: loginGoogle(size),
          ),
        ),
      ),
    );
  }
}
