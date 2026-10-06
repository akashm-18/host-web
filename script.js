/* ── Shared nav HTML is in every page, script.js handles toggle ── */

(function () {
  'use strict';

  /* 1. Current-year footer ──────────────────────────────────── */
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* 2. Mobile nav toggle ────────────────────────────────────── */
  var toggle = document.getElementById('nav-toggle');
  var menu   = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') {
        menu.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    /* Close on nav link click (mobile) */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* 3. Contact form – mailto: fallback ──────────────────────── */
  var form = document.getElementById('contact-form');
  if (form) {
    var nameField    = document.getElementById('form-name');
    var emailField   = document.getElementById('form-email');
    var messageField = document.getElementById('form-message');
    var nameErr      = document.getElementById('error-name');
    var emailErr     = document.getElementById('error-email');
    var msgErr       = document.getElementById('error-message');
    var successBox   = document.getElementById('form-success');

    function showError(field, errorEl, msg) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      field.setAttribute('aria-invalid', 'true');
    }
    function clearError(field, errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
      field.removeAttribute('aria-invalid');
    }
    function isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    /* Live validation */
    nameField.addEventListener('input', function () {
      if (nameField.value.trim()) clearError(nameField, nameErr);
    });
    emailField.addEventListener('input', function () {
      if (isValidEmail(emailField.value)) clearError(emailField, emailErr);
    });
    messageField.addEventListener('input', function () {
      if (messageField.value.trim().length >= 10) clearError(messageField, msgErr);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!nameField.value.trim()) {
        showError(nameField, nameErr, 'Please enter your name.');
        valid = false;
      } else {
        clearError(nameField, nameErr);
      }

      if (!isValidEmail(emailField.value)) {
        showError(emailField, emailErr, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(emailField, emailErr);
      }

      if (messageField.value.trim().length < 10) {
        showError(messageField, msgErr, 'Message must be at least 10 characters.');
        valid = false;
      } else {
        clearError(messageField, msgErr);
      }

      if (!valid) return;

      /* Build mailto: link */
      var subject = encodeURIComponent('Enquiry from ' + nameField.value.trim());
      var body    = encodeURIComponent(
        'Name: '    + nameField.value.trim()    + '\n' +
        'Email: '   + emailField.value.trim()   + '\n\n' +
        'Message:\n' + messageField.value.trim()
      );
      window.location.href = 'mailto:hello@pakkaapp.app?subject=' + subject + '&body=' + body;

      /* Show confirmation UI */
      form.style.display = 'none';
      successBox.style.display = 'block';
    });
  }

})();
