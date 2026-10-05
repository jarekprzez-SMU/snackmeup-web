/* snack me up — jedyny skrypt strony głównej. Własny, bez zależności, bez sieci.
   0. Etykieta kanału: ?c=grupy zastępuje „strona” w linkach sklepów.
   1. Opowieść (.story): przypina telefon i włącza etap ze środka okna; bez skryptu zostaje lista etapów.
   2. Pasek pobrania: po pierwszym ekranie, chowany przy sekcji pobrania.
   3. Zapasowe wejście .rise dla przeglądarek bez animation-timeline: view(). */
(function () {
  var c = /[?&]c=([a-z0-9-]{1,30})(&|$)/.exec(location.search);
  if (c) [].forEach.call(document.querySelectorAll('a[href*=strona]'), function (a) { a.href = a.href.replace(/strona/g, c[1]); });
  if (!('IntersectionObserver' in window) || !window.matchMedia) return;
  var root = document.documentElement, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mid = { rootMargin: '-50% 0px -50% 0px' }; /* obszar obserwacji zwężony do linii na środku okna */

  var all = document.querySelectorAll('.story');
  if (!still) [].forEach.call(all, function (st) {
    var q = function (s) { return [].slice.call(st.querySelectorAll(s)); };
    var beats = q('.beat'), marks = q('.track i'), segs = q('.segs i');
    var pin = st.querySelector('.pin'), act = st.querySelector('.act'), ghost = st.querySelector('.ghost');
    function show(i) {
      beats.forEach(function (b, k) { b.classList.toggle('on', k === i); });
      segs.forEach(function (s, k) { s.classList.toggle('on', k <= i); });
      pin.dataset.flip = i % 2;
      pin.dataset.last = i === beats.length - 1 ? 1 : 0;
      ghost.textContent = beats[i].dataset.time;
      act.textContent = beats[i].dataset.time + ' · ' + beats[i].dataset.act;
    }
    st.classList.add('is-pinned');
    show(0);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) show(marks.indexOf(e.target)); });
    }, mid);
    marks.forEach(function (m) { io.observe(m); });
    /* dwie opowieści na stronie: pasek pobrania chowa się, gdy którakolwiek jest na środku okna */
    new IntersectionObserver(function (es) { st.mid = es[0].isIntersecting; root.classList.toggle('is-story', [].some.call(all, function (x) { return x.mid; })); }, mid).observe(st);
  });

  var opener = document.querySelector('.opener'), get = document.getElementById('get');
  if (opener) new IntersectionObserver(function (es) { root.classList.toggle('is-past', !es[0].isIntersecting); }, { threshold: 0.2 }).observe(opener);
  if (get) new IntersectionObserver(function (es) { root.classList.toggle('is-end', es[0].isIntersecting); }, { threshold: 0.25 }).observe(get);

  if (still || (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()'))) return;
  root.classList.add('io-rise');
  var rise = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rise.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  [].forEach.call(document.querySelectorAll('.rise'), function (el) { rise.observe(el); });
})();
