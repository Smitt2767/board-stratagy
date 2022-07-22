import React, { createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOutsideClick from "../../hooks/useOutsideClick";

const dropdownContext = createContext();

const Item = ({ children, className = "", onClick }) => {
  const { toggle } = useContext(dropdownContext);
  return (
    <div
      className={`${className} cursor-pointer py-1 px-3 hover:bg-black/5`}
      onClick={() => {
        onClick && onClick();
        toggle();
      }}
    >
      {children}
    </div>
  );
};

const Toggle = ({ children, className = "" }) => {
  const { toggle } = useContext(dropdownContext);
  return (
    <button className={`${className}`} onClick={toggle}>
      {children}
    </button>
  );
};

const Menu = ({ children, className = "" }) => {
  const { isOpen, toggle } = useContext(dropdownContext);
  const ref = useRef();

  useOutsideClick(ref, toggle);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
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
          className={`absolute right-0 text-xs bg-gray-50 mt-1 rounded-md text-gray-800 overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DropDown = ({ children, isOpen, toggle, className = "" }) => {
  return (
    <dropdownContext.Provider
      value={{
        isOpen,
        toggle,
      }}
    >
      <div className={`relative ${className}`}>{children}</div>
    </dropdownContext.Provider>
  );
};

DropDown.Toggle = Toggle;
DropDown.Menu = Menu;
DropDown.Item = Item;

export default DropDown;
