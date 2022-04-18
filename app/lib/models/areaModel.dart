class Area {
  final String name;
  final String action;
  final String reaction;
  final String actionParams;
  final List<String> reactionParams;
  final String id;
  final String actionService;
  final String reactionService;

  Area(this.name, this.action, this.actionParams, this.reaction,
      this.reactionParams, this.id, this.actionService, this.reactionService);

  Area.fromJson(Map<String, dynamic> json, idArea)
      : name = json.containsKey('name') ? json['name'] : "",
        action = json.containsKey('action') ? json['action'] : "",
        reaction = json.containsKey('reaction') ? json['reaction'] : "",
        actionParams =
            json.containsKey('actionParams') ? json['actionParams'] : "",
        reactionParams = json.containsKey('reactionParams')
            ? List<String>.from(json['reactionParams'])
            : <String>[],
        id = idArea,
        actionService =
            json.containsKey('actionService') ? json['actionService'] : "",
        reactionService =
            json.containsKey('reactionService') ? json['reactionService'] : "";
}
