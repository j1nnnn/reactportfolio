import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Layout from './components/Layout';
import Contact from './components/Contact';
import Education from './components/Education';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="education" element={<Education />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="projects" element={<Projects />} />
        <Route path="experience" element={<Experience />} />
        <Route path="skills" element={<Skills />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
