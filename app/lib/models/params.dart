// Class Params
//  Name                 define the text display of params name
//  tokenName            define the fields name of token in FireStore Bdd
class Params {
  String serviceName;
  String name;
  String description;
  List<String> args;

  Params(this.serviceName, this.name, this.description) : args = [];
}
