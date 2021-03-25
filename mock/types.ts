export type Project = {
  name: string;
  url: string;
  color: string;
  screenshot?: string;
  github?: string;
  skills?: {
    icon: string;
    name: string;
    color: string;
  }[];
};

export type Projects = Record<string, Project>;

export type Skill = {
  name: string;
  color: string;
  icon: string;
  description: string;
  projects?: Project[];
};

export type Skills = Record<string, Skill>;
