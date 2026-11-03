import React from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { skillGroups, technologies } from "../constants";

const Tech = () => {
  return (
    <div>
      <div className='grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3'>
        {skillGroups.map((group) => (
          <section key={group.title}>
            <h2 className='text-white text-[20px] font-bold'>{group.title}</h2>
            <p className='mt-3 text-secondary text-[15px] leading-7'>{group.skills}</p>
          </section>
        ))}
      </div>

      <div className='mt-12 flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-28' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "skills");
