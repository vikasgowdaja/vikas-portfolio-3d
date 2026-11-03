import React from "react";

import { About, Contact, Experience, Hero, Tech, Works } from "./index";

const highlights = [
  { value: "6+", label: "Years of experience" },
  { value: "40+", label: "Technical workshops" },
  { value: "15+", label: "Learner batches" },
  { value: "4", label: "AI portfolio projects" },
];

const PortfolioHome = () => (
  <>
    <div id='home' className='hero-shell'>
      <Hero />
    </div>

    <div className='mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 py-6 sm:grid-cols-4 sm:px-16'>
      {highlights.map((highlight) => (
        <div key={highlight.label} className='metric-tile'>
          <strong>{highlight.value}</strong>
          <span>{highlight.label}</span>
        </div>
      ))}
    </div>

    <About />
    <Experience />
    <Tech />
    <Works />
    <Contact />
  </>
);

export default PortfolioHome;