import { combineReducers } from "redux";
import board from "./board/reducer";

const rootReducer = combineReducers({
  board,
});

export default rootReducer;
