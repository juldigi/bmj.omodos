/* OMODOS browser Back navigation — standalone safety layer */
(function () {
  'use strict';
  if (window.__OMODOS_BROWSER_BACK_V2__) return;
  window.__OMODOS_BROWSER_BACK_V2__ = true;

  var FLAG = '__omodosBrowserBackV2';
  var stack = [];
  var ready = false;
  var replaying = false;
  var lastView = null;
  var originalSwitch = null;
  var observer = null;

  function activeView() {
    var el = document.querySelector('.view.active[id^="view-"]');
    return el ? el.id.slice(5) : 'dashboard';
  }
  function stateFor(view, index, guard) {
    var old = history.state && typeof history.state === 'object' ? history.state : {};
    var state = Object.assign({}, old);
    state[FLAG] = true;
    state.view = view;
    state.index = Math.max(0, index || 0);
    state.rootGuard = !!guard;
    return state;
  }
  function push(view, index, guard) {
    try {
      history.pushState(stateFor(view, index, guard), '', location.href);
      return true;
    } catch (err) {
      console.warn('[OMODOS Back] pushState failed', err);
      return false;
    }
  }
  function initialize() {
    if (ready) return;
    var view = activeView();
    stack = [view];
    lastView = view;
    try {
      history.replaceState(stateFor(view, 0, false), '', location.href);
      push(view, 0, true);
    } catch (err) {
      console.warn('[OMODOS Back] initialization failed', err);
    }
    ready = true;
    installObserver();
  }
  function recordView(view) {
    if (!view || view === lastView || replaying) return;
    var currentIndex = stack.length - 1;
    var previous = stack.lastIndexOf(view);
    if (previous >= 0 && previous < currentIndex) stack = stack.slice(0, previous + 1);
    else stack.push(view);
    lastView = view;
    push(view, stack.length - 1, false);
  }
  function installObserver() {
    if (observer || !document.documentElement || !window.MutationObserver) return;
    observer = new MutationObserver(function () {
      var view = activeView();
      if (view !== lastView && !replaying) recordView(view);
    });
    observer.observe(document.documentElement, {
      subtree: true, attributes: true, attributeFilter: ['class']
    });
  }
  function closeLayer() {
    var selectors = [
      ['#lightbox-bg.active', 'closeLightbox'],
      ['#camera-capture-bg.active', 'closeCameraCapture'],
      ['#bnav-sheet-bg.open', 'closeBnavSheet'],
      ['#sidebar-overlay.active', 'closeSidebarDrawer']
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i][0]);
      if (!el) continue;
      var fn = window[selectors[i][1]];
      if (typeof fn === 'function') fn();
      else el.classList.remove('active', 'open');
      return true;
    }
    var app = document.getElementById('app-root');
    if (app && app.classList.contains('menu-visible')) {
      if (typeof window.closeDashMenu === 'function') window.closeDashMenu();
      else app.classList.remove('menu-visible');
      return true;
    }
    var modal = document.getElementById('modal-bg');
    if (modal && modal.classList.contains('active')) {
      var cancel = document.getElementById('btn-cancel-entry-edit');
      var close = document.getElementById('btn-close-modal');
      if (cancel && cancel.offsetParent !== null) cancel.click();
      else if (close && close.offsetParent !== null) close.click();
      else if (typeof window.closeModal === 'function') window.closeModal();
      else modal.classList.remove('active');
      return true;
    }
    return false;
  }
  function localBack() {
    if (closeLayer()) return true;
    var view = activeView();
    function click(selector) {
      var el = document.querySelector(selector);
      if (el && !el.disabled && el.offsetParent !== null) {
        el.click();
        return true;
      }
      return false;
    }
    if (view === 'patrol') {
      if (click('#btn-patrol-back-2')) return true;
      if (click('#btn-patrol-back-1')) return true;
    }
    if (view === 'wiki' && click('#btn-wiki-back:not(:disabled)')) return true;
    if (view === 'report' && click('#btn-report-back-cat')) return true;
    if (view === 'report-hub' && click('#btn-report-hub-back-cat')) return true;
    return false;
  }
  function onPopState(event) {
    if (!ready) initialize();
    if (localBack()) {
      var idx = stack.length - 1;
      lastView = activeView();
      push(lastView, idx, idx === 0);
      return;
    }
    var state = event.state;
    if (state && state[FLAG] && typeof state.view === 'string') {
      var target = state.view;
      var index = Math.max(0, Number(state.index) || 0);
      stack = stack.slice(0, index + 1);
      if (!stack.length || stack[stack.length - 1] !== target) stack.push(target);
      lastView = target;
      if (target !== activeView() && typeof originalSwitch === 'function') {
        replaying = true;
        try { originalSwitch.call(window, target); }
        finally { replaying = false; }
      }
      if (index === 0) push(target, 0, true);
      return;
    }
    var fallback = stack.length > 1 ? stack[stack.length - 2] : (stack[0] || 'dashboard');
    if (stack.length > 1) stack.pop();
    lastView = fallback;
    if (fallback !== activeView() && typeof originalSwitch === 'function') {
      replaying = true;
      try { originalSwitch.call(window, fallback); }
      finally { replaying = false; }
    }
    push(fallback, stack.length - 1, stack.length <= 1);
  }
  function install() {
    if (ready) return;
    originalSwitch = window.switchToView;
    if (typeof originalSwitch === 'function') {
      window.switchToView = function (target) {
        if (!ready) initialize();
        var before = activeView();
        var result = originalSwitch.apply(this, arguments);
        var after = activeView();
        if (result !== false && after && after !== before) recordView(after);
        return result;
      };
    }
    initialize();
  }
  window.addEventListener('popstate', onPopState, true);
  document.addEventListener('keydown', function (event) {
    var key = event.key || '';
    var focus = document.activeElement;
    var editing = focus && focus.closest &&
      focus.closest('input,textarea,select,[contenteditable="true"],[role="textbox"]');
    var backKey = key === 'Escape' || key === 'BrowserBack' || key === 'GoBack' ||
      key === 'Back' || (key === 'Backspace' && !editing) ||
      (event.altKey && key === 'ArrowLeft');
    if (!backKey) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    try { history.back(); } catch (err) { localBack(); }
  }, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else install();
  window.addEventListener('load', function () {
    if (typeof window.switchToView === 'function' && !originalSwitch) install();
  }, { once: true });
})();