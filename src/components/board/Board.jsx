import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  reOrderCardsBetweenRows,
  reOrderCardsWithinRow,
} from "../../store/actions";
import Row from "./Row";

const Container = styled.div`
  ::-webkit-scrollbar {
    height: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgba(75, 85, 99, 0.397);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(75, 85, 99);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(66, 80, 99);
  }
`;

const Board = () => {
  const { rows, cards } = useSelector((state) => state.board);
  const dispatch = useDispatch();

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

  return (
    <Container className="mb-5 w-full overflow-x-auto relative pb-2">
      <div className={rowsLength ? "w-[1500px]" : ""}>
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
