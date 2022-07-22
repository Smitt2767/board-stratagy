import React from "react";
import AddNewRawButton from "../../components/board/AddNewRawButton";
import BoardComponent from "../../components/board/Board";

const Board = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-2">
      <div className="container mx-auto mt-16">
        <BoardComponent />
        <div className="flex items-center justify-center">
          <AddNewRawButton />
        </div>
      </div>
    </div>
  );
};

export default Board;
