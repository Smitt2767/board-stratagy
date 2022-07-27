import { motion } from "framer-motion";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { modes } from "../../constants";
import useContextMenu from "../../hooks/useContextMenu";
import {
  addSelectedCard,
  deleteCard,
  pasteCard,
  removeSelectedCard,
  separateCard,
  setCopyCardId,
} from "../../store/board/actions";
import { getOS, OS } from "../../utils";
import ContextMenu from "../common/ContextMenu";
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

const CardContextMenu = ({ x, y, show, closeMenu, id }) => {
  const { copyCardId } = useSelector((state) => state.board);
  const [modalData, setModalData] = useState({
    isOpen: false,
    cardId: "",
  });
  const dispatch = useDispatch();

  const handleEdit = () => {
    setModalData({
      isOpen: true,
      cardId: id,
    });
    closeMenu();
  };

  const handleModalClose = () => {
    setModalData({
      isOpen: false,
      cardId: "",
    });
  };

  const handleDelete = () => {
    dispatch(
      deleteCard({
        cardId: id,
      })
    );
    closeMenu();
  };

  const handleCopy = () => {
    dispatch(setCopyCardId(id));
    closeMenu();
  };

  const handlePaste = () => {
    dispatch(pasteCard(id));
    closeMenu();
  };

  return (
    <>
      <AddEditCardModal
        mode={modes.EDIT}
        {...modalData}
        onClose={handleModalClose}
      />
      <ContextMenu x={x} y={y} show={show} onClose={closeMenu}>
        <ContextMenu.Item onClick={handleEdit}>Edit</ContextMenu.Item>
        <ContextMenu.Item onClick={handleDelete}>Delete</ContextMenu.Item>
        <ContextMenu.Item onClick={handleCopy}>Copy</ContextMenu.Item>
        <ContextMenu.Item
          onClick={handlePaste}
          disabled={!!!copyCardId || copyCardId === id}
        >
          Paste
        </ContextMenu.Item>
      </ContextMenu>
    </>
  );
};

const AddCardContextMenu = ({ x, y, show, closeMenu, colSpan, id, rowId }) => {
  const { copyCardId } = useSelector((state) => state.board);
  const dispatch = useDispatch();

  const handlePaste = () => {
    dispatch(pasteCard(id));
    closeMenu();
  };

  const handleSeparate = () => {
    dispatch(
      separateCard({
        rowId,
        cardId: id,
      })
    );
    closeMenu();
  };

  return (
    <ContextMenu x={x} y={y} show={show} onClose={closeMenu}>
      {colSpan > 1 && (
        <ContextMenu.Item onClick={handleSeparate}>Separate</ContextMenu.Item>
      )}
      <ContextMenu.Item onClick={handlePaste} disabled={!!!copyCardId}>
        Paste
      </ContextMenu.Item>
    </ContextMenu>
  );
};

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

  const contextId = `card_${id.replace(/[-]/g, "_")}`;

  const contextMenuData = useContextMenu(contextId);

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
      {hasData ? (
        <CardContextMenu {...contextMenuData} id={id} />
      ) : (
        <AddCardContextMenu
          {...contextMenuData}
          colSpan={colSpan}
          id={id}
          rowId={rowId}
        />
      )}

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
        {(provided, snapshot) => (
          <div
            className={`${sizes[colSpan]} h-16 mx-[3px] min-w-[24px]`}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
            id={contextId}
          >
            {hasData ? (
              <CardContainer
                className="h-full w-full  flex items-center justify-center flex-col rounded-[3px] px-1 overflow-hidden"
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
                  } truncate w-full text-center`}
                >
                  {title}
                </motion.p>
                {!!description && (
                  <motion.p
                    {...(snapshot.isDragging
                      ? {}
                      : { layoutId: `description_${id}` })}
                    className="text-[10px] text-center   truncate w-full text-gray-100"
                  >
                    {description}
                  </motion.p>
                )}
              </CardContainer>
            ) : (
              <div
                className={`h-full w-full border-2  border-dashed flex items-center justify-center rounded-[3px] cursor-pointer hover:border-white transition-colors duration-500 hover:text-white ${
                  sizes[colSpan]
                } ${
                  isSelected ? "border-white text-white" : "border-gray-600"
                }`}
                onClick={handleAddBtnClick}
              >
                <AiOutlinePlus />
              </div>
            )}
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Card;
