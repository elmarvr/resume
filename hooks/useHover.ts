import { useState, useRef, useEffect } from "react";

const useHover = () => {
  const ref = useRef<any>(null);
  const [value, setValue] = useState(false);

  const onEnter = () => setValue(true);
  const onLeave = () => setValue(false);

  useEffect(() => {
    ref.current.addEventListener("mouseenter", onEnter);
    ref.current.addEventListener("mouseleave", onLeave);

    return () => {
      ref.current.removeEventListener("mouseenter", onEnter);
      ref.current.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return [ref, value] as [typeof ref, boolean];
};

export default useHover;
