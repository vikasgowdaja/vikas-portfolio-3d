import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { certifications, education, services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='xs:w-[250px] w-full' tiltMaxAngleX={45} tiltMaxAngleY={45} scale={1} transitionSpeed={450}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const CertificationCard = ({ certification }) => {
  const content = (
    <>
      <div className='flex h-28 items-center justify-center'>
        {certification.image ? (
          <img
            src={certification.image}
            alt={certification.imageAlt}
            className={certification.imageAlt.includes("badge")
              ? "h-28 w-28 object-contain"
              : "h-12 w-12 rounded-md object-contain"}
          />
        ) : (
          <span className='text-[#7fe9df] text-[24px] font-bold'>HR</span>
        )}
      </div>
      <h4 className='mt-4 text-white text-[16px] font-semibold leading-6'>
        {certification.name}
      </h4>
      <p className='mt-1 text-secondary text-[14px]'>{certification.issuer}</p>
      {certification.date && (
        <p className='mt-1 text-secondary text-[12px]'>{certification.date}</p>
      )}
      {certification.url && (
        <span className='mt-4 inline-block text-[#7fe9df] text-[13px] underline underline-offset-4'>
          Verify credential
        </span>
      )}
    </>
  );

  const className = 'h-full min-h-[240px] rounded-lg border border-white/10 bg-tertiary/50 p-4 transition-colors hover:border-[#7fe9df]/50';

  return certification.url ? (
    <a
      href={certification.url}
      target='_blank'
      rel='noreferrer'
      className={`block ${className}`}
    >
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
};

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        Senior Full Stack AI Engineer with 6+ years of experience designing and delivering production-grade AI systems, full-stack applications, and cloud-native architectures. Focused on RAG and Agentic AI with LangChain, LlamaIndex, FAISS, Pinecone, and ChromaDB, alongside GenAI platforms built with Angular, MERN, and FastAPI. Experienced in end-to-end system design, AWS and Azure, and DevOps-driven delivery with Docker, Kubernetes, and Jenkins CI/CD.
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>

      <div className='mt-20'>
        <section>
          <h3 className='text-white text-[24px] font-bold'>Certifications</h3>
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {certifications.map((certification) => (
              <CertificationCard key={certification.name} certification={certification} />
            ))}
          </div>
        </section>

        <section className='mt-14 border-t border-[#2de2c5]/15 pt-8'>
          <h3 className='text-white text-[24px] font-bold'>Education</h3>
          <div className='mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end lg:gap-8'>
            <div>
              <p className='text-white text-[18px] font-semibold'>{education.program}</p>
              <p className='mt-1 text-secondary text-[15px]'>{education.institution}</p>
            </div>
            <p className='text-secondary text-[14px]'>{education.date}</p>
            <p className='text-white-100 text-[14px]'>{education.result}</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
