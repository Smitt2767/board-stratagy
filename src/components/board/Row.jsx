import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { Droppable } from "react-beautiful-dnd";

// Droppable
const Row = ({ cardIds, id }) => {
  const { cards } = useSelector((state) => state.board);

  return (
    <Droppable droppableId={id} type="column" direction="horizontal">
      {(provided) => (
        <div
          className="grid grid-cols-12 h-16 overflow-hidden my-[6px]"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {cardIds.map((cardId, index) => (
            <Card {...cards[cardId]} key={cardId} rowId={id} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Row;
