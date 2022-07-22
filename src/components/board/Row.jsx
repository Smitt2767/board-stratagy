import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { RiMergeCellsHorizontal } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { mergeCards } from "../../store/actions";
import { Droppable } from "react-beautiful-dnd";

// Droppable
const Row = ({ cardIds, id }) => {
  const { cards, selectedRowId, selectedCards } = useSelector(
    (state) => state.board
  );
  const isAllowedToMerge =
    selectedRowId === id && Object.keys(selectedCards).length > 1;

  const dispatch = useDispatch();

  const handleMergeCards = () => {
    dispatch(mergeCards());
  };

  return (
    <Droppable droppableId={id} type="column" direction="horizontal">
      {(provided) => (
        <div
          className="grid grid-cols-12 h-16 overflow-hidden my-[3px]"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {cardIds.map((cardId, index) => (
            <Card {...cards[cardId]} key={cardId} rowId={id} index={index} />
          ))}
          {provided.placeholder}
          <button
            className={`absolute -right-6 bg-gray-200 hover:bg-white text-black text-lg p-0.5 transition-all duration-500 rounded-sm ${
              isAllowedToMerge ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            onClick={handleMergeCards}
          >
            <RiMergeCellsHorizontal />
          </button>
        </div>
      )}
    </Droppable>
  );
};

export default Row;
