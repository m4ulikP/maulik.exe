export type SkillCategory =
  | 'languages'
  | 'web-fundamentals'
  | 'tools-workflows'
  | 'data-ml'
  | 'engineering-cs'
  | 'ai-assisted';

export type ProficiencyStatus =
  | 'Intermediate'
  | 'Comfortable Using'
  | 'Beginner'
  | 'Currently Learning'
  | 'Beginner / Currently Learning'
  | 'Planned / Not Yet Learned'
  | 'Hands-on Experience';

export interface SkillCategoryMeta {
  id: SkillCategory;
  label: string;
  badge: string;
  description: string;
}

export const SKILL_CATEGORIES: SkillCategoryMeta[] = [
  {
    id: 'languages',
    label: 'Programming Languages',
    badge: '01',
    description: 'Core syntax, object-oriented paradigms, and scripting languages',
  },
  {
    id: 'web-fundamentals',
    label: 'Web Fundamentals',
    badge: '02',
    description: 'Semantic markup and modular styling currently being learned',
  },
  {
    id: 'tools-workflows',
    label: 'Developer Tools',
    badge: '03',
    description: 'Daily version control, cloud repositories, and code editing environments',
  },
  {
    id: 'data-ml',
    label: 'Machine Learning & Data Science',
    badge: '04',
    description: 'Theoretical ML foundations and scientific computing packages',
  },
  {
    id: 'engineering-cs',
    label: 'Engineering & CS',
    badge: '05',
    description: 'Core data structures, computational algorithms, and container basics',
  },
  {
    id: 'ai-assisted',
    label: 'AI-Assisted Development',
    badge: '06',
    description: 'Hands-on AI-assisted workflows used to architect and iterate on code',
  },
];

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  categoryLabel: string;
  proficiency: ProficiencyStatus;
  isPlanned?: boolean;
  description: string;
  evidenceCategory:
    | 'Academic Coursework'
    | 'Academic & Project Work'
    | 'Active Learning'
    | 'Verified Specialization'
    | 'Hands-on Tooling'
    | 'Development Workflow'
    | 'Planned Roadmap';
  evidenceSummary: string;
  verifiableDetails: string;
  connectedSkillIds: string[];
  projectLink?: {
    type: 'case-study' | 'section';
    targetId: string;
    label: string;
  };
  // Graph coordinate positions for desktop SVG canvas (viewBox 0 0 1000 560)
  x: number;
  y: number;
}

export const SKILL_NODES: SkillNode[] = [
  // =========================================================================
  // A. PROGRAMMING LANGUAGES
  // =========================================================================
  {
    id: 'python',
    name: 'Python',
    category: 'languages',
    categoryLabel: 'Programming Languages',
    proficiency: 'Intermediate',
    description: 'High-level programming language used for scripting, algorithmic problem-solving, and scientific computing.',
    evidenceCategory: 'Academic & Project Work',
    evidenceSummary: 'Primary language across coursework algorithms, data manipulation, and software projects.',
    verifiableDetails: 'Proficient in Python syntax, data structures (lists, dicts, sets, tuples), OOP paradigms, file I/O, and integrating with numerical computing packages.',
    connectedSkillIds: ['numpy', 'pandas', 'matplotlib', 'machine-learning'],
    projectLink: {
      type: 'case-study',
      targetId: 'aegis3d',
      label: 'View Python Implementation in Aegis3D',
    },
    x: 150,
    y: 90,
  },
  {
    id: 'java',
    name: 'Java',
    category: 'languages',
    categoryLabel: 'Programming Languages',
    proficiency: 'Intermediate',
    description: 'Object-oriented programming language studied through core undergraduate Computer Science coursework.',
    evidenceCategory: 'Academic Coursework',
    evidenceSummary: 'Undergraduate Computer Science curriculum in Object-Oriented Programming and software design.',
    verifiableDetails: 'Practiced class hierarchies, inheritance, interfaces, polymorphism, exception handling, and algorithmic problem-solving in academic coursework.',
    connectedSkillIds: ['dsa'],
    x: 150,
    y: 190,
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'languages',
    categoryLabel: 'Programming Languages',
    proficiency: 'Intermediate',
    description: 'Systems programming language used in academic coursework for structured and object-oriented programming.',
    evidenceCategory: 'Academic Coursework',
    evidenceSummary: 'Core Computer Science curriculum in data structures, memory concepts, and foundational algorithms.',
    verifiableDetails: 'Implemented coursework exercises focusing on basic memory concepts, pointers, standard library structures, and fundamental algorithms.',
    connectedSkillIds: ['dsa'],
    x: 150,
    y: 290,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'languages',
    categoryLabel: 'Programming Languages',
    proficiency: 'Currently Learning',
    description: 'Dynamic scripting language for web client development. Actively learning foundational syntax, DOM interactions, and async JavaScript.',
    evidenceCategory: 'Active Learning',
    evidenceSummary: 'Actively studying modern JavaScript language fundamentals, data types, and syntax.',
    verifiableDetails: 'Currently learning modern JavaScript fundamentals (ES6+, functions, promises, array methods). Used in projects with AI assistance; still developing independent mastery.',
    connectedSkillIds: ['typescript'],
    x: 150,
    y: 400,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'languages',
    categoryLabel: 'Programming Languages',
    proficiency: 'Currently Learning',
    description: 'Statically typed superset of JavaScript. Learning type annotations, interfaces, and compiler configurations alongside web development.',
    evidenceCategory: 'Active Learning',
    evidenceSummary: 'Learning TypeScript types, interfaces, and compiler configurations alongside JavaScript fundamentals.',
    verifiableDetails: 'Practicing basic type annotations, interfaces, and union types. Encountered in full-stack project setups (Next.js/Node); actively learning to write and debug types independently.',
    connectedSkillIds: ['javascript'],
    x: 150,
    y: 490,
  },

  // =========================================================================
  // B. WEB FUNDAMENTALS
  // =========================================================================
  {
    id: 'html',
    name: 'HTML',
    category: 'web-fundamentals',
    categoryLabel: 'Web Fundamentals',
    proficiency: 'Beginner / Currently Learning',
    description: 'Standard markup language for structuring web pages. Actively learning semantic elements and document flow.',
    evidenceCategory: 'Active Learning',
    evidenceSummary: 'Actively learning semantic document structure and standard HTML5 elements.',
    verifiableDetails: 'Practicing basic HTML markup, heading hierarchies, forms, and page structuring. Not claiming independent frontend mastery.',
    connectedSkillIds: ['css'],
    x: 370,
    y: 90,
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'web-fundamentals',
    categoryLabel: 'Web Fundamentals',
    proficiency: 'Beginner / Currently Learning',
    description: 'Style sheet language for web presentation. Actively learning the box model, layouts, and responsive styling.',
    evidenceCategory: 'Active Learning',
    evidenceSummary: 'Actively learning CSS syntax, selectors, box model properties, and styling fundamentals.',
    verifiableDetails: 'Studying the CSS box model, selectors, colors, borders, typography, and basic responsive styling rules.',
    connectedSkillIds: ['html'],
    x: 370,
    y: 180,
  },

  // =========================================================================
  // C. DEVELOPER TOOLS
  // =========================================================================
  {
    id: 'git',
    name: 'Git',
    category: 'tools-workflows',
    categoryLabel: 'Developer Tools',
    proficiency: 'Comfortable Using',
    description: 'Distributed version control system used for tracking changes in source code during software development.',
    evidenceCategory: 'Hands-on Tooling',
    evidenceSummary: 'Used regularly for personal projects, coursework, and repository version tracking.',
    verifiableDetails: 'Comfortable with standard Git commands including init, clone, status, add, commit, push, pull, log, and basic branch management.',
    connectedSkillIds: ['github', 'vscode'],
    x: 600,
    y: 220,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'tools-workflows',
    categoryLabel: 'Developer Tools',
    proficiency: 'Comfortable Using',
    description: 'Cloud platform for hosting Git repositories, collaboration, project tracking, and managing source code versions.',
    evidenceCategory: 'Hands-on Tooling',
    evidenceSummary: 'Platform used for hosting personal codebases, open-source portfolio repositories, and tracking changes.',
    verifiableDetails: 'Maintains personal repositories, pushes commits, creates pull requests, tracks issues, and manages repository documentation on GitHub.',
    connectedSkillIds: ['git'],
    projectLink: {
      type: 'section',
      targetId: 'contact',
      label: 'View GitHub Profile',
    },
    x: 600,
    y: 310,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'tools-workflows',
    categoryLabel: 'Developer Tools',
    proficiency: 'Comfortable Using',
    description: 'Primary extensible code editor used for development, file editing, integrated terminal, and extension workflows.',
    evidenceCategory: 'Hands-on Tooling',
    evidenceSummary: 'Daily code editing environment for academic assignments, scripts, and software development.',
    verifiableDetails: 'Comfortable using editor workspaces, syntax highlighting, integrated terminal, keyboard shortcuts, and extensions for development.',
    connectedSkillIds: ['git'],
    x: 600,
    y: 400,
  },

  // =========================================================================
  // D. MACHINE LEARNING AND DATA SCIENCE
  // =========================================================================
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'data-ml',
    categoryLabel: 'Machine Learning & Data Science',
    proficiency: 'Beginner / Currently Learning',
    description: 'Theoretical foundations of supervised and unsupervised machine learning algorithms and evaluation concepts.',
    evidenceCategory: 'Verified Specialization',
    evidenceSummary: 'Completed Andrew Ng’s Machine Learning Specialization (DeepLearning.AI / Coursera) & B.Tech AI coursework.',
    verifiableDetails: 'Studied linear regression, logistic regression, cost functions, gradient descent, regularization, and introductory neural networks. Practical implementation ability is at beginner level.',
    connectedSkillIds: ['python', 'numpy'],
    x: 830,
    y: 90,
  },
  {
    id: 'numpy',
    name: 'NumPy',
    category: 'data-ml',
    categoryLabel: 'Machine Learning & Data Science',
    proficiency: 'Beginner',
    description: 'Python scientific package providing multi-dimensional array processing and basic numerical operations.',
    evidenceCategory: 'Academic & Project Work',
    evidenceSummary: 'Used for array manipulation and numerical computations during machine learning coursework.',
    verifiableDetails: 'Familiar with ndarray creation, slicing, element-wise arithmetic, and basic mathematical functions in coursework.',
    connectedSkillIds: ['python', 'pandas', 'matplotlib', 'machine-learning'],
    x: 830,
    y: 200,
  },
  {
    id: 'pandas',
    name: 'pandas',
    category: 'data-ml',
    categoryLabel: 'Machine Learning & Data Science',
    proficiency: 'Beginner',
    description: 'Python library for structured data manipulation and basic tabular analysis.',
    evidenceCategory: 'Academic Coursework',
    evidenceSummary: 'Introductory tabular data inspection and DataFrame operations during coursework.',
    verifiableDetails: 'Used DataFrame and Series structures for loading CSV datasets, inspecting rows and columns, and basic data filtering.',
    connectedSkillIds: ['python', 'numpy', 'matplotlib'],
    x: 830,
    y: 310,
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    category: 'data-ml',
    categoryLabel: 'Machine Learning & Data Science',
    proficiency: 'Beginner',
    description: 'Plotting library for generating basic 2D data visualizations and charts in Python.',
    evidenceCategory: 'Academic & Project Work',
    evidenceSummary: 'Used for generating simple exploratory plots and data visual distributions.',
    verifiableDetails: 'Constructed basic 2D line charts, scatter plots, and histograms to visualize data distributions during coursework.',
    connectedSkillIds: ['python', 'numpy', 'pandas'],
    x: 830,
    y: 420,
  },

  // =========================================================================
  // E. ENGINEERING AND COMPUTER SCIENCE
  // =========================================================================
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'engineering-cs',
    categoryLabel: 'Engineering & CS',
    proficiency: 'Currently Learning',
    description: 'Core computer science principles of data organization, algorithmic efficiency, and problem-solving techniques.',
    evidenceCategory: 'Active Learning',
    evidenceSummary: 'Currently studying foundational data structures and algorithm analysis through academic coursework.',
    verifiableDetails: 'Actively learning arrays, linked lists, stacks, queues, sorting algorithms, and Big-O computational time complexity analysis.',
    connectedSkillIds: ['java', 'cpp'],
    x: 370,
    y: 290,
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'engineering-cs',
    categoryLabel: 'Engineering & CS',
    proficiency: 'Beginner / Currently Learning',
    description: 'Containerization technology for isolating development environments. Beginner-level understanding.',
    evidenceCategory: 'Active Learning',
    evidenceSummary: 'Beginner understanding of container concepts, basic Dockerfile commands, and container execution.',
    verifiableDetails: 'Learning container basics: pulling images, running containers from pre-built images, and understanding environment isolation concepts.',
    connectedSkillIds: [],
    x: 600,
    y: 490,
  },

  // =========================================================================
  // F. AI-ASSISTED DEVELOPMENT
  // =========================================================================
  {
    id: 'google-antigravity',
    name: 'Google Antigravity',
    category: 'ai-assisted',
    categoryLabel: 'AI-Assisted Development',
    proficiency: 'Hands-on Experience',
    description: 'Primary AI-assisted development environment used to scaffold, iterate on, and architect portfolio projects.',
    evidenceCategory: 'Development Workflow',
    evidenceSummary: 'Primary AI-assisted environment utilized to build, iterate, and architect portfolio projects.',
    verifiableDetails: 'Hands-on daily experience utilizing Google Antigravity for iterative code generation, refactoring, and architectural pair programming. Project stack technologies (e.g. Next.js, Node.js, PostgreSQL, Vitest, Prisma) were implemented with AI assistance; independent mastery is actively developing through ongoing study.',
    connectedSkillIds: [],
    projectLink: {
      type: 'case-study',
      targetId: 'aegis3d',
      label: 'Inspect Project Iterated with Antigravity',
    },
    x: 600,
    y: 90,
  },
];
