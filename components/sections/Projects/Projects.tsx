import tw, { theme } from "twin.macro";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { map } from "lodash";
import {
  useSpring,
  animated,
  useTransition,
  useChain,
  AnimatedComponent,
} from "react-spring";
import { Icon as ApiIcon } from "@iconify/react-with-api";
import Section, { SectionContent } from "@/ui/Section";
import {
  Projects as ProjectsProp,
  Project as ProjectProp,
  Skill,
} from "@/mock/types";
import hexToRgba from "@/utils/hexToRgba";
import useEvent from "@/hooks/useEvent";
import useBreakpoint from "@/hooks/useBreakpoint";
import spacingToPx from "@/utils/spacingToPx";
import Icons from "./Icons";

export type ProjectsProps = {
  projects: ProjectsProp;
};

const Projects = ({ projects }: ProjectsProps) => {
  return (
    <Section>
      <SectionContent>
        <h2 tw="text-4xl font-bold mb-12 text-gray-900 tracking-wide">
          Projects
        </h2>

        <div tw="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 w-full justify-items-center">
          {map(projects, (project: ProjectProp) => (
            <Project key={project.name} {...project} />
          ))}
        </div>
      </SectionContent>
    </Section>
  );
};

const Project = ({
  name,
  screenshot,
  color,
  skills,
  github,
  url,
}: ProjectProp) => {
  const { down } = useBreakpoint();
  const [hovered, setHovered] = useState(false);
  const [mobile, setMobile] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0);
  const startX = useRef(0);

  const expand = mobile || hovered;

  const { scale, y, text, x, opacity } = useSpring({
    from: {
      scale: 1,
      zIndex: 0,
      y: mobile ? 0 : startY.current,
      x: mobile ? 0 : startX.current,
      text: color,
    },
    scale: hovered ? 1.2 : 1,
    y: hovered ? 0 : startY.current,
    x: hovered ? 0 : startX.current,
    text: expand ? "#FFF" : color,
    opacity: expand ? 1 : 0,
    config: {
      tension: 200,
      friction: 15,
    },
  });

  const update = () => {
    const isMobile = down("lg");
    setMobile(isMobile);

    if (!isMobile) {
      startX.current = -textRef.current.offsetLeft;
      startY.current = cardRef.current.getBoundingClientRect().height - 4;
    } else {
      startX.current = 0;
      startY.current = 0;
    }

    x.set(startX.current);
    y.set(startY.current);
  };

  useEffect(update, []);
  useEvent("resize", update);

  return (
    <animated.a
      href={url}
      style={{
        scale,
        zIndex: hovered ? 1 : 0,
      }}
      key={name}
      className="group"
      tw="h-64 relative hover:cursor-pointer flex flex-col w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(true)}
    >
      <div tw="w-full h-full relative shadow rounded-md overflow-hidden group-hover:(ring ring-blue-300)">
        <Image src={screenshot} layout="fill" objectFit="cover" />
      </div>

      <animated.div
        ref={cardRef}
        style={{ background: opacity.to((o) => hexToRgba(color, o)) }}
        tw="absolute bottom-0 w-full flex items-center p-4 justify-between"
      >
        <animated.h3
          ref={textRef}
          style={{
            y,
            x,
            ...(mobile && { transform: "translateX(0)" }),
            color: text,
            zIndex: expand ? 2 : 0,
            fontSize: scale.to((s) => `calc(${theme`fontSize.base`} / ${s})`),
          }}
          tw="font-bold"
        >
          {name}
        </animated.h3>

        <Icons hidden={!hovered} skills={skills!} />
      </animated.div>
    </animated.a>
  );
};

export default Projects;
