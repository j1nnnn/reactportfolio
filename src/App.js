import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Layout from './components/Layout';
import Contact from './components/Contact';


function App() {
  return (
    <>
    <Routes>
      <Route path="/reactportfolio/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/reactportfolio/about" element={<About />} />
        <Route path="/reactportfolio/contact" element={<Contact />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
