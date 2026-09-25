import { Topbar } from './Topbar.jsx';
import { Hero } from './Hero.jsx';
import { Stack } from './Stack.jsx';
import { Experience } from './Experience.jsx';
import { Education } from './Education.jsx';
import { Projects } from './Projects.jsx';
import { Contact, Footer } from './Contact.jsx';

export function App() {
  return (
    <>
      <Topbar />
      <main id="inicio">
        <Hero />
        <Stack />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
