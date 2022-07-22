import React, { createContext, useContext } from "react";
import styled, { css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

const modalContext = createContext();

const Header = ({ children, showCloseIcon = true }) => {
  const { onClose } = useContext(modalContext);
  return (
    <div className="px-4 py-3 border-b-[0.5px] border-b-gray-600 items-center flex justify-between">
      <h2 className="text-xl tracking-wider">{children}</h2>
      {showCloseIcon && (
        <button className="text-xl" onClick={onClose}>
          <IoMdClose />
        </button>
      )}
    </div>
  );
};

const Body = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

const Footer = ({ children }) => {
  return (
    <div className="px-4 py-3 flex items-center justify-end border-t-[0.5px] border-t-gray-600">
      {children}
    </div>
  );
};

const Backdrop = motion(styled.div`
  ${({ backdrop }) => css`
    background-color: rgba(0, 0, 0, ${backdrop / 100});
  `}
`);

const variants = {
  open: {
    y: 0,
    opacity: 1,
  },
  close: {
    y: -100,
    opacity: 0,
  },
};

const Modal = ({ isOpen, onClose, backdrop = 40, children }) => {
  const handleOutsideClick = (e) => {
    if ([...e.target.classList].includes("close")) {
      onClose();
    }
  };

  return (
    <modalContext.Provider
      value={{
        onClose,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={variants}
              initial="close"
              animate="open"
              exit="close"
              transition={{
                duration: 0.3,
              }}
              backdrop={backdrop}
              className="fixed inset-0 z-20 p-2 close"
              onClick={handleOutsideClick}
            >
              <div className="bg-gray-800 max-w-lg w-full mx-auto my-[5%] rounded-lg shadow-lg shadow-black/5">
                {children}
              </div>
            </motion.div>
            <Backdrop className="fixed inset-0 z-10 p-2" backdrop={backdrop} />
          </>
        )}
      </AnimatePresence>
    </modalContext.Provider>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
