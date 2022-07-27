import { useState, useEffect, useCallback } from "react";

const useContextMenu = (id) => {
  const [x, setX] = useState("0px");
  const [y, setY] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setX(`${e.x}px`);
      setY(`${e.y}px`);
      setShowMenu(true);
    },
    [setX, setY]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    const selector = document.querySelector(`#${id}`) || document;

    selector.addEventListener("contextmenu", handleContextMenu);
    return () => {
      selector.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleContextMenu, id]);

  return { x, y, show: showMenu, closeMenu: handleClick };
};

export default useContextMenu;
