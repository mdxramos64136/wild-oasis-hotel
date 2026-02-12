import { useEffect, useRef } from "react";

export function useOutsideClick(handleClose) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handleClose();
        }
      }

      document.addEventListener("click", handleClick, true);

      //remove event listener after component unmounts
      return () => document.removeEventListener("click", handleClick);
    },
    [handleClose],
  );
  return ref;
}
