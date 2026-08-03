const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hero = document.querySelector('.hero');
const pageShell = document.querySelector('.page-shell');
const nav = document.querySelector('.site-nav');
const heroCopy = document.querySelector('.hero-copy');
const eyebrow = document.querySelector('.eyebrow');
const lines = document.querySelectorAll('.hero-headline .line span');
const description = document.querySelector('.hero-description span');
const actions = document.querySelector('.hero-actions');
const video = document.querySelector('.hero-video');
const visual = document.querySelector('.system-overlay');
const systemCanvas = document.querySelector('.system-canvas');
const insightPanel = document.querySelector('.insight-panel');
const systemNodes = document.querySelectorAll('.system-node');
const projectItems = document.querySelectorAll('.project-item');
const projectVisual = document.querySelector('.project-visual');
const projectDetails = document.querySelectorAll('.project-detail');
const projectBriefModal = document.getElementById('projectBriefModal');
const projectBriefForm = document.getElementById('projectBriefForm');
let projectBriefOrigin = null;

function createFooterMarkup() {
  const currentYear = new Date().getFullYear();
  return `
    <div class="global-footer-shell">
      <div class="global-footer-feature">
        <a class="footer-brand" href="/" aria-label="Project Buddy home">
          <img src="/logo.jpg" alt="Project Buddy logo" />
        </a>
        <div class="footer-feature-copy">
          <h2 id="footer-heading">We engineer the systems<br />businesses run on.</h2>
          <p>Project Buddy designs and engineers custom software, enterprise applications and AI-enabled systems around real business operations.</p>
        </div>
        <a class="button footer-cta" href="#projectBriefModal" data-project-trigger>Start a Project →</a>
      </div>

      <div class="global-footer-links" aria-label="Footer navigation">
        <div class="footer-group">
          <p class="footer-group-title">Services</p>
          <a href="/services/custom-software-development">Custom Software Development</a>
          <a href="/services/ai-automation">AI Automation</a>
          <a href="/services/enterprise-software-development">Enterprise Software Development</a>
          <a href="/services/mobile-app-development">Mobile Application Development</a>
          <a href="/services/system-integration">System Integration</a>
        </div>
        <div class="footer-group">
          <p class="footer-group-title">Company</p>
          <a href="/company">About</a>
          <a href="/contact">Contact</a>
        </div>
        <div class="footer-group">
          <p class="footer-group-title">Explore</p>
          <a href="/work">Work</a>
          <a href="/services">Services</a>
        </div>
      </div>

      <div class="footer-legal-row">
        <div class="footer-legal-copy">
          <p class="footer-legal-label">PROJECT BUDDY</p>
          <p>Software Engineering / AI Automation / Digital Systems</p>
        </div>
        <div class="footer-legal-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms</a>
        </div>
        <p class="footer-copy">© ${currentYear} Project Buddy.</p>
      </div>
    </div>
  `;
}

function insertGlobalFooter() {
  if (document.querySelector('footer.global-footer')) return;
  const shell = document.querySelector('.page-shell');
  if (!shell) return;

  const footer = document.createElement('footer');
  footer.className = 'global-footer';
  footer.setAttribute('aria-labelledby', 'footer-heading');
  footer.innerHTML = createFooterMarkup();

  const modal = shell.querySelector('.project-brief-modal');
  if (modal) {
    shell.insertBefore(footer, modal);
  } else {
    shell.appendChild(footer);
  }
}

function initFooterReveal() {
  const footer = document.querySelector('.global-footer');
  if (!footer || !('IntersectionObserver' in window)) return;

  footer.classList.add('footer-reveal');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  observer.observe(footer);
}

function trackEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent('projectbuddy:event', { detail: { name, ...detail } }));
}

function projectBriefPayload() {
  const formData = new FormData(projectBriefForm);
  return {
    name: (formData.get('name') || '').trim(),
    email: (formData.get('email') || '').trim(),
    company: (formData.get('company') || '').trim(),
    phone: (formData.get('phone') || '').trim(),
    website: (formData.get('website') || '').trim(),
    projectTypes: formData.getAll('projectTypes'),
    description: (formData.get('description') || '').trim(),
    challenge: (formData.get('challenge') || '').trim(),
    stage: formData.get('stage') || '',
    timeline: formData.get('timeline') || '',
    budget: formData.get('budget') || '',
    websiteUrl: formData.get('websiteUrl') || '',
    submittedAt: formData.get('submittedAt') || '',
    sourcePage: formData.get('sourcePage') || window.location.href,
    landingPage: formData.get('landingPage') || sessionStorage.getItem('pbLandingPage') || window.location.href,
    referrer: formData.get('referrer') || document.referrer,
    utmSource: formData.get('utmSource') || '',
    utmMedium: formData.get('utmMedium') || '',
    utmCampaign: formData.get('utmCampaign') || '',
    utmContent: formData.get('utmContent') || '',
    utmTerm: formData.get('utmTerm') || ''
  };
}

function initProjectBrief() {
  if (!projectBriefModal || !projectBriefForm) return;

  if (projectBriefModal.parentElement !== document.body) {
    document.body.appendChild(projectBriefModal);
  }

  const openModal = () => {
    projectBriefModal.classList.add('is-open');
    projectBriefModal.hidden = false;
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    projectBriefModal.classList.remove('is-open');
    projectBriefModal.hidden = true;
    document.body.classList.remove('modal-open');
  };

  const closeButtons = projectBriefModal.querySelectorAll('[data-project-close]');
  const steps = Array.from(projectBriefForm.querySelectorAll('.brief-step'));
  const progress = Array.from(projectBriefForm.querySelectorAll('.brief-progress span'));
  const prevButton = projectBriefForm.querySelector('[data-brief-prev]');
  const nextButton = projectBriefForm.querySelector('[data-brief-next]');
  const submitButton = projectBriefForm.querySelector('[data-brief-submit]');
  const status = projectBriefForm.querySelector('.brief-status');
  const summary = projectBriefForm.querySelector('.brief-summary');
  const success = projectBriefForm.querySelector('.brief-success');
  const actions = projectBriefForm.querySelector('.brief-actions');
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let currentStep = 0;

  if (!projectBriefForm.querySelector('#briefStepRange')) {
    const progress = projectBriefForm.querySelector('.brief-progress');
    if (progress) {
      progress.insertAdjacentHTML('afterend', `
        <div class="brief-step-slider">
          <label for="briefStepRange">Jump to step</label>
          <input id="briefStepRange" type="range" min="0" max="4" step="1" value="0" aria-label="Jump to form step" />
          <div class="brief-step-slider-labels"><span>Start</span><span>Send</span></div>
        </div>
      `);
    }
  }

  const stepSlider = projectBriefForm.querySelector('#briefStepRange');

  if (!sessionStorage.getItem('pbLandingPage')) {
    sessionStorage.setItem('pbLandingPage', window.location.href);
  }

  function setHiddenValue(name, value) {
    const input = projectBriefForm.elements[name];
    if (input) input.value = value || '';
  }

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    setHiddenValue('submittedAt', String(Date.now()));
    setHiddenValue('sourcePage', window.location.href);
    setHiddenValue('landingPage', sessionStorage.getItem('pbLandingPage') || window.location.href);
    setHiddenValue('referrer', document.referrer);
    setHiddenValue('utmSource', params.get('utm_source'));
    setHiddenValue('utmMedium', params.get('utm_medium'));
    setHiddenValue('utmCampaign', params.get('utm_campaign'));
    setHiddenValue('utmContent', params.get('utm_content'));
    setHiddenValue('utmTerm', params.get('utm_term'));
  }

  function setStatus(message, isError = true) {
    status.textContent = message || '';
    status.style.color = isError ? '#b42318' : '#1265f3';
  }

  function clearFieldErrors() {
    projectBriefForm.querySelectorAll('.is-invalid').forEach((element) => {
      element.classList.remove('is-invalid');
    });
    projectBriefForm.querySelectorAll('.brief-field-error').forEach((element) => {
      element.remove();
    });
  }

  function attachFieldError(container, message) {
    if (!container) return;
    let errorEl = container.querySelector('.brief-field-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'brief-field-error';
      container.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function markFieldError(name, message) {
    if (name === 'projectTypes') {
      const fieldset = projectBriefForm.querySelector('.brief-choice-group');
      if (fieldset) {
        fieldset.classList.add('is-invalid');
        attachFieldError(fieldset, message);
      }
      return;
    }
    const input = projectBriefForm.elements[name];
    if (!input) return;
    const element = input instanceof RadioNodeList ? input[0] : input;
    if (!element) return;
    element.classList.add('is-invalid');
    const container = element.closest('label') || element.closest('.brief-textarea') || element;
    attachFieldError(container, message);
  }

  function applyErrors(errors) {
    clearFieldErrors();
    const stepIndexMap = {
      name: 0,
      email: 0,
      website: 0,
      projectTypes: 1,
      description: 1,
      challenge: 2,
      stage: 3,
      timeline: 3,
      budget: 3
    };
    const entries = Object.entries(errors || {});
    entries.forEach(([key, message]) => markFieldError(key, message));
    if (entries.length) {
      const [firstKey] = entries[0];
      const nextStep = typeof stepIndexMap[firstKey] === 'number' ? stepIndexMap[firstKey] : currentStep;
      showStep(nextStep);
      const firstErrorField = projectBriefForm.querySelector(`[name="${firstKey}"]`);
      if (firstErrorField && typeof firstErrorField.focus === 'function') {
        firstErrorField.focus({ preventScroll: true });
      }
    }
  }

  function updateSummary() {
    const data = projectBriefPayload();
    summary.innerHTML = [
      ['Name', data.name || 'Not provided'],
      ['Company', data.company || 'Not provided'],
      ['Project Type', data.projectTypes.join(', ') || 'Not selected'],
      ['Stage', data.stage || 'Not selected'],
      ['Timeline', data.timeline || 'Not selected']
    ].map(([label, value]) => `<p><strong>${label}:</strong> ${value.replace(/[<>&]/g, '')}</p>`).join('');
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => {
      step.classList.toggle('active', stepIndex === currentStep);
      // ensure step content is revealed but not changing shell height
      if (stepIndex === currentStep) step.hidden = false; else step.hidden = true;
    });
    progress.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex === currentStep));
    if (stepSlider) stepSlider.value = String(currentStep);
    prevButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    submitButton.hidden = currentStep !== steps.length - 1;
    setStatus('');
    if (currentStep === steps.length - 1) updateSummary();
    const containerScroll = projectBriefForm.querySelector('.brief-steps-scroll');
    if (containerScroll) containerScroll.scrollTop = 0;
    const firstField = steps[currentStep].querySelector('input, select, textarea, button');
    if (firstField) firstField.focus({ preventScroll: true });
  }

  if (stepSlider) {
    stepSlider.addEventListener('input', () => {
      const newStep = Number(stepSlider.value);
      if (!Number.isNaN(newStep)) showStep(newStep);
    });
  }

  function validateStep(index) {
    const data = projectBriefPayload();
    if (index === 0) {
      if (!data.name) return 'Full name is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'A valid work email is required.';
      if (data.website) {
        try {
          const url = new URL(data.website);
          if (!['http:', 'https:'].includes(url.protocol)) return 'Enter a valid website URL.';
        } catch {
          return 'Enter a valid website URL.';
        }
      }
    }
    if (index === 1) {
      if (!data.projectTypes.length) return 'Choose at least one project type.';
      if (data.description.length < 20) return 'Tell us a little more about the project.';
    }
    if (index === 3 && (!data.stage || !data.timeline || !data.budget)) return 'Choose the stage, timeline and budget range.';
    return '';
  }

  function openBrief(event, origin = null) {
    clearFieldErrors();
    if (event) {
      event.preventDefault();
      const target = event.target instanceof Element ? event.target : event.target?.parentElement || null;
      projectBriefOrigin = origin || target?.closest('[data-project-trigger], a[href="#projectBriefModal"]') || null;
    } else {
      projectBriefOrigin = null;
    }

    captureAttribution();
    openModal();
    success.hidden = true;
    actions.hidden = false;
    steps.forEach((step) => { step.hidden = false; });
    showStep(0);

    const source = projectBriefOrigin?.textContent?.trim() || 'unknown';

    trackEvent('start_project_opened', { source });

    if (window.location.hash === '#projectBriefModal') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }

  const finalStep = steps[steps.length - 1];
  if (finalStep && !finalStep.querySelector('[data-brief-submit-inline]')) {
    const inlineSubmit = document.createElement('button');
    inlineSubmit.className = 'button primary';
    inlineSubmit.type = 'submit';
    inlineSubmit.dataset.briefSubmitInline = 'true';
    inlineSubmit.textContent = 'Send Project Brief →';
    finalStep.appendChild(inlineSubmit);
  }

  function closeBrief() {
    closeModal();
    setStatus('');
    if (projectBriefOrigin && typeof projectBriefOrigin.focus === 'function') {
      projectBriefOrigin.focus();
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement || null;
    const trigger = target?.closest('[data-project-trigger], a[href="#projectBriefModal"]');
    if (!trigger) return;
    if (trigger.tagName.toLowerCase() === 'a' && trigger.getAttribute('href') !== '#projectBriefModal') return;
    if (event.defaultPrevented) return;
    openBrief(event, trigger);
  });
  closeButtons.forEach((button) => button.addEventListener('click', closeBrief));

  const shouldOpenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('project') === 'start' || params.get('project') === 'brief' || window.location.hash === '#projectBriefModal';
  };

  if (shouldOpenFromUrl()) {
    openBrief();
  }

  nextButton.addEventListener('click', () => {
    const error = validateStep(currentStep);
    if (error) {
      setStatus(error);
      return;
    }
    trackEvent('project_form_step_completed', { step: currentStep + 1 });
    if (currentStep === 0) trackEvent('project_form_started');
    showStep(currentStep + 1);
  });

  prevButton.addEventListener('click', () => showStep(currentStep - 1));

  if (stepSlider) {
    stepSlider.addEventListener('change', () => {
      const newStep = Number(stepSlider.value);
      if (!Number.isNaN(newStep)) showStep(newStep);
    });
  }

  projectBriefForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = validateStep(currentStep);
    if (error) {
      setStatus(error);
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add('is-submitting');
    submitButton.textContent = 'SENDING BRIEF...';
    setStatus('Sending project brief...', false);

    try {
      const response = await fetch('/api/project-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectBriefPayload())
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        if (result.errors) {
          applyErrors(result.errors);
          setStatus(result.message || 'Please review the highlighted fields.');
          return;
        }
        throw new Error(result.message || "We couldn't send the project brief. Please try again.");
      }
      trackEvent('project_form_submitted');
      steps.forEach((step) => { step.hidden = true; step.classList.remove('active'); });
      actions.hidden = true;
      success.hidden = false;
      setStatus('');
      success.querySelector('[data-project-close]').focus();
    } catch (error) {
      trackEvent('project_form_failed');
      setStatus(error.message || "We couldn't send the project brief. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove('is-submitting');
      submitButton.textContent = 'Send Project Brief →';
    }
  });

  document.addEventListener('keydown', (event) => {
    if (projectBriefModal.hidden) return;
    if (event.key === 'Escape') {
      closeBrief();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = Array.from(projectBriefModal.querySelectorAll(focusableSelector)).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

function initPageEntrance() {
  window.requestAnimationFrame(() => {
    if (pageShell) pageShell.classList.add('is-ready');
    if (hero) hero.classList.add('is-ready');
  });
}

function initMobileNavigation() {
  if (!nav) return;

  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  const panel = document.createElement('div');
  panel.className = 'mobile-nav-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="mobile-nav-sheet" role="dialog" aria-label="Mobile navigation">
      <a href="/services">Services</a>
      <a href="/#systems">Systems</a>
      <a href="/work">Work</a>
      <a href="/#engineering">Engineering</a>
      <a href="/company">Company</a>
      <a href="#projectBriefModal" data-project-trigger>Start a Project</a>
    </div>
  `;

  nav.appendChild(toggle);
  document.body.appendChild(panel);

  const closePanel = () => {
    panel.hidden = true;
    document.body.classList.remove('mobile-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openPanel = () => {
    panel.hidden = false;
    document.body.classList.add('mobile-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  panel.addEventListener('click', (event) => {
    if (event.target === panel) closePanel();
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closePanel);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel();
    }
  });
}

function initSectionReveals() {
  const sections = Array.from(document.querySelectorAll('.transition-section, .capabilities-section, .projects-section, .engineering-section, .stack-section, .buddy-section, .cta-section'));
  if (!sections.length) return;

  sections.forEach((section) => {
    section.classList.add('section-reveal');
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  sections.forEach((section) => observer.observe(section));
}

initPageEntrance();
insertGlobalFooter();
initMobileNavigation();
initProjectBrief();
initFooterReveal();
initSectionReveals();

function resetSystemInsight() {
  const activeNode = document.querySelector('.system-node.active');
  const titleEl = insightPanel ? insightPanel.querySelector('.insight-title') : null;
  const statusEl = insightPanel ? insightPanel.querySelector('.insight-status') : null;
  const workflowEl = insightPanel ? insightPanel.querySelectorAll('.insight-status')[1] : null;

  if (!activeNode) {
    if (titleEl) titleEl.textContent = 'SYSTEM / OPERATIONS';
    if (statusEl) statusEl.textContent = 'STATUS / CONNECTED';
    if (workflowEl) workflowEl.textContent = 'WORKFLOWS / ACTIVE';
    return;
  }

  const title = activeNode.dataset.title || 'OPERATIONS';
  const status = activeNode.dataset.status || 'STATUS / CONNECTED';
  const workflow = activeNode.dataset.workflow || 'WORKFLOWS / ACTIVE';

  if (titleEl) titleEl.textContent = `SYSTEM / ${title}`;
  if (statusEl) statusEl.textContent = status;
  if (workflowEl) workflowEl.textContent = workflow;
}

const hasGsap = Boolean(window.gsap && window.ScrollTrigger);

if (hero) {
  window.requestAnimationFrame(() => hero.classList.add('is-ready'));
}

if (!reducedMotion && hasGsap && hero) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set([eyebrow, lines, description, actions, visual], { willChange: 'transform, opacity, clip-path' });

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo(
    eyebrow,
    { y: 20, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    { y: 0, opacity: 1, clipPath: 'inset(0 0 0 0)', duration: 0.9 }
  );
  intro.fromTo(
    lines,
    { y: 52, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    { y: 0, opacity: 1, clipPath: 'inset(0 0 0 0)', stagger: 0.12, duration: 0.95 },
    '-=0.4'
  );
  intro.fromTo(
    description,
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8 },
    '-=0.35'
  );
  intro.fromTo(
    actions,
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8 },
    '-=0.35'
  );

  const heroScroll = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=1200',
      scrub: 1,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1
    }
  });

  heroScroll.to(heroCopy, { y: -130, opacity: 0, duration: 1, ease: 'power2.inOut' }, 0);
  heroScroll.to(video, { scale: 1.06, duration: 1, ease: 'power2.inOut' }, 0);
  heroScroll.to(visual, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.15);
  heroScroll.to('.hero-veil', { opacity: 0.2, duration: 0.7, ease: 'power2.out' }, 0.08);
  heroScroll.to(nav, { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'rgba(18,101,243,0.16)', backdropFilter: 'blur(16px)', duration: 0.5, ease: 'power2.out' }, 0.1);

  gsap.to('.system-overlay .line', {
    strokeDashoffset: -50,
    repeat: -1,
    duration: 8,
    ease: 'none',
    opacity: 0.85,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=1200',
      scrub: 0.5
    }
  });

  gsap.to('.system-overlay .node', {
    y: -5,
    repeat: -1,
    yoyo: true,
    duration: 2.2,
    ease: 'power1.inOut',
    stagger: 0.15,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=1200',
      scrub: 0.4
    }
  });

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: '+=1200',
    onToggle: (self) => {
      nav.classList.toggle('nav-scrolled', self.isActive);
    }
  });

  gsap.from('.transition-section', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.transition-section',
      start: 'top 82%',
      once: true
    }
  });

  const capabilitiesSection = document.querySelector('.capabilities-section');
  const capabilityStages = gsap.utils.toArray('.capability-stage');
  const capabilityProgressSteps = gsap.utils.toArray('.progress-step');
  const capabilityVisual = document.querySelector('.capabilities-visual');
  const systemLines = gsap.utils.toArray('.system-line');
  const systemNodes = gsap.utils.toArray('.system-node');
  const workflowNodes = gsap.utils.toArray('.workflow-node');
  const dataSignals = gsap.utils.toArray('.data-signal');
  const visualPanels = gsap.utils.toArray('.visual-panel');
  const visualStatus = document.querySelector('.visual-status');

  function setCapabilityStage(index) {
    capabilityStages.forEach((story, storyIndex) => {
      story.classList.toggle('active', storyIndex === index);
    });
    capabilityProgressSteps.forEach((step, stepIndex) => {
      step.classList.toggle('active', stepIndex === index);
    });
    capabilityVisual.classList.remove('stage-0', 'stage-1', 'stage-2', 'stage-3');
    capabilityVisual.classList.add(`stage-${index}`);

    const architecture = document.querySelector('.opening-architecture');
    if (architecture) {
      architecture.classList.add('visible');
    }
  }

  if (capabilitiesSection) {
    const capabilitiesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: capabilitiesSection,
        start: 'top 78%',
        end: 'bottom 30%',
        scrub: 0.8,
        invalidateOnRefresh: true
      }
    });

    gsap.set('.capabilities-copy', { x: -62, opacity: 0 });
    gsap.set('.capabilities-visual-wrap', { x: 64, opacity: 0 });
    gsap.set(capabilityStages, { x: -28, y: 26, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
    gsap.set(capabilityStages[0], { x: 0, y: 0, opacity: 1, clipPath: 'inset(0 0 0 0)' });
    gsap.set(systemLines, { strokeDashoffset: 240, opacity: 0.45 });
    gsap.set(systemNodes, { opacity: 0.92, y: 0 });
    gsap.set(workflowNodes, { opacity: 0, y: 16 });
    gsap.set(dataSignals, { opacity: 0, scale: 0.4 });
    gsap.set(visualPanels, { opacity: 0, y: 18, scale: 0.96 });
    gsap.set(visualStatus, { opacity: 0, y: 12 });

    capabilitiesTimeline.call(() => setCapabilityStage(0), null, 0);
    capabilitiesTimeline.fromTo('.capabilities-copy', { x: -62, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0);
    capabilitiesTimeline.fromTo('.capabilities-visual-wrap', { x: 64, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.04);
    capabilitiesTimeline.to(systemLines, { strokeDashoffset: 0, opacity: 0.85, duration: 0.4, stagger: 0.04 }, 0.08);
    capabilitiesTimeline.to('.capabilities-visual', { scale: 1, duration: 0.3 }, 0.08);
    capabilitiesTimeline.call(() => setCapabilityStage(1), null, 0.28);
    capabilitiesTimeline.to(workflowNodes, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04 }, 0.28);
    capabilitiesTimeline.to(systemNodes, { x: 0, y: 0, duration: 0.3 }, 0.28);
    capabilitiesTimeline.to(dataSignals, { opacity: 1, scale: 1, duration: 0.24, stagger: 0.05 }, 0.32);
    capabilitiesTimeline.call(() => setCapabilityStage(2), null, 0.62);
    capabilitiesTimeline.to(visualPanels, { opacity: 1, y: 0, scale: 1, duration: 0.26, stagger: 0.05 }, 0.62);
    capabilitiesTimeline.to(visualStatus, { opacity: 1, y: 0, duration: 0.26 }, 0.72);
    capabilitiesTimeline.call(() => setCapabilityStage(3), null, 0.92);
    capabilitiesTimeline.to('.capabilities-copy', { x: -18, opacity: 0.94, duration: 0.28 }, 0.95);
    capabilitiesTimeline.to('.capabilities-visual-wrap', { x: 14, opacity: 1, duration: 0.32 }, 0.96);
  }

  gsap.from('.project-shell', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.projects-section',
      start: 'top 80%',
      once: true
    }
  });

  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointerenter', () => {
      gsap.to(button, { y: -2, duration: 0.18, ease: 'power2.out' });
    });

    button.addEventListener('pointerleave', () => {
      gsap.to(button, { y: 0, duration: 0.2, ease: 'power2.out' });
    });
  });

  systemNodes.forEach((node) => {
    node.addEventListener('pointerenter', () => {
      systemNodes.forEach((item) => item.classList.remove('active'));
      node.classList.add('active');
      systemCanvas.classList.add('active');
      document.querySelectorAll('.connection').forEach((line) => line.classList.remove('active'));
      const title = node.dataset.title || 'OPERATIONS';
      const status = node.dataset.status || 'STATUS / CONNECTED';
      const workflow = node.dataset.workflow || 'WORKFLOWS / ACTIVE';
      const titleEl = insightPanel.querySelector('.insight-title');
      const statusEl = insightPanel.querySelector('.insight-status');
      const workflowEl = insightPanel.querySelectorAll('.insight-status')[1];
      titleEl.textContent = `SYSTEM / ${title}`;
      statusEl.textContent = status;
      workflowEl.textContent = workflow;
      gsap.to(insightPanel, { y: 0, opacity: 1, duration: 0.24, ease: 'power2.out' });
    });

    node.addEventListener('pointerleave', () => {
      systemCanvas.classList.remove('active');
      node.classList.remove('active');
      resetSystemInsight();
      gsap.to(insightPanel, { y: 8, opacity: 0.9, duration: 0.16, ease: 'power2.out' });
    });
  });

  if (systemCanvas) {
    systemCanvas.addEventListener('pointerleave', () => {
      systemCanvas.classList.remove('active');
      systemNodes.forEach((item) => item.classList.remove('active'));
      document.querySelectorAll('.connection').forEach((line) => line.classList.remove('active'));
      resetSystemInsight();
      gsap.to(insightPanel, { y: 8, opacity: 0.9, duration: 0.16, ease: 'power2.out' });
    });
  }

  const projectVariantMap = {
    'project-diamond': 'diamond',
    'project-instituteos': 'instituteos',
    'project-receptionist': 'project-receptionist',
    'project-atlas': 'project-atlas',
    'project-edusphere': 'project-edusphere',
    'project-fusion': 'project-fusion'
  };

  projectItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const target = item.dataset.project;
      const variant = projectVariantMap[target] || 'diamond';
      projectVisual.dataset.variant = variant;
      projectItems.forEach((entry) => entry.classList.remove('active'));
      item.classList.add('active');
      projectDetails.forEach((detail) => detail.classList.remove('active'));
      const activeDetail = document.getElementById(target);
      if (activeDetail) {
        activeDetail.classList.add('active');
      }
    });

    item.addEventListener('focus', () => {
      const target = item.dataset.project;
      const variant = projectVariantMap[target] || 'diamond';
      projectVisual.dataset.variant = variant;
      projectItems.forEach((entry) => entry.classList.remove('active'));
      item.classList.add('active');
      projectDetails.forEach((detail) => detail.classList.remove('active'));
      const activeDetail = document.getElementById(target);
      if (activeDetail) {
        activeDetail.classList.add('active');
      }
    });
  });

  const engineeringSteps = document.querySelectorAll('.engineering-step');
  engineeringSteps.forEach((step, index) => {
    step.addEventListener('mouseenter', () => {
      engineeringSteps.forEach((item) => item.classList.remove('active'));
      step.classList.add('active');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      gsap.to(step, { x: 8, duration: 0.25, ease: 'power2.out' });
      gsap.to(step.querySelector('h3'), { color: '#1265f3', duration: 0.2, ease: 'power2.out' });
    });

    step.addEventListener('mouseleave', () => {
      gsap.to(step, { x: 0, duration: 0.2, ease: 'power2.out' });
      gsap.to(step.querySelector('h3'), { color: '#10213b', duration: 0.2, ease: 'power2.out' });
    });
  });
} else {
  if (nav) nav.classList.add('nav-scrolled');
  if (hasGsap && heroCopy) {
    gsap.set([heroCopy, description, actions, visual].filter(Boolean), { opacity: 1, y: 0 });
    gsap.set(lines, { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' });
    if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
  }
  resetSystemInsight();
  projectItems.forEach((item) => item.classList.remove('active'));
  const firstProjectItem = document.querySelector('.project-item');
  const firstProjectDetail = document.querySelector('.project-detail');
  if (firstProjectItem) firstProjectItem.classList.add('active');
  if (firstProjectDetail) firstProjectDetail.classList.add('active');
}
