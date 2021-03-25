import { useEffect } from "react";

const useEvent = (
  event: keyof WindowEventMap,
  handler: (event: Event) => any,
  options?: boolean | AddEventListenerOptions
) => {
  useEffect(() => {
    window.addEventListener(event, handler, options);

    return () => window.removeEventListener(event, handler, options);
  }, []);
};

export default useEvent;
