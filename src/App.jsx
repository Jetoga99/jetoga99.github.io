import { useEffect } from 'react';
import { Topbar } from './Topbar.jsx';
import { Hero } from './Hero.jsx';
import { Pipeline } from './Pipeline.jsx';
import { Experience } from './Experience.jsx';
import { Education } from './Education.jsx';
import { Projects } from './Projects.jsx';
import { Contact, Footer } from './Contact.jsx';

// Hace aparecer cada bloque marcado con data-reveal cuando su borde superior entra en pantalla.
// También revela los que ya quedaron arriba (p. ej. al saltar con un enlace del menú)
function useReveal() {
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const limit = window.innerHeight * 0.88;
      document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add('in');
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}

// Orden: el átomo se desarma en la trayectoria y desemboca en los proyectos
export function App() {
  useReveal();
  return (
    <>
      <Pipeline />
      <Topbar />
      <main id="inicio">
        <Hero />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
