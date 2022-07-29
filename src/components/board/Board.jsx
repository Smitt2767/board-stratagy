import React, { useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { keys } from "../../constants";
import {
  clear,
  copy,
  deleteCard,
  mergeCards,
  paste,
  reOrderCardsBetweenRows,
  reOrderCardsWithinRow,
} from "../../store/actions";
import { getOS } from "../../utils";
import Row from "./Row";

const Container = styled.div`
  ::-webkit-scrollbar {
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(75, 85, 99, 0.397);
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(75, 85, 99);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(66, 80, 99);
  }
`;

const Board = () => {
  const { rows, cards } = useSelector((state) => state.board);

  const dispatch = useDispatch();

  useEffect(() => {
    const keyListener = (e) => {
      const key = keys[getOS()];

      if (key && e[key]) {
        if (e.keyCode === 67) {
          //copy
          dispatch(copy());
        }
        if (e.keyCode === 86) {
          //paste
          dispatch(paste());
        }
        if (e.keyCode === 32 || e.keyCode === 8) {
          //paste
          dispatch(mergeCards());
        }
      }

      if (e.keyCode === 46) {
        dispatch(deleteCard());
      }
    };

    document.addEventListener("keydown", keyListener);

    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, [dispatch]);

  const handleDragEnd = (result) => {
    const { draggableId, destination, source } = result;

    if (!destination) return;

    // check if belongs to same row & index of the card is same then return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (source.droppableId === destination.droppableId) {
      // Get current row
      const row = rows[source.droppableId];
      if (!row) return;

      // make copy of the card ids
      const newCardIds = [...row.cardIds];

      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      dispatch(
        reOrderCardsWithinRow({
          rowId: row.id,
          cardIds: newCardIds,
        })
      );
    } else {
      const cardColSpan = cards[draggableId].colSpan;
      const start = rows[source.droppableId],
        end = rows[destination.droppableId];

      const newStartCardIds = [...start.cardIds],
        newEndCardIds = [...end.cardIds];

      let removeTotalCardsLength = 0;
      let totalColSpan = 0;

      for (let i = destination.index; i < newEndCardIds.length; i++) {
        const total = totalColSpan + cards[newEndCardIds[i]].colSpan;
        if (totalColSpan === cardColSpan) break;
        else if (total <= cardColSpan) {
          totalColSpan = total;
          removeTotalCardsLength++;
        } else {
          break;
        }
      }

      if (totalColSpan !== cardColSpan) return;

      const removedIds = newEndCardIds.splice(
        destination.index,
        removeTotalCardsLength,
        draggableId
      );

      newStartCardIds.splice(source.index, 1, ...removedIds);

      dispatch(
        reOrderCardsBetweenRows({
          start: {
            rowId: start.id,
            cardIds: newStartCardIds,
          },
          end: {
            rowId: end.id,
            cardIds: newEndCardIds,
          },
        })
      );
    }
  };

  const rowsLength = Object.keys(rows).length;

  const handleClear = () => {
    dispatch(clear());
  };

  return (
    <Container className="mb-5 w-full overflow-x-auto relative pb-1 pt-5">
      <div className="flex justify-end">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-gray-500 text-sm inline-block transition-all duration-500 uppercase font-medium hover:text-gray-50"
        >
          Clear
        </button>
      </div>
      <div className={rowsLength ? "" : ""}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {[...Object.keys(rows)].map((id) => (
            <Row {...rows[id]} key={id} />
          ))}
        </DragDropContext>
      </div>
    </Container>
  );
};

export default Board;
