import tw, { theme } from "twin.macro";
import {
  cloneElement,
  useState,
  Children,
  ReactElement,
  useRef,
  forwardRef,
  useEffect,
} from "react";
import useMeasure from "react-use-measure";
import { animated, useSpring, useTransition } from "react-spring";
import { reduce } from "lodash";

import useEvent from "@/hooks/useEvent";
import useBreakpoint from "@/hooks/useBreakpoint";
import cloneChildren from "@/utils/cloneChildren";
import hexToRgba from "@/utils/hexToRgba";

type SliderProps = {
  children: JSX.Element[];
  gap?: number;
};

const Slider = ({ children, gap = 2 }: SliderProps) => {
  const [page, setPage] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [looped, setLooped] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const direction = useRef(0);
  const pages = useRef(0);
  const [
    containerRef,
    { width: containerWidth, height: containerHeight },
  ] = useMeasure();
  const [placeholderRef, { width: placeholderWidth }] = useMeasure();
  const { up } = useBreakpoint();

  const breakpoints = {
    base: 1,
    sm: 2,
    md: 3,
    xl: 4,
  };

  const updatePageCount = () => {
    setPage(0);
    setLooped(false);
    setPageCount(() =>
      reduce(breakpoints, (result, value, key) => {
        if (up(key)) {
          return value;
        }
        return result;
      })
    );
  };

  useEffect(() => {
    updatePageCount();
  }, []);

  useEvent("resize", updatePageCount);

  const gapPx = +theme("spacing")[gap].replace("rem", "") * 16;
  const overflow = pageCount - pages.current;
  const overflowDistance = overflow * placeholderWidth + (overflow - 1) * gapPx;
  const total = Children.count(children);

  const transition = useTransition(page, {
    from: {
      x: direction.current * (containerWidth - overflowDistance),
    },
    enter: {
      x: 0,
    },
    leave: {
      x: direction.current * -(containerWidth - overflowDistance),
    },
    onStart: () => setSliding(true),
    onRest: () => setSliding(false),
  });

  const next = (index: number) => {
    direction.current = 1;

    if (index === total - pageCount) {
      setLooped(true);
      setPage(0);
      pages.current = pageCount;
    } else {
      const clamped = clamp(index + pageCount);
      pages.current = clamped - index;
      setPage(clamped);
    }
  };

  const previous = (index: number) => {
    direction.current = -1;
    if (index === 0) {
      setPage(total - pageCount);
      pages.current = pageCount;
    } else {
      const clamped = clamp(index - pageCount);
      setPage(clamped);
    }
  };

  const clamp = (value: number) => {
    if (value > total - pageCount) {
      return total - pageCount;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  };

  return (
    <div tw="relative" style={{ height: containerHeight }}>
      {pageCount > 0 &&
        transition((style, index) => (
          <animated.div
            ref={containerRef}
            style={style}
            tw="grid absolute w-full"
            css={{
              columnGap: gapPx,
              gridTemplateColumns: `repeat(${pageCount}, 1fr)`,
            }}
          >
            {(index > 0 || looped) && (
              <Placeholder
                gap={gapPx}
                width={placeholderWidth}
                overlay={!sliding}
                pageCount={pageCount}
                onClick={() => previous(index)}
                left
              >
                {
                  Children.toArray(children)[
                    index - 1 < 0 ? total - 1 : index - 1
                  ] as ReactElement
                }
              </Placeholder>
            )}
            {pageCount > 1 ? (
              <>
                {cloneChildren(children, index, {
                  border: "left",
                  disabled: sliding,
                })}

                {cloneChildren(children, [index + 1, index + pageCount - 1], {
                  disabled: sliding,
                })}

                {cloneChildren(children, index + pageCount - 1, {
                  border: "right",
                  disabled: sliding,
                })}
              </>
            ) : (
              cloneChildren(children, index, { disabled: sliding })
            )}

            <Placeholder
              ref={placeholderRef}
              gap={gapPx}
              width={placeholderWidth}
              overlay={!sliding}
              pageCount={pageCount}
              onClick={() => next(index)}
            >
              {
                Children.toArray(children)[
                  index + pageCount >= total ? 0 : index + pageCount
                ] as ReactElement
              }
            </Placeholder>
          </animated.div>
        ))}
    </div>
  );
};

type PlaceholderProps = {
  left?: boolean;
  children: JSX.Element;
  overlay: boolean;
  width: number;
  gap: number;
  pageCount: number;
  onClick: (event: React.MouseEvent) => any;
};

const Placeholder = forwardRef<HTMLDivElement, PlaceholderProps>(
  ({ width, left, children, overlay, gap, pageCount, onClick }, ref) => {
    const gray = theme`colors.gray`;
    const [hovered, setHovered] = useState(false);

    const { opacity } = useSpring({
      from: {
        opacity: 0,
      },
      opacity: overlay ? 1 : 0,
      config: {
        duration: 300,
      },
    });

    return (
      <div
        tw="transition block absolute w-full top-0 col-span-1 hover:cursor-pointer"
        css={{
          gridColumnStart: left ? 1 : pageCount,
        }}
        ref={ref}
        style={{ [left ? "right" : "left"]: width + gap }}
        onClick={overlay && onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <animated.div
          tw="z-10 absolute w-full h-full"
          style={{
            background: opacity.to(
              (o) =>
                `linear-gradient(to ${left ? "left" : "right"}, 
									${hexToRgba(gray[hovered ? 500 : 50], o / 2)},
									${hexToRgba(gray[50], o)}
								)`
            ),
          }}
        />
        {cloneElement(children, { disabled: true })}
      </div>
    );
  }
);

export default Slider;
