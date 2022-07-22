import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  reOrderCardsBetweenRows,
  reOrderCardsWithinRow,
} from "../../store/actions";
import Row from "./Row";

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

      const removedIds = newEndCardIds.splice(
        destination.index,
        cardColSpan,
        draggableId
      );

      const removedFirstCard = cards[removedIds[0]];

      if (removedFirstCard.colSpan !== cardColSpan) return;

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

  return (
    <div className="flex flex-col mb-5 relative">
      <DragDropContext onDragEnd={handleDragEnd}>
        {[...Object.keys(rows)].map((id) => (
          <Row {...rows[id]} key={id} />
        ))}
      </DragDropContext>
    </div>
  );
};

export default Board;
