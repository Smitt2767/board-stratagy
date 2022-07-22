import {
  ADD_NEW_ROW,
  ADD_SELECTED_CARD,
  DELETE_CARD,
  MERGE_CARDS,
  REMOVE_SELECTED_CARD,
  REORDER_CARDS_BETWEEN_ROWS,
  REORDER_CARDS_WITHIN_ROW,
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

export const deleteCard = (data) => ({
  type: DELETE_CARD,
  payload: data,
});

export const reOrderCardsWithinRow = (data) => ({
  type: REORDER_CARDS_WITHIN_ROW,
  payload: data,
});

export const reOrderCardsBetweenRows = (data) => ({
  type: REORDER_CARDS_BETWEEN_ROWS,
  payload: data,
});
