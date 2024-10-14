import React, { useEffect } from 'react';

const Navbar = () => {

  useEffect(() => {
    const handleNavbarClick = (e) => {
      const target = e.target;
      const navbar = document.getElementById('navbar');
      const header = document.getElementById('header');
      const background = document.getElementById('bg');
      const sections = document.querySelectorAll('section');
      const navlinks = document.querySelectorAll('#navbar .nav-link');
      const mobilenav = document.getElementById('mobilen');
      const toggleThemeBtn = document.getElementById('toggle-theme-btn');

      if (target.id === 'toggle-theme-btn'){
        document.body.classList.toggle('dark-theme');

      }else if(target.classList.contains('mobile-nav-toggle')) {
        navbar.classList.toggle('navbar-mobile');

        target.classList.toggle('bi-list');
        target.classList.toggle('bi-x');
      } else if (target.classList.contains('nav-link')) {
        e.preventDefault();
        const hash = target.getAttribute('href');
        navlinks.forEach(link => {
          link.classList.remove('active');
        });

        target.classList.add('active');

        if (hash === '#header') {
          header.classList.remove('header-top');
          background.classList.remove('header-top');
          navbar.classList.remove('navbar-mobile');
          mobilenav.classList.add('bi-list');
          mobilenav.classList.remove('bi-x');
          sections.forEach(section => {
            section.classList.remove('section-show');
          });
        } else {
          header.classList.add('header-top');
          background.classList.add('header-top');

          sections.forEach(section => {
            if (section.id === hash.substring(1)) {
              section.classList.add('section-show');
              navbar.classList.remove('navbar-mobile');
              mobilenav.classList.add('bi-list');
              mobilenav.classList.remove('bi-x');

            } else {
              section.classList.remove('section-show');
              navbar.classList.remove('navbar-mobile');
              mobilenav.classList.add('bi-list');
              mobilenav.classList.remove('bi-x');
            }
          });
        }
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    document.addEventListener('click', handleNavbarClick);

    let lastScrollTop = 0;
    const element = document.getElementById("header"); // Replace with your element's ID

    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop) {
        // Scroll down: Hide the element
        element.classList.add("hidden");
      } else {
        // Scroll up: Show the element
        element.classList.remove("hidden");
      }
      
      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener('click', handleNavbarClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
};

export default Navbar;
