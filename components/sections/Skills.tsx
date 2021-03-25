import tw, { theme } from "twin.macro";
import { useState } from "react";
import { Icon } from "@iconify/react-with-api";
import { animated, useSpring, useTransition } from "react-spring";
import { map } from "lodash";
import useBreakpoint from "@/hooks/useBreakpoint";
import Section, { SectionContent } from "@/ui/Section";
import Slider from "@/ui/Slider";
import { Skills as SkillsProp, Skill as SkillProp } from "@/mock/types";

export type SkillsProps = {
  skills: SkillsProp;
};

const Skills = ({ skills }: SkillsProps) => {
  return (
    <>
      <Section>
        <h2 tw="text-4xl font-bold mb-12 text-gray-900 tracking-wide">
          Skills
        </h2>
        <SectionContent>
          <Slider>
            {map(skills, (skill: SkillProp) => (
              <Skill key={skill.name} {...skill} />
            ))}
          </Slider>
        </SectionContent>
      </Section>
    </>
  );
};

type SkillProps = {
  disabled?: boolean;
  border?: "left" | "right";
} & SkillProp;

const Skill = ({
  color,
  icon,
  name,
  disabled,
  border,
  projects,
  description,
}: SkillProps) => {
  const colors = theme("colors");
  const [hovered, setHovered] = useState(false);

  const grow = 1.3;

  const expand = !disabled && hovered;

  const { up } = useBreakpoint();

  const config = {
    tension: 200,
    friction: 15,
  };

  const { scale, y, rotate } = useSpring({
    from: {
      scale: 1,
      y: 0,
      rotate: 0,
    },
    scale: expand && up("sm") ? grow : 1,
    y: expand ? -20 : 0,
    rotate: expand ? 360 : 0,
    config,
  });

  const transition = useTransition(expand, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    config,
  });

  return (
    <animated.div
      tw="relative h-40"
      css={expand ? tw`z-10` : tw`z-0`}
      style={{
        y,
        scale,
        transformOrigin: border || "center",
      }}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        css={{
          boxShadow: expand && theme`boxShadow.md`,
        }}
        tw="absolute  rounded hover:cursor-pointer w-full overflow-hidden"
      >
        <div
          tw="h-40 bg-white flex flex-col items-center justify-center "
          css={{
            background: `linear-gradient(to bottom right, ${colors[color][500]}, ${colors[color][700]})`,
          }}
        >
          <animated.span tw="block" style={{ rotate }}>
            <Icon
              icon={icon}
              tw="text-7xl mb-2"
              css={{ color: colors[color][800] }}
            />
          </animated.span>
          <h3 tw="font-bold text-xl" css={{ color: colors[color][800] }}>
            {name}
          </h3>
        </div>

        {transition(
          ({ opacity }, item) =>
            item &&
            description && (
              <animated.div
                style={{ opacity: opacity as any }}
                css={{
                  fontSize: `calc(${theme`fontSize.sm`} / ${grow})`,
                }}
                tw="bg-white p-4 w-full"
              >
                <p tw="text-gray-600 w-full mb-2">{description}</p>
                {projects && (
                  <>
                    <p
                      tw="font-bold mb-1"
                      css={{
                        color: colors[color][800],
                      }}
                    >
                      Projecten met {name}:
                    </p>
                    <ul tw="text-gray-600 space-y-0.5 list-disc pl-4">
                      {projects.map(({ name, url }) => (
                        <li key={name} tw="hover:underline">
                          <a
                            css={{
                              color: colors[color][400],
                            }}
                            href={url}
                          >
                            {name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </animated.div>
            )
        )}
      </div>
    </animated.div>
  );
};

export default Skills;
