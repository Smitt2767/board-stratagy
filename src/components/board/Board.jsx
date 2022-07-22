import React from "react";
import { useSelector } from "react-redux";
import Row from "./Row";

const Board = () => {
  const { rows } = useSelector((state) => state.board);

  return (
    <div className="flex flex-col mb-5 gap-2">
      {[...Object.keys(rows)].map((id) => (
        <Row {...rows[id]} key={id} />
      ))}
    </div>
  );
};

export default Board;
