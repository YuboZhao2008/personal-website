export type Experience = {
  id: string;
  title: string;
  organization: string;
  period: string;
  year: number | null;
  category: string;
  statement: string;
  description: string;
  disciplines: string[];
  location?: string;
  result?: { value: string; label: string; detail: string };
};
export type Project = {
  id: string;
  title: string;
  originalTitle?: string;
  subtitle: string;
  category: string;
  description: string;
  visual: "intelligence" | "warcraft" | "medical" | "gesture" | "simulation";
  presentation: "flagship" | "case-study" | "secondary";
  details: string[];
  technologies: string[];
  evaluation?: { result: string; context: string };
  repositoryUrl?: string | null;
  demoUrl?: string | null;
  caseStudyUrl?: string | null;
};
export type Achievement = {
  id: string;
  title: string;
  shortTitle: string;
  year: number | null;
  result: string;
  detail: string;
  verificationUrl?: string | null;
  team?: string | null;
  teamNumber?: string | null;
  resultDetail?: string | null;
  scope?: string | null;
};
export type Opportunity = {
  targetRoles: string[];
  availability: string | null;
  status: string | null;
};
export type SkillGroup = {
  id: string;
  title: string;
  context: string;
  core: string[];
  additional: string[];
};

export const profile = {
  name: "Yubo Zhao",
  initials: "YZ",
  role: "1A Software Engineering",
  university: "University of Waterloo",
  location: "Waterloo, Ontario",
  introduction:
    "Building systems that perceive, reason, and interact with the world.",
  // Keep unknown links null. Email is an address without the mailto: prefix.
  socials: {
    github: "https://github.com/YuboZhao2008" as string | null,
    linkedin: "https://linkedin.com/in/yubozhao-ai" as string | null,
    email: "bowenzhao2020@gmail.com" as string | null,
    resume: "/resume.pdf" as string | null,
  },
  // Confirm status and availability before displaying a recruiting term or date.
  opportunity: {
    targetRoles: ["Software engineering", "AI / machine learning"],
    availability: null,
    status: null,
  } as Opportunity,
  education: {
    degree: "Bachelor of Software Engineering",
    graduation: 2031,
    status: "1A",
  },
  about:
    "I'm a Software Engineering student at the University of Waterloo, working across machine learning, robotics, and intelligent software.",
  philosophy:
    "I’m interested in building across the boundaries between models, perception, interfaces, and state. My work in competitive AI, robotics—including three consecutive FTC World Championship qualifications—and quantitative research keeps bringing me back to how those parts behave together under real constraints.",
  experiences: [
    {
      id: "ioai",
      title: "Team Canada Member",
      organization: "International Olympiad in Artificial Intelligence",
      period: "2025",
      year: 2025,
      category: "COMPETITIVE ARTIFICIAL INTELLIGENCE",
      statement: "Selected to represent Team Canada at IOAI 2025.",
      description:
        "Prepared for IOAI through machine learning, deep learning, computer vision, NLP, and data preparation. Worked on AI problems involving experimental design, model optimization, and performance evaluation under competitive constraints.",
      disciplines: [
        "Machine learning",
        "Computer vision",
        "NLP",
        "Model optimization",
      ],
    },
    {
      id: "ftc",
      title: "Robotics Team Member",
      organization: "FIRST Tech Challenge",
      period: "Three consecutive seasons",
      year: null,
      category: "INTERNATIONAL ROBOTICS",
      statement: "Three consecutive FTC World Championship qualifications.",
      result: {
        value: "3×",
        label: "WORLD CHAMPIONSHIP QUALIFIER",
        detail: "2nd Place Globally — 2024 · team result",
      },
      description:
        "Worked with teammates across software, mechanical, electrical, and strategy on a competition robot for autonomous and driver-controlled operation. The team’s work involved sensor integration, autonomous-control logic, debugging, and iterative performance tuning for international competition.",
      disciplines: [
        "Autonomous control",
        "Sensor integration",
        "Performance tuning",
      ],
    },
    {
      id: "quant-internship",
      title: "Machine Learning / Quantitative Research Intern",
      organization: "Shaanxi Shun Yicheng Investment Management Co., Ltd.",
      period: "July – August 2025",
      year: 2025,
      location: "Xi'an, China",
      category: "ML / QUANTITATIVE RESEARCH",
      statement: "Examining the signal. Questioning the model.",
      description:
        "Worked on preprocessing, feature engineering, model evaluation, signal validation, and benchmarking for financial machine-learning workflows. Examined predictive modeling, risk analysis, and backtesting, with attention to leakage, generalization, and overfitting.",
      disciplines: [
        "Feature engineering",
        "Backtesting",
        "Signal validation",
        "Generalization",
      ],
    },
  ] satisfies Experience[],
  projects: [
    {
      id: "jarvis",
      title: "Jarvis",
      subtitle: "Local Multimodal AI Assistant",
      category: "AGENTS / MULTIMODAL SYSTEMS",
      presentation: "flagship",
      visual: "intelligence",
      description:
        "A personal AI assistant that brings voice, text, and camera input into one system for multimodal interaction.",
      details: [
        "A modular Python system connects Ollama-based local LLM inference with persistent memory and external APIs.",
        "Speech-to-text and text-to-speech handle voice interaction; OpenCV provides real-time computer vision alongside the language model.",
      ],
      technologies: [
        "Python",
        "Ollama",
        "OpenCV",
        "Speech systems",
        "APIs",
        "LLM integration",
      ],
      repositoryUrl: null,
      demoUrl: null,
      caseStudyUrl: null,
    },
    {
      id: "warcraft-rl",
      title: "Warcraft III RL Agent",
      originalTitle: "Warcraft III Reinforcement Learning Agent",
      subtitle:
        "Custom reinforcement-learning environment for real-time RTS control",
      category: "REINFORCEMENT LEARNING / GAME AI / SYSTEMS",
      presentation: "case-study",
      visual: "warcraft",
      description:
        "Built an environment that lets an external Python agent observe and control Warcraft III: Reforged in real time. Custom Lua instrumentation and bidirectional IPC expose live combat state and unit commands, creating the infrastructure to train autonomous micro-management policies.",
      details: [
        "Warcraft III has no native RL API, and its Lua sandbox lacks conventional networking for external ML tooling. A custom observation/action loop makes the game programmable from Python.",
        "Lua instrumentation serializes live game state for the external Python runtime; bidirectional IPC carries Python-selected actions back to the in-game Lua controller.",
        "A sequential command queue dispatches movement, attack, targeting, stop, and hero ability commands, addressing stale or repeated engine command behavior.",
        "Gymnasium-style observation, action, and reward interfaces represent health, position, distance, targets, and combat state. Reward design includes damage dealt, damage received penalties, kills, deaths, positioning, and objectives.",
        "The initial scenario is controlled Death Knight combat, with a PPO-oriented training architecture. Learned policies are in development; the environment is designed to expand toward multi-unit tactical decisions.",
      ],
      technologies: [
        "Python",
        "Lua",
        "Reinforcement Learning",
        "PPO",
        "Game AI",
      ],
    },
    {
      id: "brain-tumor",
      title: "Brain Tumor MRI Classification",
      originalTitle: "Brain Tumor Detection System",
      subtitle: "Compact model. Careful evaluation.",
      category: "MACHINE LEARNING / MEDICAL IMAGING",
      presentation: "case-study",
      visual: "medical",
      description:
        "An experimental machine-learning project for classifying brain MRI images with a compact vision transformer. The work explores model evaluation and generalization; it is not presented as a clinically validated diagnostic tool.",
      details: [
        "Implemented the pipeline in Python and PyTorch using MiniMaxViT.",
        "Experimented with image preprocessing, augmentation, oversampling, class balancing, and validation strategies.",
        "Evaluation considered precision, recall, F1, confusion matrices, generalization, and dataset artifacts. Metric values are not reported here.",
      ],
      technologies: ["Python", "PyTorch", "MiniMaxViT", "Medical Imaging"],
      repositoryUrl: null,
      demoUrl: null,
      caseStudyUrl: null,
    },
    {
      id: "gesture",
      title: "Gesture-Controlled Drawing Interface",
      subtitle: "From hand movement to intent.",
      category: "COMPUTER VISION / INTERACTION",
      presentation: "secondary",
      visual: "gesture",
      description:
        "A real-time drawing interface controlled by open-hand, closed-hand, and pointing gestures, with drawing, erasing, tool switching, and snapshot capture.",
      details: [
        "A Random Forest classifier interprets 21-point hand landmarks, with pointing coordinates used for precise interaction.",
        "Used temporal smoothing, gesture-state logic, and latency controls to stabilize real-time interaction.",
      ],
      technologies: ["Python", "OpenCV", "MediaPipe", "scikit-learn"],
      evaluation: {
        result: "≈98%",
        context: "Test accuracy on the project's test split.",
      },
      repositoryUrl: null,
      demoUrl: null,
      caseStudyUrl: null,
    },
    {
      id: "future-sim",
      title: "Future-Sim",
      subtitle: "World Model Prototype",
      category: "SIMULATION / PREDICTIVE SYSTEMS",
      presentation: "secondary",
      visual: "simulation",
      description:
        "A simulation prototype for exploring how a configured world state could evolve and estimating possible outcomes.",
      details: [
        "A Python framework represents configurable world states and environment dynamics as the basis for future-state generation.",
      ],
      technologies: ["Python", "NumPy", "Pygame"],
      repositoryUrl: null,
      demoUrl: null,
      caseStudyUrl: null,
    },
  ] satisfies Project[],
  achievements: [
    {
      id: "ioai",
      verificationUrl: null,
      team: null,
      teamNumber: null,
      resultDetail: null,
      scope: null,
      title: "International Olympiad in Artificial Intelligence",
      shortTitle: "IOAI",
      year: 2025,
      result: "TEAM CANADA",
      detail: "Team member",
    },
    {
      id: "ftc",
      verificationUrl: null,
      team: null,
      teamNumber: null,
      resultDetail: "2nd Place Globally — 2024 · team result",
      scope: null,
      title: "FTC World Championship",
      shortTitle: "FTC WORLD",
      year: null,
      result: "3×",
      detail: "Three consecutive World Championship qualifications",
    },
    {
      id: "vex-iq",
      title: "VEX IQ Robotics Skills",
      shortTitle: "VEX IQ",
      year: null,
      result: "1ST",
      detail: "1st Place · team result",
      resultDetail: "Middle School Division · Dallas · Grade 8",
    },
    {
      id: "euclid",
      verificationUrl: null,
      team: null,
      teamNumber: null,
      resultDetail: null,
      scope: null,
      title: "Euclid Mathematics Contest",
      shortTitle: "EUCLID",
      year: 2026,
      result: "86/100",
      detail: "Honour Roll",
    },
    {
      id: "csmc",
      verificationUrl: null,
      team: null,
      teamNumber: null,
      resultDetail: null,
      scope: null,
      title: "Canadian Senior Mathematics Contest",
      shortTitle: "CSMC",
      year: 2025,
      result: "48/60",
      detail: "Honour Roll",
    },
    {
      id: "sin",
      verificationUrl: null,
      team: null,
      teamNumber: null,
      resultDetail: null,
      scope: null,
      title: "Sir Isaac Newton Physics Contest",
      shortTitle: "SIN PHYSICS",
      year: null,
      result: "TOP 5%",
      detail: "Globally",
    },
  ] satisfies Achievement[],
  skillGroups: [
    {
      id: "core",
      title: "Core",
      context: "The programming foundations",
      core: ["Python", "C++", "Java"],
      additional: [
        "JavaScript",
        "SQL",
        "HTML/CSS",
        "Object-Oriented Programming",
        "Data Structures & Algorithms",
      ],
    },
    {
      id: "ml",
      title: "AI / ML",
      context: "From data to evaluation",
      core: ["PyTorch", "scikit-learn", "Vision Transformers"],
      additional: [
        "NumPy",
        "pandas",
        "Matplotlib",
        "CNNs",
        "ResNet",
        "YOLO",
        "Transfer learning",
        "Fine-tuning",
        "Cross-validation",
        "Feature engineering",
        "Precision / recall / F1",
        "ROC-AUC",
      ],
    },
    {
      id: "vision",
      title: "Vision & robotics",
      context: "Perception meets control",
      core: ["OpenCV", "MediaPipe", "Sensor integration"],
      additional: [
        "PID control",
        "IMU fundamentals",
        "Sensor-fusion fundamentals",
      ],
    },
    {
      id: "systems",
      title: "Systems / software",
      context: "Connecting the components",
      core: [
        "Ollama / local LLM integration",
        "Multimodal systems",
        "REST APIs",
      ],
      additional: [
        "TypeScript",
        "Next.js / React",
        "Speech recognition",
        "RAG fundamentals",
        "Git",
        "Linux",
        "GitHub",
      ],
    },
  ] satisfies SkillGroup[],
};

export const navigation = [
  { label: "Profile", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Honours", href: "#achievements" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
