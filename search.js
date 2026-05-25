(function () {
  var OVERLAY_SCRIPT_SRC = 'https://cdn.jsdelivr.net/gh/naveennavveed-cpu/trifecta-search@main/overlay-controller.js';
  var LAUNCHER_SELECTOR = '[data-search-launcher]';
  var OPEN_DEBOUNCE_MS = 250;
  var PREFILL_DELAY_MS = 500;
  var TYPEWRITER_START_MS = 900;
  var TYPEWRITER_PAUSE_MS = 2200;
  var TYPEWRITER_NEXT_MS = 500;
  var TYPEWRITER_WRITE_MS = 55;
  var TYPEWRITER_DELETE_MS = 28;

  var exampleQuestions = [
    'What is venture debt?',
    'At what stage should a startup raise venture debt?',
    'What are the fintech companies in Trifecta Capital\'s portfolio?'
  ];

  var overlayPromise = null;
  var overlayLoaded = false;
  var lastOpenAt = 0;

  function loadOverlay() {
    if (overlayLoaded && window.__overlayCtrl) return Promise.resolve();
    if (window.__overlayCtrl) {
      overlayLoaded = true;
      return Promise.resolve();
    }
    if (overlayPromise) return overlayPromise;

    overlayPromise = new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = OVERLAY_SCRIPT_SRC;
      script.dataset.trifectaOverlay = 'true';
      script.onload = function() {
        overlayLoaded = true;
        overlayPromise = null;
        resolve();
      };
      script.onerror = function() {
        overlayLoaded = false;
        overlayPromise = null;
        reject(new Error('Unable to load Trifecta One overlay.'));
      };
      document.head.appendChild(script);
    });

    return overlayPromise;
  }

  function openOverlay() {
    return loadOverlay().then(function() {
      if (!window.__overlayCtrl) throw new Error('Trifecta One overlay did not initialize.');
      window.__overlayCtrl();
      return true;
    }).catch(function(error) {
      console.error(error.message || error);
      return false;
    });
  }

  function prefillWelcomeInput(term) {
    var input = document.getElementById('welcomeInput');
    if (!input) return;

    input.value = term;
    input.dispatchEvent(new Event('input'));
    input.focus();
  }

  function openSearch(query) {
    var term = (query || '').trim();
    return openOverlay().then(function(opened) {
      if (opened && term) {
        setTimeout(function() {
          prefillWelcomeInput(term);
        }, PREFILL_DELAY_MS);
      }
      return opened;
    });
  }

  function openFromLauncher(event) {
    if (event) event.preventDefault();
    if (window.__overlayJustClosed) return;

    var now = Date.now();
    if (now - lastOpenAt < OPEN_DEBOUNCE_MS) return;
    lastOpenAt = now;
    openSearch('');
  }

  function initLauncher(row) {
    if (!row || row.dataset.searchLauncherReady === 'true') return;

    var input = row.querySelector('input[type="text"]');
    var button = row.querySelector('.search-go-btn');
    if (!input) return;

    row.dataset.searchLauncherReady = 'true';
    row.setAttribute('aria-label', input.getAttribute('aria-label') || 'Open Trifecta One');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('tabindex', '-1');

    row.addEventListener('click', function(event) {
      if (event.target && event.target.closest && event.target.closest('.search-go-btn')) return;
      openFromLauncher(event);
    });
    input.addEventListener('mousedown', openFromLauncher);
    input.addEventListener('focus', function(event) {
      input.blur();
      openFromLauncher(event);
    });
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') openFromLauncher(event);
    });
    if (button) button.addEventListener('click', openFromLauncher);
  }

  function initTypewriter(input) {
    if (!input || input.dataset.searchTypewriterReady === 'true') return;

    input.dataset.searchTypewriterReady = 'true';

    var questionIndex = 0;
    var characterIndex = 0;
    var deleting = false;
    var paused = false;
    var timer = null;

    function schedule(delay) {
      timer = setTimeout(tick, delay);
    }

    function tick() {
      if (paused || input.value) return;

      var question = exampleQuestions[questionIndex];
      if (!deleting) {
        characterIndex++;
        input.placeholder = question.slice(0, characterIndex);
        if (characterIndex >= question.length) {
          deleting = true;
          schedule(TYPEWRITER_PAUSE_MS);
          return;
        }
        schedule(TYPEWRITER_WRITE_MS);
        return;
      }

      characterIndex--;
      input.placeholder = question.slice(0, characterIndex);
      if (characterIndex <= 0) {
        deleting = false;
        questionIndex = (questionIndex + 1) % exampleQuestions.length;
        schedule(TYPEWRITER_NEXT_MS);
        return;
      }
      schedule(TYPEWRITER_DELETE_MS);
    }

    input.addEventListener('focus', function() {
      paused = true;
      clearTimeout(timer);
      input.placeholder = '';
    });
    input.addEventListener('blur', function() {
      if (!input.value) {
        paused = false;
        characterIndex = 0;
        deleting = false;
        schedule(TYPEWRITER_NEXT_MS);
      }
    });

    schedule(TYPEWRITER_START_MS);
  }

  document.querySelectorAll(LAUNCHER_SELECTOR).forEach(initLauncher);
  initTypewriter(document.getElementById('globalSearchInput'));
  initTypewriter(document.getElementById('searchInput'));

  window.openChatPanel = openSearch;
  window.openTrifectaSearch = openSearch;
})();
