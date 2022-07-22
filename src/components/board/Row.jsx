import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { RiMergeCellsHorizontal } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { mergeCards } from "../../store/actions";

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
    <div className="grid grid-cols-12 gap-2">
      {cardIds.map((cardId) => (
        <Card {...cards[cardId]} key={cardId} rowId={id} />
      ))}

      <button
        className={`absolute -right-8 bg-white text-black text-lg p-0.5 transition-all duration-500 ${
          isAllowedToMerge ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        onClick={handleMergeCards}
      >
        <RiMergeCellsHorizontal />
      </button>
    </div>
  );
};

export default Row;
