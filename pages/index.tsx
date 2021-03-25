import { GetStaticProps } from "next";
import { fetchProjects, fetchSkills } from "@/lib/api";
import Skills, { SkillsProps } from "@/sections/Skills";
import Projects, {
  ProjectsProps,
} from "@/components/sections/Projects/Projects";

type Home = ProjectsProps & SkillsProps;

const Home = ({ projects, skills }) => {
  return (
    <>
      <Skills skills={skills} />
      <Projects projects={projects} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const projects = await fetchProjects();
  const skills = fetchSkills();

  return {
    props: {
      projects,
      skills,
    },
  };
};

export default Home;
