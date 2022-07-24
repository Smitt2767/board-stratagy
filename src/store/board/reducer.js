import { cards, colors, rows } from "../../constants";
import { Card, Row } from "../../utils/board";
import {
  ADD_NEW_ROW,
  ADD_SELECTED_CARD,
  DELETE_CARD,
  MERGE_CARDS,
  PASTE_CARD,
  REMOVE_SELECTED_CARD,
  REORDER_CARDS_BETWEEN_ROWS,
  REORDER_CARDS_WITHIN_ROW,
  SEPARATE_CARD,
  SET_CARD_DATA,
  SET_COPY_CARD_ID,
} from "./actionTypes";

const initialState = {
  selectedRowId: "",
  selectedCards: {},
  cards: { ...cards },
  rows: { ...rows },
  copyCardId: "",
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

      // change colSpan of first card
      const newCards = {
        ...state.cards,
        [selectedCards[firstCardIndex]]: {
          ...state.cards[selectedCards[firstCardIndex]],
          colSpan,
        },
      };

      // keep only first cardId and remove all other cardId from the array
      const tempCardIds = [];
      newCardIds.forEach((cardId, index) => {
        if (index <= firstCardIndex || index > lastCardIndex) {
          tempCardIds.push(cardId);
        } else {
          delete newCards[cardId];
        }
      });

      newCardIds = [...tempCardIds];

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
    case REORDER_CARDS_WITHIN_ROW: {
      const { rowId, cardIds } = payload;
      return {
        ...state,
        rows: {
          ...state.rows,
          [rowId]: {
            ...state.rows[rowId],
            cardIds,
          },
        },
      };
    }
    case REORDER_CARDS_BETWEEN_ROWS: {
      const { start, end } = payload;
      return {
        ...state,
        rows: {
          ...state.rows,
          [start.rowId]: {
            ...state.rows[start.rowId],
            cardIds: start.cardIds,
          },
          [end.rowId]: {
            ...state.rows[end.rowId],
            cardIds: end.cardIds,
          },
        },
      };
    }

    case SET_COPY_CARD_ID: {
      return {
        ...state,
        copyCardId: payload,
      };
    }
    case PASTE_CARD: {
      const copiedCard = state.cards[state.copyCardId];
      const pasteCard = {
        ...state.cards[payload],
        hasData: true,
        title: copiedCard.title,
        description: copiedCard.description,
        color: copiedCard.color,
      };
      return {
        ...state,
        cards: {
          ...state.cards,
          [payload]: pasteCard,
        },
      };
    }
    case SEPARATE_CARD: {
      const { rowId, cardId } = payload;
      const newCardIds = [...state.rows[rowId].cardIds];
      const card = state.cards[cardId];
      const colSpan = card.colSpan;
      const indexOfCard = newCardIds.indexOf(cardId);

      const newAddCards = [...Array(colSpan - 1).keys()].map(() => new Card());
      const newCards = {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          colSpan: 1,
        },
      };
      newAddCards.forEach((card) => {
        newCards[card.id] = card;
      });
      newCardIds.splice(
        indexOfCard + 1,
        0,
        ...newAddCards.map((card) => card.id)
      );

      return {
        ...state,
        cards: newCards,
        rows: {
          ...state.rows,
          [rowId]: {
            ...state.rows[rowId],
            cardIds: newCardIds,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default boardReducer;
