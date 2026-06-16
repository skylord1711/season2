/* ============================================
   ParrotPals MC — Season 2 Website
   Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================

  /** Change this email to send form submissions elsewhere. */
  const FORM_SUBMIT_EMAIL = 'parrotpalsbusiness@gmail.com';

  // ==========================================
  // DOM REFERENCES
  // ==========================================

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const ratingInput = document.getElementById('excitement');
  const ratingValue = document.getElementById('ratingValue');
  const ratingFill = document.getElementById('ratingFill');

  // ==========================================
  // MOBILE NAV TOGGLE
  // ==========================================

  navToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinkEls.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHT
  // ==========================================

  function updateActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinkEls.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================
  // RATING SLIDER
  // ==========================================

  function updateRating(value) {
    var val = parseInt(value, 10);
    ratingValue.textContent = val;

    // Map 1-10 to percentage width (1 = 10%, 10 = 100%)
    var percent = ((val - 1) / 9) * 100;
    ratingFill.style.width = percent + '%';

    // Color the value based on excitement level
    if (val <= 3) {
      ratingValue.style.color = 'var(--color-danger)';
    } else if (val <= 6) {
      ratingValue.style.color = 'var(--color-accent)';
    } else {
      ratingValue.style.color = 'var(--color-primary)';
    }
  }

  ratingInput.addEventListener('input', function () {
    updateRating(this.value);
  });

  // Initialize rating display
  updateRating(ratingInput.value);

  // ==========================================
  // FORM VALIDATION & SUBMISSION
  // ==========================================

  /**
   * Shows an error state on a form group.
   */
  function showError(group) {
    group.classList.add('invalid');
    var input = group.querySelector('input, textarea');
    if (input) {
      input.classList.add('error');
    }
  }

  /**
   * Clears error state from a form group.
   */
  function clearError(group) {
    group.classList.remove('invalid');
    var input = group.querySelector('input, textarea');
    if (input) {
      input.classList.remove('error');
    }
  }

  /**
   * Shows an error state on a form group.
   */
  function showError(group) {
    group.classList.add('invalid');
    var input = group.querySelector('input, textarea');
    if (input) {
      input.classList.add('error');
    }
  }

  /**
   * Clears error state from a form group.
   */
  function clearError(group) {
    group.classList.remove('invalid');
    var input = group.querySelector('input, textarea');
    if (input) {
      input.classList.remove('error');
    }
  }

  /**
   * Validates a single form group within a specific form.
   */
  function validateGroup(group) {
    clearError(group);
    var isRequired = group.classList.contains('required');
    if (!isRequired) return true;

    var input = group.querySelector('input[required], textarea[required]');
    if (input) {
      if (!input.value.trim()) {
        showError(group);
        return false;
      }
    }

    var radios = group.querySelectorAll('input[type="radio"][required]');
    if (radios.length > 0) {
      var checked = group.querySelector('input[type="radio"]:checked');
      if (!checked) {
        showError(group);
        return false;
      }
    }

    return true;
  }

  /**
   * Validates all required fields in a given form.
   */
  function validateForm(formEl) {
    var groups = formEl.querySelectorAll('.form-group');
    var isValid = true;

    groups.forEach(function (group) {
      if (!validateGroup(group)) {
        isValid = false;
      }
    });

    if (!isValid) {
      var firstError = formEl.querySelector('.form-group.invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  /**
   * Generic form submission handler.
   * Works with any form that uses the standard .feedback-form structure.
   */
  function setupFormValidation(formEl) {
    formEl.querySelectorAll('.form-group.required input, .form-group.required textarea').forEach(function (el) {
      el.addEventListener('blur', function () {
        validateGroup(this.closest('.form-group'));
      });
      el.addEventListener('input', function () {
        var group = this.closest('.form-group');
        if (group.classList.contains('invalid')) {
          validateGroup(group);
        }
      });
    });

    formEl.querySelectorAll('.form-group.required input[type="radio"]').forEach(function (el) {
      el.addEventListener('change', function () {
        var group = this.closest('.form-group');
        clearError(group);
      });
    });
  }

  /**
   * Sets up submission for one form.
   */
  function setupFormSubmit(formEl, submitBtnEl, formCardEl, successMsgEl) {
    setupFormValidation(formEl);

    formEl.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!validateForm(formEl)) return;

      submitBtnEl.classList.add('loading');
      submitBtnEl.disabled = true;

      var formData = new FormData(formEl);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });
      data._submitted = new Date().toISOString();

      try {
        var response = await fetch('https://formsubmit.co/ajax/' + FORM_SUBMIT_EMAIL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        var result = await response.json();

        if (result.success) {
          formEl.style.display = 'none';
          successMsgEl.classList.add('show');
          formCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert('Something went wrong. Please try again, or email us at ' + FORM_SUBMIT_EMAIL);
        }
      } catch (error) {
        alert('Something went wrong. Please try again, or email us at ' + FORM_SUBMIT_EMAIL);
      } finally {
        submitBtnEl.classList.remove('loading');
        submitBtnEl.disabled = false;
      }
    });
  }

  // Attach handler to Feedback form
  setupFormSubmit(
    document.getElementById('feedbackForm'),
    document.getElementById('submitBtn'),
    document.getElementById('formCard'),
    document.getElementById('successMessage')
  );

  // Attach handler to OG Tag form
  setupFormSubmit(
    document.getElementById('ogForm'),
    document.getElementById('ogSubmitBtn'),
    document.getElementById('ogFormCard'),
    document.getElementById('ogSuccessMessage')
  );

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================

  /**
   * Uses IntersectionObserver to add a 'visible' class
   * to elements when they scroll into view.
   */
  function initRevealAnimations() {
    var revealEls = document.querySelectorAll('.section-header, .form-card, #ogFormCard');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach(function (el) {
        el.classList.add('reveal');
        observer.observe(el);
      });
    } else {
      // Fallback: just show everything
      revealEls.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }

  initRevealAnimations();

})();
