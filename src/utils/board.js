import { v4 as uuidV4 } from "uuid";
import { colors } from "../constants";

export class Card {
  constructor() {
    this.id = uuidV4();
    this.title = "";
    this.description = "";
    this.color = colors[0];
    this.hasData = false;
    this.colSpan = 1;
  }
}

export class Row {
  constructor(cardIds) {
    this.id = uuidV4();
    this.cardIds = [...cardIds];
  }
}
