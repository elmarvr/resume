import { theme } from "twin.macro";
import { useRef, useState } from "react";
import { animated, useSpring, useTransition, useChain } from "react-spring";
import { Icon as ApiIcon } from "@iconify/react-with-api";

import useHover from "@/hooks/useHover";
import { Skill, Project } from "@/mock/types";
import spacingToPx from "@/utils/spacingToPx";

type IconsProps = {
  skills: Project["skills"];
  hidden?: boolean;
};

const Icons = ({ skills, hidden, github }: IconsProps) => {
  const [ref, hovered] = useHover();
  const expand = useRef(null);
  const icons = useRef(null);
  const add = useRef(null);

  const iconWidth = spacingToPx(8);
  const baseWidth = 4 * iconWidth;
  const expandWidth = skills.length * iconWidth;

  const expandSpring = useSpring({
    from: {
      width: baseWidth,
      scale: 0,
    },
    width: hovered ? expandWidth : baseWidth,
    scale: hidden ? 0 : 1,
    ref: expand,
    config: {
      friction: 10,
      tension: 150,
      clamp: true,
    },
  });

  useChain(hovered ? [add, expand, icons] : [icons, expand, add]);

  return (
    <animated.div
      ref={ref}
      style={expandSpring}
      tw="bg-white rounded-md shadow-md absolute right-4 z-10 overflow-hidden h-8"
    >
      <ActiveIcons
        length={hovered ? skills.length : 3}
        icons={skills}
        springRef={icons}
        iconWidth={iconWidth}
      />

      <AddIcon hidden={hovered} springRef={add} iconWidth={iconWidth} />
    </animated.div>
  );
};

type ActiveIconsProps = {
  length: number;
  icons: Project["skills"];
  springRef: React.MutableRefObject<any>;
  iconWidth: number;
};

const ActiveIcons = ({
  icons,
  length,
  springRef,
  iconWidth,
}: ActiveIconsProps) => {
  const colors = theme`colors`;
  const items = icons.slice(0, length);

  const transition = useTransition(items, {
    keys: (item: Skill) => item.name,
    from: {
      scale: 0,
    },
    enter: {
      scale: 1,
    },
    leave: {
      scale: 0,
    },
    config: {
      duration: 100,
    },
    ref: springRef,
  });

  return (
    <div tw="flex flex-row-reverse justify-end items-center h-full relative">
      {transition((style, { color, icon, name }, _, index) => (
        <Icon
          key={name}
          icon={icon}
          style={style as any}
          css={{
            color: colors[color][500],
            width: iconWidth,
            right: iconWidth * index,
          }}
        />
      ))}
    </div>
  );
};

type AddIconProps = {
  springRef: React.MutableRefObject<any>;
  iconWidth: number;
  hidden: boolean;
};

const AddIcon = ({ hidden, iconWidth, springRef }: AddIconProps) => {
  const transition = useTransition(!hidden, {
    from: {
      scale: 0,
    },
    enter: {
      scale: 1,
    },
    leave: {
      scale: 0,
    },
    config: {
      duration: 100,
    },
    ref: springRef,
  });

  return transition(
    ({ scale }, toggle) =>
      toggle && (
        <Icon
          icon="fa-solid:plus"
          style={{
            transform: scale.to((s) => `translateY(-50%) scale(${s})`),
          }}
          css={{
            width: iconWidth,
            right: iconWidth * 3,
          }}
          tw="text-xs text-gray-300 top-1/2 transform -translate-y-1/2"
        />
      )
  );
};

type IntrinsicSpan = JSX.IntrinsicElements["span"] & {
  ref?: React.Ref<HTMLSpanElement>;
};

type IconProps = IntrinsicSpan & {
  icon: string;
};

const Icon = ({ icon, style, ...props }: IconProps) => {
  return (
    <animated.span
      tw="flex justify-center absolute"
      style={style as any}
      {...props}
    >
      <ApiIcon icon={icon} />
    </animated.span>
  );
};

export default Icons;
