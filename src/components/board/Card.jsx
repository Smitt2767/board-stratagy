import { motion } from "framer-motion";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { modes } from "../../constants";
import { addSelectedCard, removeSelectedCard } from "../../store/board/actions";
import { getOS, OS } from "../../utils";
import AddEditCardModal from "./AddEditCardModal";
import CardDetailsModal from "./CardDetailsModal";

const sizes = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const getKey = {
  [OS.WINDOWS]: "ctrlKey",
  [OS.LINUX]: "ctrlKey",
  [OS.MAC]: "metaKey",
};

const initialModalState = {
  isOpen: false,
  cardId: "",
};

const initialDetailsModalState = {
  isOpen: false,
  cardId: "",
};

const CardContainer = motion(styled.div`
  background-color: ${({ color }) => color};
`);

// Draggable
const Card = ({
  id,
  hasData,
  colSpan,
  rowId,
  title,
  description,
  color,
  index,
}) => {
  const { selectedCards } = useSelector((state) => state.board);
  const selectedCardsArr = Object.values(selectedCards);
  const isSelected = selectedCardsArr.includes(id);

  const [modalData, setModalData] = useState({ ...initialModalState });

  const [cardDetailsModalData, setCardDetailsModalData] = useState({
    ...initialDetailsModalState,
  });

  const dispatch = useDispatch();

  const add = () => {
    dispatch(
      addSelectedCard({
        rowId,
        cardId: id,
      })
    );
  };

  const remove = () => {
    dispatch(
      removeSelectedCard({
        cardId: id,
      })
    );
  };

  const handleAddEditCard = () => {
    setModalData((prev) => ({
      ...prev,
      isOpen: true,
      cardId: id,
    }));
  };

  const handleModalClose = () => {
    setModalData({
      ...initialModalState,
    });
  };

  const handleAddBtnClick = (e) => {
    const key = getKey[getOS()];

    if (key && e[key]) {
      if (!selectedCardsArr.length) add();
      else {
        if (!isSelected) add();
        else remove();
      }
    } else {
      handleAddEditCard();
    }
  };

  const handleClick = () => {
    setCardDetailsModalData({
      cardId: id,
      isOpen: true,
    });
  };

  const handleDetailsModalClose = () => {
    setCardDetailsModalData({
      cardId: "",
      isOpen: false,
    });
  };

  return (
    <>
      <CardDetailsModal
        {...cardDetailsModalData}
        onClose={handleDetailsModalClose}
      />
      <AddEditCardModal
        mode={modes.ADD}
        {...modalData}
        onClose={handleModalClose}
      />
      <Draggable draggableId={id} index={index} isDragDisabled={!hasData}>
        {(provided, snapshot) =>
          hasData ? (
            <div
              className={`${sizes[colSpan]} `}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <CardContainer
                className="h-16 mx-[3px] flex items-center justify-center flex-col cursor-pointer rounded-[3px] px-1 overflow-hidden"
                color={color}
                onClick={handleClick}
                {...(snapshot.isDragging || snapshot.isDropAnimating
                  ? {}
                  : { layoutId: id })}
              >
                <motion.p
                  {...(snapshot.isDragging
                    ? {}
                    : { layoutId: `heading_${id}` })}
                  className={`${
                    !!description ? "text-sm" : "text-lg"
                  } truncate`}
                >
                  {title}
                </motion.p>
                {!!description && (
                  <motion.p
                    {...(snapshot.isDragging
                      ? {}
                      : { layoutId: `description_${id}` })}
                    className="text-[10px] truncate text-gray-100"
                  >
                    {description}
                  </motion.p>
                )}
              </CardContainer>
            </div>
          ) : (
            <div
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              ref={provided.innerRef}
              className={`border-2 mx-[3px] border-dashed h-16 flex items-center justify-center rounded-[3px] cursor-pointer hover:border-white transition-colors duration-500 hover:text-white ${
                sizes[colSpan]
              } ${isSelected ? "border-white text-white" : "border-gray-600"}`}
              onClick={handleAddBtnClick}
            >
              <AiOutlinePlus />
            </div>
          )
        }
      </Draggable>
    </>
  );
};

export default Card;
