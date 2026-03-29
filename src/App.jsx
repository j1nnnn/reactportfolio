import './App.scss'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import Parallax from './components/Parallax'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <section id="hero"><Hero /></section>
        <Parallax type="about" />
        <section id="about"><About /></section>
        <section id="experience"><Experience /></section>
        <section id="skills"><Skills /></section>
        <Parallax type="projects" />
        <section id="projects"><Projects /></section>
        <section id="education"><Education /></section>
        <Parallax type="contact" />
        <section id="contact"><Contact /></section>
      </main>
    </div>
  )
}
export default App
