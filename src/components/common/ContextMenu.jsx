import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { css } from "styled-components";
import useOutsideClick from "../../hooks/useOutsideClick";

const Item = ({ children, className, onClick, disabled }) => {
  return (
    <div
      className={`py-1 px-3 ${
        disabled
          ? "bg-gray-300 cursor-default"
          : "hover:bg-black/5 cursor-pointer"
      } ${className}`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {children}
    </div>
  );
};

const MenuContainer = motion(styled.div`
  ${({ x, y }) => css`
    top: ${y};
    left: ${x};
  `}
`);

const ContextMenu = ({ x, y, show, children, onClose }) => {
  const ref = useRef();

  useOutsideClick(ref, onClose);

  return (
    <AnimatePresence>
      {show && (
        <MenuContainer
          x={x}
          ref={ref}
          y={y}
          initial={{
            height: 0,
            opacity: 0,
          }}
          animate={{
            height: "auto",
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
          }}
          className="text-xs bg-gray-50 rounded-md z-20 text-gray-800 overflow-hidden fixed"
        >
          {children}
        </MenuContainer>
      )}
    </AnimatePresence>
  );
};

ContextMenu.Item = Item;

export default ContextMenu;
