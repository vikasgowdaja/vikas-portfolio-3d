import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import { About, Blog, Contact, Experience, Hero, Navbar, Tech, Works } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary app-shell'>
        <Navbar />
        <Routes>
          <Route
            path='/'
            element={
              <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center border-b border-white/5'>
                <Hero />
              </div>
            }
          />
          <Route path='/about' element={<About />} />
          <Route path='/experience' element={<Experience />} />
          <Route path='/tech' element={<Tech />} />
          <Route path='/work' element={<Works />} />
          <Route path='/blog' element={<Blog />} />
          <Route
            path='/contact'
            element={
              <div className='relative z-0'>
                <Contact />
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
