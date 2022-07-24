import { useState, useEffect, useCallback } from "react";

const useContextMenu = (ref) => {
  const [x, setX] = useState("0px");
  const [y, setY] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      setX(`${e.pageX}px`);
      setY(`${e.pageY}px`);
      setShowMenu(true);
    },
    [setX, setY]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    const selector = ref.current || document;

    selector.addEventListener("contextmenu", handleContextMenu);
    return () => {
      selector.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleContextMenu, ref]);

  return { x, y, show: showMenu, closeMenu: handleClick };
};

export default useContextMenu;
