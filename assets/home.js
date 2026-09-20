/* snack me up — jedyny skrypt strony głównej. Własny, bez zależności, bez sieci.
   Robi jedną rzecz: w sekcji „jak to działa" na szerokim ekranie telefon stoi w miejscu,
   a ekran w nim zmienia się razem z krokiem, który jest na środku okna.
   Bez skryptu, na wąskim ekranie albo przy prefers-reduced-motion sekcja zostaje
   w układzie statycznym z home.css — nic nie znika. */
(function () {
  var how = document.querySelector('.how');
  if (!how || !('IntersectionObserver' in window) || !window.matchMedia) return;

  var wide = window.matchMedia('(min-width: 900px)');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var steps = Array.prototype.slice.call(how.querySelectorAll('.step'));
  var stage = how.querySelector('.stage');
  var observer = null;

  function activate(index) {
    stage.setAttribute('data-active', index);
    steps.forEach(function (step, i) { step.classList.toggle('is-active', i === index); });
  }

  function enable() {
    how.classList.add('is-sticky');
    activate(0);
    /* rootMargin zwęża obszar obserwacji do poziomej linii na środku okna */
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(steps.indexOf(entry.target));
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    steps.forEach(function (step) { observer.observe(step); });
  }

  function disable() {
    how.classList.remove('is-sticky');
    steps.forEach(function (step) { step.classList.remove('is-active'); });
    if (observer) { observer.disconnect(); observer = null; }
  }

  function sync() {
    var want = wide.matches && !still.matches;
    if (want && !observer) enable();
    if (!want && observer) disable();
  }

  wide.addEventListener('change', sync);
  still.addEventListener('change', sync);
  sync();
})();
