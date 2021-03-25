import mockSkills from "@/mock/skills.yaml";
import mockProjects from "@/mock/projects.yaml";
import { Skills, Projects, Project, Skill } from "@/mock/types";
import { reduce, forEach, clone, cloneDeep, MemoObjectIterator } from "lodash";
import asyncReduce from "@/utils/asyncReduce";

type ScreenshotData = {
  screenshot: string;
};

export const fetchScreenshot = async (url: string) => {
  const response = await fetch(
    `https://screenshotapi.net/api/v1/screenshot?url=${url}&token=${"RHNKETYYVURXDCIHDONLWHCLLNTL0BBS"}`
  );
  const { screenshot }: ScreenshotData = await response.json();
  return screenshot;
};

const getProjectSkills = (project: string) => {
  return reduce(
    mockSkills,
    (result, { projects, name, color, icon }) => {
      if (projects && projects.includes(project)) {
        result.push({
          name,
          color,
          icon,
        });
      }
      return result;
    },
    [] as any
  );
};

const getProjectScreenshots = async () => {
  const _mockProjects = cloneDeep(mockProjects);

  return await reduce(
    _mockProjects,
    async (promise, { url }, project) => {
      const result = await promise;
      result[project].screenshot = await fetchScreenshot(url);

      return Promise.resolve(result);
    },
    Promise.resolve(_mockProjects)
  );
};

export const fetchProjects = async (): Promise<Projects> => {
  const projectsWithScreenshots = await getProjectScreenshots();

  return reduce(
    projectsWithScreenshots,
    (result, _, project) => {
      result[project].skills = getProjectSkills(project);

      return result;
    },
    projectsWithScreenshots
  );
};

export const fetchSkills = (): Skills => {
  const _mockSkills: Skills = cloneDeep(mockSkills);

  reduce(
    _mockSkills,
    (result, { projects }, key) => {
      if (projects) {
        result[key].projects = projects.map((project) => mockProjects[project]);
      }
      return result;
    },
    _mockSkills
  );

  return _mockSkills;
};
