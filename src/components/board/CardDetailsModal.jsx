import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { BiDotsVerticalRounded } from "react-icons/bi";
import DropDown from "../common/DropDown";
import { modes } from "../../constants";
import AddEditCardModal from "./AddEditCardModal";
import { useDispatch } from "react-redux";
import { deleteCard, setCopyCardId } from "../../store/actions";

const Container = motion(styled.div`
  background-color: ${({ color }) => color};
`);

const users = ["Katherine Ray", "Olive Yev", "Page Legge"];

const initialModalState = {
  isOpen: false,
  cardId: "",
};

const CardDetailsDropDown = ({ cardId, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({ ...initialModalState });

  const dispatch = useDispatch();

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleEdit = () => {
    setModalData({
      isOpen: true,
      cardId,
    });
  };

  const handleModalClose = () => {
    setModalData({
      ...initialModalState,
    });
  };

  const handleDelete = () => {
    dispatch(
      deleteCard({
        cardId,
      })
    );
    onClose();
  };
  const handleCopy = () => {
    dispatch(setCopyCardId(cardId));
    onClose();
  };

  return (
    <>
      <AddEditCardModal
        mode={modes.EDIT}
        {...modalData}
        onClose={handleModalClose}
      />
      <div className="absolute right-4">
        <DropDown isOpen={isOpen} toggle={toggle}>
          <DropDown.Toggle className="flex items-center justify-center">
            <BiDotsVerticalRounded />
          </DropDown.Toggle>
          <DropDown.Menu>
            <DropDown.Item onClick={handleEdit}>Edit</DropDown.Item>
            <DropDown.Item onClick={handleDelete}>Delete</DropDown.Item>
            <DropDown.Item onClick={handleCopy}>Copy</DropDown.Item>
          </DropDown.Menu>
        </DropDown>
      </div>
    </>
  );
};

const LineClamped = motion(styled.p`
  display: -webkit-box;
  -webkit-line-clamp: ${({ clamp = 3 }) => clamp};
  -webkit-box-orient: vertical;
  overflow: hidden;
`);

const CardDetailsModal = ({ cardId, isOpen, onClose }) => {
  const { cards } = useSelector((state) => state.board);

  const card = cards[cardId];

  const handleOutsideClick = (e) => {
    if ([...e.target.classList].includes("close")) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 flex items-center justify-center close bg-black/40 overflow-hidden"
            onClick={handleOutsideClick}
          >
            <Container
              layoutId={cardId}
              color={card.color}
              className={`max-w-lg w-full mx-auto rounded-lg z-10 shadow-lg shadow-black/5 p-4 relative`}
            >
              <CardDetailsDropDown cardId={cardId} onClose={onClose} />
              <div className="h-40 flex items-center justify-center flex-col border-b-[0.5px] border-gray-white border-opacity-50">
                <LineClamped
                  clamp={1}
                  layoutId={`heading_${cardId}`}
                  className="text-4xl mb-2 text-center w-full"
                >
                  {card.title}
                </LineClamped>
                {!!card.description && (
                  <LineClamped
                    layoutId={`description_${cardId}`}
                    clamp={3}
                    className="w-full"
                  >
                    {card.description}
                  </LineClamped>
                )}
              </div>

              <p className="text-xs text-gray-50 mt-4">
                <span className="text-white mr-2 font-bold">Notes:</span>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. A,
                aliquam?
              </p>

              <div className="mt-3 flex">
                {users.map((user, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-white/20 px-2 py-1 rounded-full mr-2"
                  >
                    {user}
                  </span>
                ))}
              </div>
            </Container>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CardDetailsModal;
