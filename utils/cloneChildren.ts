import { Children, cloneElement, ReactElement } from "react";

const cloneChildren = (
  children: JSX.Element[],
  range: number | number[],
  props?: Partial<any>
) => {
  if (typeof range === "number") {
    return cloneElement(
      Children.toArray(children)[range] as ReactElement,
      props
    );
  }
  return Children.toArray(children)
    .slice(range[0], range[1])
    .map((child) => cloneElement(child as ReactElement, props));
};

export default cloneChildren;
