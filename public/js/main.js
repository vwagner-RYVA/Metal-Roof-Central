// Metal Roof Central — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Header state and the thin scroll-progress line
  var header = document.querySelector('.site-header');
  var progressBar = document.querySelector('.scroll-progress');
  var scrollTicking = false;
  function updateScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progressBar) progressBar.style.transform = 'scaleX(' + p + ')';
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    scrollTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  // Expanding gallery: one panel open at a time. Hover (mouse), focus (keyboard)
  // and click/tap (touch) all open a panel; the open one stays open until another is chosen.
  var expander = document.querySelector('.expander');
  if (expander) {
    var panels = Array.prototype.slice.call(expander.querySelectorAll('.xp'));
    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    var stacked = window.matchMedia('(max-width: 1150px)');

    // In the stacked (phone/tablet) layout the open panel is sized to its content,
    // so the text never collides with the photo thumbnail whatever the screen width.
    // On desktop the inline height is cleared and the CSS flex layout takes over.
    var sizePanels = function () {
      panels.forEach(function (p) {
        if (stacked.matches && p.classList.contains('is-active')) {
          var info = p.querySelector('.xp-info');
          var thumb = p.querySelector('.xp-detail');
          var need = info.offsetHeight + 22 + (thumb ? thumb.offsetHeight + 16 : 0) + 28;
          p.style.height = Math.max(need, 360) + 'px';
        } else {
          p.style.height = '';
        }
      });
    };

    var openPanel = function (panel) {
      panels.forEach(function (p) {
        var on = p === panel;
        p.classList.toggle('is-active', on);
        var tab = p.querySelector('.xp-tab');
        if (tab) tab.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      sizePanels();
    };
    sizePanels();
    window.addEventListener('resize', sizePanels);
    window.addEventListener('load', sizePanels);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizePanels);
    panels.forEach(function (panel) {
      var tab = panel.querySelector('.xp-tab');
      if (!tab) return;
      tab.addEventListener('click', function () { openPanel(panel); });
      tab.addEventListener('focus', function () { openPanel(panel); });
      // Real mouse movement only, so a page scrolling under a resting pointer doesn't pop panels open.
      if (canHover) panel.addEventListener('mousemove', function () {
        if (!panel.classList.contains('is-active')) openPanel(panel);
      });
    });
  }

  // Scroll reveals. The "motion" class is set in <head> only when the visitor
  // allows motion, so without it everything stays visible and static.
  if (document.documentElement.classList.contains('motion')) {
    var revealTargets = document.querySelectorAll(
      '.section-head, .expander-key, .expander, .collection-note, .spec, .fine-print, .motive, .split > *, ' +
      '.note-panel, .care-includes, .pricing-panel, .audience article, .invite, .values-line, ' +
      '.faq-list, #contact-form, .contact-details'
    );
    var revealObserver = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger only the items that arrive in the same moment (e.g. a row of cards).
        el.style.transitionDelay = (Math.min(n, 4) * 90) + 'ms';
        el.classList.add('in');
        revealObserver.unobserve(el);
        n++;
        window.setTimeout(function () { el.style.transitionDelay = ''; }, 1500);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // Highlight the nav link for whichever section is in view (single-page site)
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Close the mobile nav after tapping an anchor link
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (links) links.classList.remove('open');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Buttons with data-prefill start the contact message for the visitor
  // (never overwrites anything they've already typed).
  document.querySelectorAll('[data-prefill]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var messageField = document.getElementById('message');
      if (messageField && !messageField.value.trim()) {
        messageField.value = btn.getAttribute('data-prefill');
      }
    });
  });

  // Contact form — builds a mailto so it works with zero backend/hosting.
  // Once real hosting is chosen, swap this handler for a form-processing
  // service or serverless function and remove the mailto fallback.
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var submitBtn = document.getElementById('contact-submit');
    var status = document.getElementById('form-status');

    // Each required field: how to check it, and what to say when it's wrong.
    var validators = {
      name: function (v) { return v.trim().length > 0 ? '' : 'Please enter your name.'; },
      email: function (v) {
        if (!v.trim()) return 'Please enter your email.';
        return contactForm.email.checkValidity() ? '' : 'Enter a valid email address.';
      },
      phone: function (v) {
        if (!v.trim()) return ''; // optional field
        var digits = v.replace(/\D/g, '');
        return digits.length >= 10 ? '' : 'Enter a valid phone number, or leave this blank.';
      },
      message: function (v) { return v.trim().length > 0 ? '' : 'Let us know what you need — a sentence or two is fine.'; }
    };

    function fieldWrap(input) { return input.closest('.form-field'); }

    function validateField(fieldName) {
      var input = contactForm[fieldName];
      var error = validators[fieldName](input.value);
      var errorEl = document.getElementById(fieldName + '-error');
      var wrap = fieldWrap(input);
      if (error) {
        wrap.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        if (errorEl) errorEl.textContent = error;
      } else {
        wrap.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        if (errorEl) errorEl.textContent = '';
      }
      return !error;
    }

    // Validate as the visitor leaves a field, not while they're still typing.
    Object.keys(validators).forEach(function (fieldName) {
      contactForm[fieldName].addEventListener('blur', function () {
        validateField(fieldName);
      });
      contactForm[fieldName].addEventListener('input', function () {
        if (fieldWrap(contactForm[fieldName]).classList.contains('invalid')) {
          validateField(fieldName);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fieldNames = Object.keys(validators);
      var allValid = true;
      var firstInvalid = null;
      fieldNames.forEach(function (fieldName) {
        var ok = validateField(fieldName);
        if (!ok) {
          allValid = false;
          if (!firstInvalid) firstInvalid = contactForm[fieldName];
        }
      });

      if (!allValid) {
        status.textContent = 'Please fix the highlighted fields below.';
        status.className = 'form-status error';
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var phone = contactForm.phone.value.trim();
      var role = contactForm.role.value;
      var message = contactForm.message.value.trim();

      var subject = 'Website inquiry from ' + name + ' (' + role + ')';
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone +
        '\nI am a: ' + role + '\n\nMessage:\n' + message;

      var mailto = 'mailto:metalroofcentral@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      // Briefly disable the button so a slow-to-open mail app doesn't invite a second click.
      submitBtn.disabled = true;
      status.textContent = '';
      status.className = 'form-status';

      window.location.href = mailto;

      window.setTimeout(function () {
        status.textContent = 'Opening your email app to send this to Metal Roof Central. If nothing opens, email us directly at metalroofcentral@gmail.com or call +1 (321) 290-6242.';
        status.className = 'form-status success';
        submitBtn.disabled = false;
      }, 400);
    });
  }
});
