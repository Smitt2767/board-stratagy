import React, { useEffect, useId, useRef } from "react";
import { modes, colors } from "../../constants";
import Modal from "../common/Modal";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Input from "../common/Input";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCardData } from "../../store/board/actions";

const initialValues = {
  id: "",
  title: "",
  description: "",
  color: "",
};

const Button = styled.button`
  background-color: ${({ color }) => color};
  &:hover,
  &.active {
    --tw-ring-color: ${({ color }) => color};
  }
`;

const AddEditCardModal = ({ isOpen, onClose, cardId, mode }) => {
  const { cards } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  const id = useId();
  const titleRef = useRef();

  const onSubmit = (values) => {
    dispatch(
      setCardData({
        ...values,
      })
    );
    onClose();
  };

  const { values, handleSubmit, handleChange, setFieldValue, resetForm } =
    useFormik({
      initialValues,
      onSubmit,
    });

  useEffect(() => {
    if (isOpen) {
      titleRef.current && titleRef.current.focus();

      const card = cards[cardId];

      resetForm({
        values: {
          id: card.id,
          title: card.title,
          description: card.description,
          color: card.color,
        },
      });
    }
  }, [cards, isOpen, cardId, resetForm]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <Modal.Header>{mode === modes.ADD ? "Add" : "Edit"} Card</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} id={id}>
          <Input
            name="title"
            value={values.title}
            placeholder="Enter Heading"
            onChange={handleChange}
            ref={titleRef}
          />
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Enter Text"
            rows={5}
            className="bg-gray-600 w-full outline-none border-[0.5px] border-gray-500 px-3 py-1 rounded-md mb-3"
          ></textarea>
          <div className="bg-gray-600 rounded-md border-[0.5px] border-gray-500 p-3 w-[70%]">
            <div className="flex mb-3">
              {colors.map((color) => (
                <Button
                  type="button"
                  className={`h-7 w-7 mr-2 rounded-sm hover:scale-[1.15] transition-all duration-500 ${
                    values.color === color
                      ? "active scale-[1.15] shadow-lg shadow-black/50"
                      : ""
                  }`}
                  key={color}
                  color={color}
                  onClick={() => {
                    setFieldValue("color", color);
                  }}
                />
              ))}
            </div>
            <div className="grid grid-cols-12 bg-gray-700 w-[60%] rounded-sm border-[1px] border-gray-400 h-8">
              <div className="col-span-2 flex items-center justify-center border-r-[1px] border-gray-400">
                <span>#</span>
              </div>
              <input
                className="bg-transparent col-span-10 outline-none px-3 tracking-wide"
                value={values.color.replace("#", "").toUpperCase()}
                onChange={(e) => {
                  setFieldValue("color", `#${e.target.value}`);
                }}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="px-3 py-1 rounded-lg shadow-sm hover:bg-red-600 transition-all duration-500 bg-red-500 mr-3"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
        <button
          type="submit"
          form={id}
          className="px-3 py-1 rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-500 bg-blue-500"
        >
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditCardModal;
