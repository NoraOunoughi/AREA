export class Action {
    constructor(service, name, description) {
      this.service = service;
      this.name = name;
      this.description = description;
      this.args = [];
    }
}

export class Reaction {
  constructor(service, name, description) {
    this.service = service;
    this.name = name;
    this.description = description;
    this.args = [];
  }
}