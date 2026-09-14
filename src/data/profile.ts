export type Experience = {
  id: string;
  title: string;
  organization: string;
  period: string;
  year: number;
  category: string;
  statement: string;
  description: string;
  disciplines: string[];
  location?: string;
};
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  visual: "intelligence" | "medical" | "gesture" | "simulation";
  presentation: "flagship" | "case-study" | "secondary";
  details: string[];
  technologies: string[];
  evaluation?: { result: string; context: string };
  href?: string | null;
};
export type Achievement = {
  id: string;
  title: string;
  shortTitle: string;
  year: number | null;
  result: string;
  detail: string;
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
    github: null as string | null,
    linkedin: "https://linkedin.com/in/yubozhao-ai" as string | null,
    email: "bowenzhao2020@gmail.com" as string | null,
    resume: null as string | null,
  },
  education: {
    degree: "Bachelor of Software Engineering",
    graduation: 2031,
    status: "1A",
  },
  about:
    "I'm a Software Engineering student at the University of Waterloo, working across machine learning, robotics, and intelligent software.",
  philosophy:
    "From competitive AI and international robotics to quantitative research, I'm interested in what happens when a model becomes part of a larger system — with inputs to interpret, decisions to make, and real constraints to work within.",
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
        "Prepared across machine learning, deep learning, computer vision, NLP, data preparation, and model optimization. Worked on advanced AI problems involving algorithmic reasoning, experimental design, performance evaluation, and optimization under competitive constraints.",
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
      organization: "FIRST Tech Challenge World Championship",
      period: "2024",
      year: 2024,
      category: "INTERNATIONAL ROBOTICS",
      statement: "2nd Place Globally. Built together, under pressure.",
      description:
        "Collaborated across software, mechanical, electrical, and strategy to develop and optimize a competition robot for autonomous and driver-controlled performance. The work involved iterative engineering, sensor integration, autonomous-control logic, debugging, and performance tuning in a high-pressure international competition environment.",
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
        "Supported financial machine-learning workflows through preprocessing, feature engineering, model evaluation, signal validation, and performance benchmarking. Investigated predictive modeling, risk analysis, backtesting, leakage prevention, generalization, and overfitting control.",
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
        "A modular personal AI assistant bringing local LLM inference, speech, persistent memory, external APIs, and real-time computer vision into one system. Voice, text, and camera input meet in a unified multimodal assistant.",
      details: [
        "Combines local LLM inference with external APIs through a modular Python system.",
        "Connects speech-to-text and text-to-speech with text and camera input.",
        "Integrates persistent memory and real-time computer vision alongside the language model.",
      ],
      technologies: [
        "Python",
        "Ollama",
        "OpenCV",
        "Speech systems",
        "APIs",
        "LLM integration",
      ],
      href: null,
    },
    {
      id: "brain-tumor",
      title: "Brain Tumor Detection System",
      subtitle: "Compact model. Careful evaluation.",
      category: "MACHINE LEARNING / MEDICAL IMAGING",
      presentation: "case-study",
      visual: "medical",
      description:
        "An MRI classification pipeline built with a compact vision-transformer architecture. The experiment goes beyond accuracy to examine precision, recall, F1 score, and the conditions under which a model generalizes.",
      details: [
        "Developed a Python / PyTorch pipeline using MiniMaxViT for MRI classification.",
        "Experimented with image preprocessing, augmentation, oversampling, class balancing, and validation strategies.",
        "Evaluated precision, recall, F1 score, and confusion matrices, with attention to generalization and dataset artifacts.",
      ],
      technologies: ["Python", "PyTorch", "MiniMaxViT", "Medical Imaging"],
      href: null,
    },
    {
      id: "gesture",
      title: "Gesture-Controlled Drawing Interface",
      subtitle: "From hand movement to intent.",
      category: "COMPUTER VISION / INTERACTION",
      presentation: "secondary",
      visual: "gesture",
      description:
        "A real-time drawing interface that turns 21-point hand landmarks into open-hand, closed-hand, and pointing gestures using a Random Forest classifier.",
      details: [
        "Implemented drawing, erasing, tool switching, snapshot capture, and precise pointing coordinates.",
        "Used temporal smoothing, gesture-state logic, and latency controls to stabilize real-time interaction.",
      ],
      technologies: ["Python", "OpenCV", "MediaPipe", "scikit-learn"],
      evaluation: {
        result: "≈98%",
        context: "Test accuracy on the project's test split.",
      },
      href: null,
    },
    {
      id: "future-sim",
      title: "Future-Sim",
      subtitle: "World Model Prototype",
      category: "SIMULATION / PREDICTIVE SYSTEMS",
      presentation: "secondary",
      visual: "simulation",
      description:
        "A configurable simulation framework for world-state representation, environment dynamics, future-state generation, and outcome estimation. An exploration of predictive world-model reasoning.",
      details: [
        "Represented configurable world states and environment dynamics in a Python simulation framework.",
        "Explored future-state generation and outcome estimation as building blocks for predictive world-model reasoning.",
      ],
      technologies: ["Python", "NumPy", "Pygame"],
      href: null,
    },
  ] satisfies Project[],
  achievements: [
    {
      id: "ioai",
      title: "International Olympiad in Artificial Intelligence",
      shortTitle: "IOAI",
      year: 2025,
      result: "TEAM CANADA",
      detail: "Team member",
    },
    {
      id: "ftc",
      title: "FTC World Championship",
      shortTitle: "FTC WORLD",
      year: 2024,
      result: "2ND",
      detail: "Globally · team result",
    },
    {
      id: "euclid",
      title: "Euclid Mathematics Contest",
      shortTitle: "EUCLID",
      year: 2026,
      result: "86/100",
      detail: "Honour Roll",
    },
    {
      id: "csmc",
      title: "Canadian Senior Mathematics Contest",
      shortTitle: "CSMC",
      year: 2025,
      result: "48/60",
      detail: "Honour Roll",
    },
    {
      id: "sin",
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
        "RAG fundamentals",
        "Speech recognition",
        "Git",
        "GitHub",
        "Linux",
        "VS Code",
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
