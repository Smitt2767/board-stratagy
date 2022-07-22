import { colors } from "../../constants";
import { Card, Row } from "../../utils/board";
import {
  ADD_NEW_ROW,
  ADD_SELECTED_CARD,
  DELETE_CARD,
  MERGE_CARDS,
  REMOVE_SELECTED_CARD,
  SET_CARD_DATA,
} from "./actionTypes";

const initialState = {
  selectedRowId: "",
  selectedCards: {},
  cards: {},
  rows: {},
};

const boardReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_NEW_ROW: {
      const newCards = { ...state.cards };
      const newRows = { ...state.rows };

      // create cards arr
      const cards = [...Array(12).keys()].map(() => new Card());

      // Add cards to newCards obj
      cards.forEach((card) => {
        newCards[card.id] = card;
      });

      // create cardIds arr
      const cardIds = cards.map((card) => card.id);

      // create and add row to newRows obj
      const row = new Row(cardIds);
      newRows[row.id] = row;

      return {
        ...state,
        cards: newCards,
        rows: newRows,
      };
    }
    case ADD_SELECTED_CARD: {
      const { cardId, rowId } = payload;

      // Check if already have selected row & current card not belongs to that row then return current state
      if (!!state.selectedRowId && state.selectedRowId !== rowId) return state;

      const newSelectedCards = { ...state.selectedCards };

      // Check if there is no cards then add new card in list

      const { cardIds } = state.rows[rowId];

      if (!Object.keys(newSelectedCards).length) {
        newSelectedCards[cardIds.indexOf(cardId)] = cardId;
      } else {
        // get the first and last index of from the selected cards
        const indexes = [...Object.keys(newSelectedCards)].map((id) => +id);

        const firstCardIndex = indexes[0];
        const lastCardIndex = indexes[indexes.length - 1];

        // check if the selected card is sibling
        if (
          [cardIds[firstCardIndex - 1], cardIds[lastCardIndex + 1]].includes(
            cardId
          )
        ) {
          newSelectedCards[cardIds.indexOf(cardId)] = cardId;
        } else {
          return state;
        }
      }

      return {
        ...state,
        selectedRowId: rowId,
        selectedCards: newSelectedCards,
      };
    }
    case REMOVE_SELECTED_CARD: {
      let selectedRowId = state.selectedRowId;
      const { cardId } = payload;

      let newSelectedCards = { ...state.selectedCards };

      // remove the key from the selectedCards object
      Object.entries(newSelectedCards).forEach(([key, value]) => {
        if (value === cardId) {
          delete newSelectedCards[key];
        }
      });

      // if there is no selected cards then reset selectedRowId & newSelectedCards
      if (!Object.values(newSelectedCards).length) {
        selectedRowId = "";
        newSelectedCards = {};
      }

      return {
        ...state,
        selectedRowId,
        selectedCards: newSelectedCards,
      };
    }
    case MERGE_CARDS: {
      const rowId = state.selectedRowId;
      const selectedCards = { ...state.selectedCards };

      if (!rowId) return state;

      let newCardIds = [...state.rows[rowId].cardIds];

      // get the first and last index of from the selected cards
      const indexes = [...Object.keys(selectedCards)].map((id) => +id);

      const firstCardIndex = indexes[0];
      const lastCardIndex = indexes[indexes.length - 1];

      // Add all the selectedCards colSpan value
      const colSpan = [...Object.values(selectedCards)].reduce((a, b) => {
        return a + state.cards[b].colSpan;
      }, 0);

      // keep only first cardId and remove all other cardId from the array
      newCardIds = newCardIds.filter(
        (_, index) => index <= firstCardIndex || index > lastCardIndex
      );

      // change colSpan of first card
      const newCards = {
        ...state.cards,
        [selectedCards[firstCardIndex]]: {
          ...state.cards[selectedCards[firstCardIndex]],
          colSpan,
        },
      };

      // update rows data
      const newRows = {
        ...state.rows,
        [rowId]: {
          ...state.rows[rowId],
          cardIds: newCardIds,
        },
      };

      return {
        ...state,
        selectedRowId: "",
        selectedCards: {},
        rows: newRows,
        cards: newCards,
      };
    }
    case SET_CARD_DATA: {
      const { id, title, description, color } = payload;

      return {
        ...state,
        cards: {
          ...state.cards,
          [id]: {
            ...state.cards[id],
            title,
            description,
            color,
            hasData: true,
          },
        },
      };
    }
    case DELETE_CARD: {
      const { cardId } = payload;

      return {
        ...state,
        cards: {
          ...state.cards,
          [cardId]: {
            ...state.cards[cardId],
            title: "",
            description: "",
            color: colors[0],
            hasData: false,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default boardReducer;
