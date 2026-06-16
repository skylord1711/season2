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

  /**
   * Target launch date for the countdown timer.
   * Format: 'YYYY-MM-DDTHH:mm:ss' in local time.
   * Adjust this to set the correct season launch date.
   */
  const LAUNCH_DATE = '2026-09-01T00:00:00';

  // ==========================================
  // DOM REFERENCES
  // ==========================================

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const form = document.getElementById('feedbackForm');
  const submitBtn = document.getElementById('submitBtn');
  const formCard = document.getElementById('formCard');
  const successMsg = document.getElementById('successMessage');
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
  // COUNTDOWN TIMER
  // ==========================================

  var countdownTarget = new Date(LAUNCH_DATE).getTime();

  function updateCountdown() {
    var now = new Date().getTime();
    var diff = countdownTarget - now;

    if (diff <= 0) {
      document.getElementById('countDays').textContent = '00';
      document.getElementById('countHours').textContent = '00';
      document.getElementById('countMinutes').textContent = '00';
      document.getElementById('countSeconds').textContent = '00';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = String(days).padStart(2, '0');
    document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

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
   * Validates a single form group.
   * Returns true if valid, false otherwise.
   */
  function validateGroup(group) {
    clearError(group);

    // Check if this group has required inputs
    var isRequired = group.classList.contains('required');
    if (!isRequired) return true;

    var input = group.querySelector('input[required], textarea[required]');
    if (input) {
      if (!input.value.trim()) {
        showError(group);
        return false;
      }
    }

    // Check radio buttons
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
   * Validates the entire form.
   * Returns true if all required fields are valid.
   */
  function validateForm() {
    var groups = document.querySelectorAll('.form-group');
    var isValid = true;

    groups.forEach(function (group) {
      if (!validateGroup(group)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      var firstError = document.querySelector('.form-group.invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  // Real-time validation on blur
  document.querySelectorAll('.form-group.required input, .form-group.required textarea').forEach(function (el) {
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

  // Real-time validation for radio groups
  document.querySelectorAll('.form-group.required input[type="radio"]').forEach(function (el) {
    el.addEventListener('change', function () {
      var group = this.closest('.form-group');
      clearError(group);
    });
  });

  /**
   * Submits the form using FormSubmit AJAX API.
   * Docs: https://formsubmit.com/ajax
   */
  async function submitForm(event) {
    event.preventDefault();

    if (!validateForm()) return;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Build form data object
    var formData = new FormData(form);
    var data = {};

    formData.forEach(function (value, key) {
      data[key] = value;
    });

    // Add a timestamp so we know when it was submitted
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
        // Hide the form, show the success message
        form.style.display = 'none';
        successMsg.classList.add('show');
        // Scroll to the success message
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Something went wrong. Please try again, or email us directly at ' + FORM_SUBMIT_EMAIL);
      }
    } catch (error) {
      alert('Something went wrong. Please try again, or email us directly at ' + FORM_SUBMIT_EMAIL);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  form.addEventListener('submit', submitForm);

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================

  /**
   * Uses IntersectionObserver to add a 'visible' class
   * to elements when they scroll into view.
   */
  function initRevealAnimations() {
    var revealEls = document.querySelectorAll('.section-header, .form-card');

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
