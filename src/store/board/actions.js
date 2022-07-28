import {
  ADD_NEW_ROW,
  ADD_SELECTED_CARD,
  CLEAR,
  COPY,
  DELETE_CARD,
  MERGE_CARDS,
  PASTE,
  PASTE_CARD,
  REMOVE_SELECTED_CARD,
  REORDER_CARDS_BETWEEN_ROWS,
  REORDER_CARDS_WITHIN_ROW,
  SELECT_CARD,
  SEPARATE_CARD,
  SET_CARD_DATA,
  SET_COPY_CARD_ID,
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

export const setCopyCardId = (data) => ({
  type: SET_COPY_CARD_ID,
  payload: data,
});

export const pasteCard = (data) => ({
  type: PASTE_CARD,
  payload: data,
});

export const separateCard = (data) => ({
  type: SEPARATE_CARD,
  payload: data,
});

export const clear = () => ({
  type: CLEAR,
});

export const setSelectCard = (data) => ({
  type: SELECT_CARD,
  payload: data,
});

export const copy = () => ({
  type: COPY,
});

export const paste = () => ({
  type: PASTE,
});
