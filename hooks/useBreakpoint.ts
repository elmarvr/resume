import { useEffect, useState } from "react";
import { theme } from "twin.macro";
import { map, reduce, min, findKey } from "lodash";

import useEvent from "./useEvent";

const useBreakpoint = () => {
  const screens = { base: 0, ...theme`screens` };

  const breakpointValues = map(screens, (value: string) => parseInt(value, 10));

  const minBreakpoint = min(breakpointValues);

  const findBreakpoint = (value: number) => {
    return findKey(
      screens,
      (bpValue: string) => parseInt(bpValue, 10) === value
    );
  };

  const [breakpoint, setBreakpoint] = useState(() => {
    return findBreakpoint(minBreakpoint);
  });

  const updateBp = () => {
    const currentBreakpointValue = reduce(
      breakpointValues,
      (result: number, bp: number) => {
        if (bp > result && bp <= window.innerWidth) {
          return bp;
        }
        return result;
      },
      minBreakpoint
    );

    setBreakpoint(() => {
      return findBreakpoint(currentBreakpointValue);
    });
  };

  useEffect(() => {
    updateBp();
  }, []);
  useEvent("resize", () => {
    updateBp();
  });

  const up = (breakpoint: string) => {
    const bpValue = parseInt(theme`screens`[breakpoint], 10);
    return window ? window.innerWidth >= bpValue : 0;
  };

  const down = (breakpoint: string) => {
    const bpValue = parseInt(theme`screens`[breakpoint], 10);
    return window ? window.innerWidth <= bpValue : false;
  };

  return { bp: breakpoint, up, down };
};

export default useBreakpoint;
