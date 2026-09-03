document.addEventListener('DOMContentLoaded', function () {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  /* ---------- Год в копирайте футера (чтобы не устаревал) ---------- */
  var footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ---------- Подсветка активного пункта меню ---------- */
  var eventsSubpages = ['archive.html'];
  document.querySelectorAll('[data-page]').forEach(function (link) {
    var linkPage = link.getAttribute('data-page');
    var isEventsSubpage = eventsSubpages.indexOf(currentPage) !== -1;
    if (linkPage === currentPage || (linkPage === 'activ.html' && isEventsSubpage)) {
      link.classList.add('active');
    }
  });

  /* ---------- Мобильное меню ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mobileNav = document.getElementById('main-nav-mobile');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.querySelectorAll('.mobile-sub-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parent = btn.closest('.mobile-has-sub');
        var isOpen = parent.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Кнопка "наверх" ---------- */
  var backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', function () {
      backToTopButton.classList.toggle('show', window.pageYOffset > 400);
    });
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Фильтры архива мероприятий (кнопки-пилюли) ---------- */
  var eventCards = document.querySelectorAll('.event-card');
  var filterGroups = document.querySelectorAll('.filter-pills');

  if (filterGroups.length && eventCards.length) {
    var state = { festival: 'all', year: 'all' };

    function applyFilters() {
      eventCards.forEach(function (card) {
        var festivalType = card.classList.contains('omut') ? 'omut' : 'ifest';
        var cardYear = '';
        if (card.id.indexOf('2025') !== -1) cardYear = '2025';
        else if (card.id.indexOf('2024') !== -1) cardYear = '2024';

        var festivalMatch = state.festival === 'all' || state.festival === festivalType;
        var yearMatch = state.year === 'all' || state.year === cardYear;

        card.style.display = festivalMatch && yearMatch ? '' : 'none';
      });
    }

    function setActivePill(group, value) {
      group.querySelectorAll('.filter-pill').forEach(function (pill) {
        var isActive = pill.getAttribute('data-value') === value;
        pill.classList.toggle('active', isActive);
        pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    filterGroups.forEach(function (group) {
      var key = group.getAttribute('data-filter');
      group.querySelectorAll('.filter-pill').forEach(function (pill) {
        pill.addEventListener('click', function () {
          var value = pill.getAttribute('data-value');
          state[key] = value;
          setActivePill(group, value);
          applyFilters();
        });
      });
    });

    /* Поддержка ?festival=ifest / ?festival=omut из шапки сайта */
    var params = new URLSearchParams(window.location.search);
    var festivalParam = params.get('festival');
    if (festivalParam === 'ifest' || festivalParam === 'omut') {
      state.festival = festivalParam;
      var festivalGroup = document.querySelector('.filter-pills[data-filter="festival"]');
      if (festivalGroup) setActivePill(festivalGroup, festivalParam);
    }

    applyFilters();
  }
});
