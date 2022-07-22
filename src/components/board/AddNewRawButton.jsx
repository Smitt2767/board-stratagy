import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addNewRow } from "../../store/actions";

const AddNewRawButton = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(addNewRow());
  };

  return (
    <button className="flex items-center p-3 text-gray-400 hover:text-gray-50 text-sm transition-all duration-500 outline-none">
      <AiOutlinePlus />
      <span className="ml-2" onClick={handleClick}>
        Add New Row
      </span>
    </button>
  );
};

export default AddNewRawButton;
