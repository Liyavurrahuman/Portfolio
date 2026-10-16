/**
 * ==============================================================================
 * LIYAVURAHUMAN - PERSONAL PORTFOLIO JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+) for Interactivity, Theme & Animations
 * ==============================================================================
 */

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------------------------------
  // 1. DOM Elements Selection
  // ----------------------------------------------------------------------------
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('theme-toggle');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');
  const typingTextSpan = document.getElementById('typing-text');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  // ----------------------------------------------------------------------------
  // 2. Dynamic Copyright Year
  // ----------------------------------------------------------------------------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------------------
  // 3. Dark / Light Mode Toggle with LocalStorage
  // ----------------------------------------------------------------------------
  const STORAGE_KEY = 'liya_theme_preference';
  const rootElement = document.documentElement;

  // Retrieve stored theme or default to system preference / dark
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Check if system prefers light
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  };

  const applyTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      const isLight = theme === 'light';
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggle.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }
  };

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Toggle button event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  }

  // ----------------------------------------------------------------------------
  // 4. Mobile Hamburger Navigation
  // ----------------------------------------------------------------------------
  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // Prevent body scroll when menu is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside of navMenu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 5. Header Sticky Background & Back-to-Top Button on Scroll
  // ----------------------------------------------------------------------------
  const handleScrollEffects = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blur and shadow
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back-to-top visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects(); // Run on initial load

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 6. Active Navigation Link Highlighting on Scroll
  // ----------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightActiveNavLink = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = header ? header.offsetHeight : 80;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerHeight - 120;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });
  highlightActiveNavLink();

  // ----------------------------------------------------------------------------
  // 7. Hero Section Dynamic Typing Effect
  // ----------------------------------------------------------------------------
  if (typingTextSpan) {
    const phrases = [
      'Aspiring Web Developer',
      'WordPress Developer',
      'Responsive UI Designer',
      'Creative Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDelay = 1800;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        // Remove character
        typingTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        // Add character
        typingTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeoutDuration = isDeleting ? deletingSpeed : typingSpeed;

      // When phrase is fully typed
      if (!isDeleting && charIndex === currentPhrase.length) {
        timeoutDuration = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // When phrase is completely cleared
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeoutDuration = 400;
      }

      setTimeout(typeLoop, timeoutDuration);
    };

    // Start typing loop
    setTimeout(typeLoop, 800);
  }

  // ----------------------------------------------------------------------------
  // 8. Projects Filtering
  // ----------------------------------------------------------------------------
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button state
        filterBtns.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedFilter = button.getAttribute('data-filter');

        // Filter projects with smooth transition
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');

          if (selectedFilter === 'all' || selectedFilter === cardCategory) {
            card.style.display = 'flex';
            // Slight timeout to trigger transition
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 9. Scroll Reveal Animations (IntersectionObserver)
  // ----------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, unobserve to maintain performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ----------------------------------------------------------------------------
  // 10. Contact Form Client-Side Validation & Feedback
  // ----------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Email validation regex (RFC 5322 compliant simplified)
    const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
      return emailRegex.test(String(email).toLowerCase());
    };

    // Helper to set error message on field
    const setError = (input, errorSpan, message) => {
      input.classList.add('invalid');
      if (errorSpan) {
        errorSpan.textContent = message;
      }
    };

    // Helper to clear error message
    const clearError = (input, errorSpan) => {
      input.classList.remove('invalid');
      if (errorSpan) {
        errorSpan.textContent = '';
      }
    };

    // Clear errors on user input
    [
      { input: nameInput, error: nameError },
      { input: emailInput, error: emailError },
      { input: subjectInput, error: subjectError },
      { input: messageInput, error: messageError }
    ].forEach(({ input, error }) => {
      if (input) {
        input.addEventListener('input', () => clearError(input, error));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        setError(nameInput, nameError, 'Please enter your name.');
        hasError = true;
      } else if (nameVal.length < 2) {
        setError(nameInput, nameError, 'Name must be at least 2 characters long.');
        hasError = true;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        setError(emailInput, emailError, 'Please enter your email address.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setError(emailInput, emailError, 'Please enter a valid email format (e.g. user@example.com).');
        hasError = true;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Subject
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      if (!subjectVal) {
        setError(subjectInput, subjectError, 'Please provide a subject for your message.');
        hasError = true;
      } else if (subjectVal.length < 3) {
        setError(subjectInput, subjectError, 'Subject must be at least 3 characters.');
        hasError = true;
      } else {
        clearError(subjectInput, subjectError);
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal) {
        setError(messageInput, messageError, 'Please enter your message.');
        hasError = true;
      } else if (messageVal.length < 10) {
        setError(messageInput, messageError, 'Message must be at least 10 characters long.');
        hasError = true;
      } else {
        clearError(messageInput, messageError);
      }

      // If validation fails, focus the first invalid input
      if (hasError) {
        const firstInvalid = contactForm.querySelector('.form-input.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Simulate sending state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Front-end simulation delay
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Display success status message
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>Success!</strong> Thank you, <em>${nameVal}</em>! Your message has been validated successfully.<br>
            <small>Note: To receive actual emails to your inbox from this static front-end, connect the form to a free backend service like Formspree, Web3Forms, or EmailJS.</small>
          `;
          formStatus.style.display = 'block';

          // Reset form fields
          contactForm.reset();

          // Auto-hide status message after 8 seconds
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 8000);
        }
      }, 1200);

    });
  }

});
