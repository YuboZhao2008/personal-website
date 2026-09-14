export type Experience = {
  id: string;
  title: string;
  organization: string | null;
  period: string | null;
  year: number | null;
  team: string | null;
  placement: string | null;
  category: string;
  description: string;
  featured?: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  year: number | null;
  result: string | null;
  detail: string;
  kind: "ai" | "robotics" | "mathematics";
  featured?: boolean;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  visual: "intelligence" | "gesture" | "simulation";
  status: string;
  details: string[];
  technologies: string[];
  evaluation?: { result: string; context: string };
  href?: string;
};

export type SkillGroup = {
  id: "languages" | "ai" | "tools" | "web";
  title: string;
  context: string;
  items: string[];
};

// Unknown details stay null. Add verified dates, roles, team names, and results here.
const ioai: Experience = {
  id: "ioai",
  title: "International Olympiad in Artificial Intelligence",
  organization: "IOAI",
  period: null,
  year: null,
  team: null,
  placement: null,
  category: "AI / COMPETITION",
  description:
    "AI olympiad experience at the intersection of machine learning and technical problem solving.",
  featured: true,
};

const quantitativeInternship: Experience = {
  id: "quant-internship",
  title: "Quantitative internship",
  organization: null,
  period: null,
  year: null,
  team: null,
  placement: null,
  category: "PROFESSIONAL EXPERIENCE",
  description:
    "Internship experience in a quantitative setting. Role scope and technical work will be added as the details are finalized.",
};

const ftc: Experience = {
  id: "ftc",
  title: "FIRST Tech Challenge World Championship",
  organization: "FIRST Tech Challenge",
  period: null,
  year: 2024,
  team: null,
  placement: "World Championship · 2nd place",
  category: "ROBOTICS / COMPETITION",
  description:
    "Competed with a team at the 2024 World Championship, earning a second-place result. Robotics competition brought engineering, teamwork, and technical problem solving together under competition constraints.",
  featured: true,
};

export const profile = {
  name: "Yubo Zhao",
  initials: "YZ",
  role: "1A Software Engineering",
  university: "University of Waterloo",
  headline: {
    lead: "Engineering ideas",
    continuation: "into",
    accent: "reality.",
  },
  introduction:
    "Building AI agents, experimenting with computer vision, and connecting software to the physical world through robotics.",
  location: "Waterloo, Canada",
  // Replace null with verified URLs. Email is an address without the mailto: prefix.
  socials: {
    github: null as string | null,
    linkedin: null as string | null,
    email: null as string | null,
    resume: null as string | null,
  },
  education: {
    id: "waterloo",
    title: "Software Engineering",
    organization: "University of Waterloo",
    period: "Current · First year / 1A",
    year: null,
    team: null,
    placement: null,
    category: "EDUCATION",
    description:
      "Developing the mathematical and software foundations for building intelligent systems.",
  } satisfies Experience,
  about:
    "I'm a first-year / 1A Software Engineering student at the University of Waterloo, building at the intersection of AI, computer vision, and robotics. My projects explore how software can understand context, interpret physical input, and make decisions.",
  philosophy:
    "I'm interested in the engineering behind useful AI products — and in turning experiments with new technologies into software that solves difficult problems. That extends to product engineering and startups.",
  // Editorial order is intentional: IOAI, then professional quantitative experience.
  experiences: [ioai, quantitativeInternship, ftc] satisfies Experience[],
  projects: [
    {
      id: "01",
      title: "Jarvis",
      category: "AI AGENTS / MULTIMODAL SYSTEMS",
      description:
        "An evolving personal AI assistant connecting voice, vision, and tool execution. Working toward a context-aware agent with persistent memory and useful automated workflows.",
      tags: ["Python", "LLM APIs / Ollama", "Whisper", "OpenCV"],
      visual: "intelligence",
      status: "IN DEVELOPMENT",
      details: [
        "Exploring speech recognition and synthesis alongside local models and API-based LLMs.",
        "Combining computer vision, tool execution, and automation toward multimodal interaction.",
        "Developing persistent memory and contextual understanding as part of the agent's direction.",
      ],
      technologies: [
        "Python",
        "OpenAI / LLM APIs",
        "Ollama",
        "Whisper",
        "speech_recognition",
        "pyttsx3",
        "OpenCV",
        "PyTorch",
        "spaCy",
        "torchvision",
        "PIL",
        "face recognition",
        "librosa",
        "Ultralytics YOLO",
        "MediaPipe",
      ],
    },
    {
      id: "02",
      title: "Hand Gesture Computer Vision System",
      category: "COMPUTER VISION / INTERFACES",
      description:
        "A camera-based interface that recognizes open-hand, closed-hand, and pointing gestures. Combines hand tracking with gesture-state logic and temporal smoothing for steadier interaction.",
      tags: ["Python", "MediaPipe Hands", "Random Forest"],
      visual: "gesture",
      status: "INTERFACE EXPERIMENT",
      details: [
        "Built a custom gesture dataset and a Random Forest classifier around a MediaPipe Hands pipeline.",
        "Developed pointing-position tracking, gesture smoothing, and tool switching.",
        "Explored GoodNotes-oriented interaction concepts, including using hand gestures as interface input.",
      ],
      technologies: [
        "Python",
        "MediaPipe Hands",
        "Random Forest",
        "Computer vision",
        "Temporal smoothing",
      ],
      evaluation: {
        result: "≈98% test accuracy",
        context:
          "Measured in testing on the custom gesture dataset. This does not establish accuracy across real-world users, cameras, or lighting conditions.",
      },
    },
    {
      id: "03",
      title: "Future Simulation",
      category: "SIMULATION / INTELLIGENT SYSTEMS",
      description:
        "An experimental Python simulation exploring evolving agents and entities. World-state logic, AI decision behavior, and seeded randomness shape how the simulated system develops.",
      tags: ["Python", "Pygame", "NumPy", "Matplotlib"],
      visual: "simulation",
      status: "EXPERIMENTAL SIMULATION",
      details: [
        "Working with simulation systems and world-state logic to manage interacting agents and entities.",
        "Exploring AI decision behavior and the effect of randomness and seeding on a simulation's evolution.",
        "Using Pygame, NumPy, and Matplotlib within the simulation toolkit.",
      ],
      technologies: ["Python", "Pygame", "NumPy", "Matplotlib"],
    },
  ] satisfies Project[],
  skillGroups: [
    {
      id: "languages",
      title: "Core languages",
      context: "Programming foundations",
      items: ["Python", "C", "Racket", "HTML / CSS"],
    },
    {
      id: "ai",
      title: "AI & machine learning",
      context: "Project experience and foundational workflows",
      items: [
        "PyTorch",
        "OpenCV",
        "MediaPipe",
        "Ultralytics YOLO",
        "Basic ML workflows",
        "Computer vision",
        "LLM integration",
        "AI agents",
      ],
    },
    {
      id: "tools",
      title: "Development tools",
      context: "Version control and local development",
      items: [
        "Git",
        "GitHub",
        "GitLab",
        "VS Code",
        "Linux / WSL",
        "PowerShell",
        "Virtual environments",
        "Command-line workflows",
      ],
    },
    {
      id: "web",
      title: "Web & product engineering",
      context: "Used in this portfolio",
      items: ["React", "Next.js", "TypeScript / JavaScript", "Tailwind CSS"],
    },
  ] satisfies SkillGroup[],
  achievements: [
    {
      id: ioai.id,
      title: ioai.title,
      year: ioai.year,
      result: ioai.placement,
      detail:
        "IOAI experience in artificial intelligence and technical problem solving.",
      kind: "ai",
      featured: true,
    },
    {
      id: ftc.id,
      title: ftc.title,
      year: ftc.year,
      result: ftc.placement,
      detail:
        "A team result on the world stage, bringing together robotics, engineering, and competitive problem solving.",
      kind: "robotics",
      featured: true,
    },
    {
      id: "csmc",
      title: "Canadian Senior Mathematics Contest",
      year: 2025,
      result: "48 / 60",
      detail:
        "CSMC score, reflecting mathematical reasoning and contest problem solving.",
      kind: "mathematics",
    },
  ] satisfies Achievement[],
  exploring: [
    {
      title: "Jarvis — Personal AI Agent",
      status: "BUILDING",
      description:
        "Connecting memory, multimodal input, and tool execution into a more useful personal assistant.",
    },
    {
      title: "Multi-agent development workflows",
      status: "EXPLORING",
      description:
        "How multiple AI agents can coordinate software work while keeping changes understandable and reviewable.",
    },
    {
      title: "Computer vision interfaces",
      status: "EXPERIMENTING",
      description:
        "Turning hand tracking and gesture recognition into deliberate, stable interface actions.",
    },
    {
      title: "AI-powered productivity",
      status: "EXPLORING",
      description:
        "Small, useful systems that connect language models to everyday tools and workflows.",
    },
  ],
};

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
