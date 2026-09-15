import {
  mobile,
  backend,
  creator,
  web,
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
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Full Stack Developer",
    icon: web,
  },
  {
    title: "MERN Stack Specialist",
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
    title: "Senior Software Engineer",
    company_name: "Ancile Digital",
    icon: ancile,
    iconBg: "#dff6f1",
    date: "April 2025 - Present",
    points: [
      "Working as Senior Full Stack Developer deployed to Version 1 supporting International Schools Partnership (ISP), a global network.",
      "Developing and maintaining scalable full-stack applications using the MERN stack with cloud-integrated solutions.",
      "Building automation and intelligent workflows leveraging AWS Amplify, SQS, Athena, and OpenAI.",
      "Integrating third-party platforms such as ClassLink to enhance security, authentication, and interoperability.",
    ],
  },
  {
    title: "Web Developer & Technical Mentor",
    company_name: "ByteXL",
    icon: version1,
    iconBg: "#103430",
    date: "September 2023 - April 2025",
    points: [
      "Developed and maintained web applications using React.js, Next.js, and Tailwind CSS, enhancing UI/UX and mobile responsiveness.",
      "Built scalable backend services with Node.js, Express.js, and MongoDB, leveraging RESTful architecture.",
      "Deployed containerized applications on AWS using Docker and managed deployments via Kubernetes.",
      "Ensured high availability and fault tolerance across production environments.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "LTI Mindtree",
    icon: ltimindtree,
    iconBg: "#dff6f1",
    date: "May 2022 - June 2023",
    points: [
      "Customized responsive website for Harvard Medical School's Educational Offerings, aligning with business and technical requirements.",
      "Developed and deployed full-stack applications using the MERN stack, optimizing for performance and scalability.",
      "Utilized AWS services (EC2, S3, RDS, Lambda) for cloud-based deployments and storage.",
      "Reduced infrastructure costs by 20% through efficient cloud resource management.",
    ],
  },
  {
    title: "Technical Mentor",
    company_name: "EdTech",
    icon: bytexl,
    iconBg: "#103430",
    date: "December 2020 - May 2022",
    points: [
      "Collaborated with organizations including ICT Academy, Bizotic, JV Global, Atom, SeventhSense, and Dlithe.",
      "Mentored students on cloud fundamentals and DevOps practices.",
      "Taught introductory AWS services and containerization concepts.",
      "Developed course curriculum and hands-on lab exercises for learners.",
    ],
  },
];

const projects = [
  {
    name: "ProductSphere",
    description:
      "E-Commerce Product Marketplace Dashboard with interactive filtering by price, brand, category, and availability. Features collapsible sidebar navigation using shadcn/ui and Radix primitives with centralized API integration layer.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "typescript",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "Analytics Portal (MTD)",
    description:
      "Monthly Tracking & Analytics Platform enabling MTD data processing with Flask backend APIs. Features dynamic dashboards using Vite + TypeScript, secure auth/storage via Supabase, PDF parsing, and analytics generation using Pandas and NumPy.",
    tags: [
      {
        name: "flask",
        color: "blue-text-gradient",
      },
      {
        name: "typescript",
        color: "green-text-gradient",
      },
      {
        name: "supabase",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Harvard Medical School Platform",
    description:
      "Customized responsive website for Harvard Medical School's Educational Offerings, developed with MERN stack. Optimized for performance and scalability with cloud-based deployment on AWS infrastructure.",
    tags: [
      {
        name: "mern",
        color: "blue-text-gradient",
      },
      {
        name: "aws",
        color: "green-text-gradient",
      },
      {
        name: "responsive",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, projects };
