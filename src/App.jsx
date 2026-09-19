import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import { About, Blog, Contact, Experience, Hero, Navbar, Studio, StudioVSCode, Tech, Works } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary app-shell'>
        <Navbar />
        <Routes>
          <Route
            path='/'
            element={
              <div className='hero-shell'>
                <Hero />
              </div>
            }
          />
          <Route path='/about' element={<About />} />
          <Route path='/experience' element={<Experience />} />
          <Route path='/tech' element={<Tech />} />
          <Route path='/work' element={<Works />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/studio' element={<Studio />} />
          <Route path='/studio/:modelId' element={<Studio />} />
          <Route path='/studio/vscode' element={<StudioVSCode />} />
          <Route path='/studio/vscode/:modelId' element={<StudioVSCode />} />
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
