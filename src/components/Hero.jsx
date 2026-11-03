import React, { useState } from "react";

const Hero = () => {
  const [portraitAvailable, setPortraitAvailable] = useState(true);

  return (
    <section className='relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 pb-14 pt-28 sm:px-16 lg:min-h-[590px]'>
      <div className='hero-grid absolute inset-0' aria-hidden='true' />

      <div className='relative z-10 grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='hero-copy'>
          <p className='hero-kicker'>Senior Full Stack AI Engineer</p>
          <h1 className='mt-6 max-w-3xl text-[42px] font-extrabold leading-[1.05] text-white sm:text-[58px]'>
            I BUILD AI-POWERED <span className='text-[#2de2c5]'>WEB EXPERIENCES</span>
          </h1>
          <p className='mt-5 max-w-xl text-[16px] leading-7 text-secondary sm:text-[18px]'>
            Production-grade AI systems, full-stack platforms, and cloud-native architecture built for real-world impact.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <a href='/#projects' className='button-primary'>
              View my work <span aria-hidden='true'>-&gt;</span>
            </a>
            <a href='/#contact' className='button-secondary'>
              Let&apos;s talk
            </a>
          </div>
          <div className='mt-8 flex items-center gap-4 text-[12px] text-secondary'>
            <span>FIND ME ON</span>
            <a
              href='https://www.linkedin.com/in/vikasgowdaja/'
              target='_blank'
              rel='noreferrer'
              className='text-white underline decoration-[#2de2c5]/70 underline-offset-4 hover:text-[#2de2c5]'
            >
              LinkedIn
            </a>
            <span className='h-1 w-1 rounded-full bg-[#2de2c5]' />
            <span>OPEN TO AI & FULL STACK OPPORTUNITIES</span>
          </div>
        </div>

        <div className='hero-portrait-wrap'>
          <div className='hero-portrait-frame'>
            {portraitAvailable ? (
              <img
                src='/vikas-portrait.png'
                alt='Vikas Gowda'
                className='hero-portrait'
                onError={() => setPortraitAvailable(false)}
              />
            ) : (
              <div className='hero-portrait-fallback' aria-label='Vikas Gowda portrait placeholder'>
                <span>VG</span>
                <p>Senior Full Stack AI Engineer</p>
              </div>
            )}
          </div>
          <div className='hero-status-panel'>
            <span className='status-light' />
            <div>
              <p className='text-[10px] uppercase text-secondary'>System status</p>
              <p className='mt-1 text-[13px] font-semibold text-white'>AI systems operational</p>
            </div>
            <span className='ml-auto text-[#2de2c5]'>+</span>
          </div>
          <div className='hero-code-panel' aria-hidden='true'>
            <span>AI / FULL STACK</span>
            <span>RAG // CLOUD // APPS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
