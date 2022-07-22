import {
  ADD_NEW_ROW,
  ADD_SELECTED_CARD,
  MERGE_CARDS,
  REMOVE_SELECTED_CARD,
  SET_CARD_DATA,
} from "./actionTypes";

export const addNewRow = () => ({
  type: ADD_NEW_ROW,
});

export const addSelectedCard = (data) => ({
  type: ADD_SELECTED_CARD,
  payload: data,
});

export const removeSelectedCard = (data) => ({
  type: REMOVE_SELECTED_CARD,
  payload: data,
});

export const mergeCards = () => ({
  type: MERGE_CARDS,
});

export const setCardData = (data) => ({
  type: SET_CARD_DATA,
  payload: data,
});
