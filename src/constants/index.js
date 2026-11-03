import {
  mobile,
  backend,
  creator,
  web,
  github,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  ltimindtree,
  bytexl,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  ancile,
  version1,
} from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
    path: "/#home",
  },
  {
    id: "about",
    title: "About",
    path: "/#about",
  },
  {
    id: "experience",
    title: "Experience",
    path: "/#experience",
  },
  {
    id: "tech",
    title: "Skills",
    path: "/#skills",
  },
  {
    id: "work",
    title: "Projects",
    path: "/#projects",
  },
  {
    id: "blog",
    title: "Blog",
    path: "/blog",
  },
  {
    id: "contact",
    title: "Contact",
    path: "/#contact",
  },
];

const services = [
  {
    title: "Senior Full Stack AI Engineer",
    icon: web,
  },
  {
    title: "Agentic AI & RAG Engineer",
    icon: mobile,
  },
  {
    title: "Cloud & DevOps Engineer",
    icon: backend,
  },
  {
    title: "Technical Mentor",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Senior Software Engineer - AI & Full Stack",
    company_name: "Version 1 (via Ancile Digital) - Client: International Schools Partnership",
    icon: version1,
    iconBg: "#dff6f1",
    date: "April 2025 - Present | Bengaluru",
    points: [
      "Architected FastAPI microservices integrating OpenAI for summarization and LangChain + FAISS for RAG semantic search, exposed to React clients through REST APIs.",
      "Designed scalable backend systems using 12-Factor App principles, clean architecture, and event-driven patterns.",
      "Integrated AI-assisted code review and testing into Jenkins CI/CD pipelines to reduce regression cycles and improve release reliability.",
    ],
  },
  {
    title: "Web Developer & Technical Mentor - Full Stack & GenAI",
    company_name: "ByteXL",
    icon: bytexl,
    iconBg: "#103430",
    date: "September 2023 - March 2025 | Bengaluru",
    points: [
      "Designed Full Stack and AI curricula covering LLMs, RAG, LangChain, prompt engineering, embeddings, and vector databases; mentored 15+ learner batches.",
      "Led production application development, including an e-commerce analytics dashboard and tools for PDF parsing, summarization, transformation, and signal extraction.",
      "Introduced Docker, Kubernetes, and AWS (EC2, S3, Lambda) practices for scalable delivery of AI-enabled systems.",
    ],
  },
  {
    title: "Software Engineer - Full Stack (MERN) & Cloud",
    company_name: "LTI Mindtree",
    icon: ltimindtree,
    iconBg: "#dff6f1",
    date: "May 2022 - June 2023 | Bengaluru",
    points: [
      "Developed a monetized Next.js platform with React, Node.js, MongoDB, reusable components, CMS, and REST APIs.",
      "Integrated AWS EC2, S3, RDS, and Lambda with Jenkins CI/CD, achieving approximately 25% cost optimization and faster releases.",
      "Introduced LLM-powered recommendations and collaborated across product, QA, and design to streamline authentication and SDLC execution.",
    ],
  },
  {
    title: "Technical Mentor - AI, Cloud & Full Stack Engineering",
    company_name: "ICT Academy, Bizotic, JV Global, Atom, SeventhSense & Dlithe",
    icon: bytexl,
    iconBg: "#103430",
    date: "December 2020 - May 2022 | Bengaluru",
    points: [
      "Delivered 40+ workshops spanning Linux, shell scripting, AWS, Docker, Kubernetes, Lambda/IAM, SQL/NoSQL, and enterprise hiring preparation.",
      "Introduced early GenAI and data engineering topics, including LLMs, RAG, LangChain, embeddings, Kafka, Airflow, and ML deployment.",
      "Led technical training on network architecture, system workflows, and CI/CD with Docker and Kubernetes deployments.",
    ],
  },
];

const projects = [
  {
    name: "Connect2EdTech - Skills & Career Platform",
    description:
      "Education platform for industry-focused technical and non-technical courses, mentor guidance, trainer applications, certifications, and placement support.",
    tags: [
      {
        name: "edtech",
        color: "blue-text-gradient",
      },
      {
        name: "career-development",
        color: "green-text-gradient",
      },
      {
        name: "mentorship",
        color: "pink-text-gradient",
      },
    ],
    image: "/projects/connect2edtech-connect2future.gif",
    imagePosition: "center top",
    project_link: "https://connect2edtech.connect2future.com/",
  },
  {
    name: "Zentrax Constructions - Property & Building Services",
    description:
      "Construction and property platform covering residential and commercial spaces, architecture and interior design, construction, facility maintenance, property listings, and workforce support.",
    tags: [
      {
        name: "construction",
        color: "blue-text-gradient",
      },
      {
        name: "architecture",
        color: "green-text-gradient",
      },
      {
        name: "property-services",
        color: "pink-text-gradient",
      },
    ],
    image: "/projects/zentraxconstructions.gif",
    imagePosition: "center",
    project_link: "https://zentraxconstructions.com/",
  },
  {
    name: "Connect2Air - Aerial LED Advertising",
    description:
      "Aerial advertising platform for synchronized LED-drone displays, live events, brand launches, and campaign planning, with service packages, a drone catalog, and enquiry flows.",
    tags: [
      {
        name: "drone-led",
        color: "blue-text-gradient",
      },
      {
        name: "aerial-advertising",
        color: "green-text-gradient",
      },
      {
        name: "campaign-planning",
        color: "pink-text-gradient",
      },
    ],
    image: "/projects/Connect2air.gif",
    imagePosition: "center top",
    project_link: "https://connect2air.in/",
  },
  {
    name: "InsightDesk - AI Analytics Dashboard",
    description:
      "Angular analytics app with lazy-loaded modules, reactive forms, and role-based route guards. NgRx and RxJS power paginated and real-time data; a FastAPI + LangChain backend provides summaries and natural-language queries.",
    tags: [
      {
        name: "angular",
        color: "blue-text-gradient",
      },
      {
        name: "ngrx",
        color: "green-text-gradient",
      },
      {
        name: "fastapi",
        color: "pink-text-gradient",
      },
      {
        name: "langchain",
        color: "blue-text-gradient",
      },
    ],
    image: tripguide,
  },
  {
    name: "RAG-Enhanced Analytics Portal (MTD)",
    description:
      "Kinetics tracking and analytics platform combining RAG with Trino ingestion, OpenAI embeddings, and FAISS semantic search. FastAPI handles PDF and tabular extraction, with data stored in Supabase/MySQL and workloads deployed on AWS with Kubernetes scaling.",
    tags: [
      {
        name: "fastapi",
        color: "blue-text-gradient",
      },
      {
        name: "faiss",
        color: "green-text-gradient",
      },
      {
        name: "trino",
        color: "pink-text-gradient",
      },
      {
        name: "aws",
        color: "blue-text-gradient",
      },
    ],
    image: jobit,
  },
  {
    name: "ProductSphere - AI E-Commerce Intelligence",
    description:
      "Full-stack e-commerce analytics dashboard with LangChain + OpenAI product categorization, optimized ingestion using Promise.all and similarity filtering, and LLM-generated executive summaries.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "langchain",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
  },
  {
    name: "TelecomGPT - OSS/BSS Intelligence (Prototype)",
    description:
      "Domain-specific RAG prototype over 200+ telecom documents covering 3GPP, 5G NR, and OSS/BSS. Combined ChromaDB semantic search with LoRA fine-tuning on Mistral-7B and a FastAPI + NoSQL deployment.",
    tags: [
      {
        name: "rag",
        color: "blue-text-gradient",
      },
      {
        name: "lora",
        color: "green-text-gradient",
      },
      {
        name: "chromadb",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
  },
];

const skillGroups = [
  {
    title: "Generative & Agentic AI",
    skills: "OpenAI, Azure OpenAI, Claude API, Hugging Face, LangChain, prompt engineering, LoRA fine-tuning, MCP, multi-agent systems, tool calling, Claude Agent SDK, ReAct, workflow orchestration",
  },
  {
    title: "RAG & Retrieval",
    skills: "LlamaIndex, FAISS, Pinecone, ChromaDB, OpenAI embeddings, semantic search, vector databases",
  },
  {
    title: "Frontend",
    skills: "Angular, AngularJS, RxJS, NgRx, Angular Material, React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    title: "Backend & Languages",
    skills: "Node.js, Express, FastAPI, Flask, MERN, REST API design, Python, JavaScript, Java, shell scripting",
  },
  {
    title: "Cloud & DevOps",
    skills: "AWS (EC2, S3, Lambda, RDS, SQS, Athena, Amplify), Azure (ARM, IAM, Container Apps), Docker, Kubernetes, Jenkins CI/CD",
  },
  {
    title: "Data & Architecture",
    skills: "MongoDB, PostgreSQL, MySQL, Supabase, Kafka, Airflow, microservices, HLD/LLD, SDLC/Agile, event-driven design, ML deployment basics",
  },
];

const education = {
  program: "Micro-Credit Program in Computer Science",
  institution: "Indian Institute of Technology Guwahati (IIT Guwahati)",
  date: "2023 - 2025 | Guwahati, India",
  result: "CGPA: 8.0",
};

const certifications = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Issued Oct 2026 | Expires Oct 2029",
    image: "/certifications/aws-cloud-practitioner.png",
    imageAlt: "AWS Certified Cloud Practitioner badge",
    url: "https://www.credly.com/badges/3d83f660-c690-49ad-af02-90972842cea3/public_url",
  },
  {
    name: "Claude Certified Architect - Foundations",
    issuer: "Anthropic",
    date: "Issued Oct 2026 | Expires Oct 2029",
    image: "/certifications/claude-architect.png",
    imageAlt: "Claude Certified Architect badge",
    url: "https://www.credly.com/badges/ed1101c5-e8f7-4bf0-80fa-5d923402582f/public_url",
  },
  {
    name: "AI Tools in Practice",
    issuer: "Version 1",
    date: "Issued Sep 2026",
    image: "/certifications/version1-logo.png",
    imageAlt: "Version 1 logo",
    url: "https://www.coursera.org/account/accomplishments/records/GZRCIWXFZQIK",
  },
  {
    name: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    date: "Issued Jul 2026",
    image: "/certifications/anthropic-logo.png",
    imageAlt: "Anthropic logo",
    url: "https://verify.skilljar.com/c/z3bdxopygix5",
  },
  {
    name: "Claude Code in Action",
    issuer: "Anthropic",
    date: "Issued Jul 2026",
    image: "/certifications/anthropic-logo.png",
    imageAlt: "Anthropic logo",
    url: "https://verify.skilljar.com/c/2ekom5nu5mgy",
  },
  {
    name: "Building with the Claude API",
    issuer: "Anthropic",
    date: "Issued Jul 2026",
    image: "/certifications/anthropic-logo.png",
    imageAlt: "Anthropic logo",
    url: "https://verify.skilljar.com/c/2qgqzvf4r29e",
  },
  {
    name: "Introduction to Agent Skills",
    issuer: "Anthropic",
    date: "Issued Jun 2026",
    image: "/certifications/anthropic-logo.png",
    imageAlt: "Anthropic logo",
    url: "https://verify.skilljar.com/c/nn2hrsosn8we",
  },
  {
    name: "AWS re/Start Graduate",
    issuer: "Amazon Web Services",
    date: "Issued Mar 2025",
    image: "/certifications/aws-restart.png",
    imageAlt: "AWS re/Start Graduate badge",
    url: "https://www.credly.com/badges/6f1b3ff6-7520-466a-a6ff-967a34da6fe0/linked_in_profile",
  },
  {
    name: "Frontend Developer (React)",
    issuer: "HackerRank",
    date: "Issued Mar 2025",
    image: "/certifications/hackerrank.svg",
    imageAlt: "HackerRank icon",
    url: "https://www.hackerrank.com/certificates/iframe/71740828e3e0",
  },
  {
    name: "Node.js Intermediate",
    issuer: "HackerRank",
    date: "Issued Mar 2025",
    image: "/certifications/hackerrank.svg",
    imageAlt: "HackerRank icon",
    url: "https://www.hackerrank.com/certificates/iframe/7b823c566aec",
  },
  {
    name: "GitHub Copilot Certification",
    issuer: "Microsoft",
    image: github,
    imageAlt: "GitHub mark",
  },
  {
    name: "Salesforce Certified AI Associate",
    issuer: "Salesforce",
    date: "Expired Jan 2026",
    image: "/certifications/salesforce-logo.png",
    imageAlt: "Salesforce logo",
  },
];

export { services, technologies, experiences, projects, skillGroups, education, certifications };
