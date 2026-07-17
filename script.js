document.addEventListener('DOMContentLoaded', () => {

  /* ---------- store hours + live open/closed status ---------- */
  const OPEN_HOUR = 9;   // 9:00 am
  const CLOSE_HOUR = 22; // 10:00 pm

  function updateStatus(){
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes()/60;
    const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;

    const dots = [document.getElementById('statusDot'), document.getElementById('statusDot2')];
    const texts = [document.getElementById('statusText'), document.getElementById('statusText2')];

    dots.forEach(d => { if(d){ d.classList.toggle('closed', !isOpen); } });

    let message;
    if (isOpen){
      message = `Open now · closes ${formatHour(CLOSE_HOUR)}`;
    } else if (hour < OPEN_HOUR) {
      message = `Closed · opens ${formatHour(OPEN_HOUR)} today`;
    } else {
      message = `Closed · opens ${formatHour(OPEN_HOUR)} tomorrow`;
    }
    texts.forEach(t => { if(t){ t.textContent = message; } });

    document.querySelectorAll('#hoursTable tr').forEach(row=>{
      row.classList.toggle('is-today', parseInt(row.dataset.day,10) === day);
    });
  }

  function formatHour(h){
    const period = h >= 12 ? 'pm' : 'am';
    let hr = h % 12;
    if (hr === 0) hr = 12;
    return `${hr}:00 ${period}`;
  }

  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav?.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', () => mainNav.classList.remove('open'));
  });

  /* ---------- review carousel dots (mobile) ---------- */
  const track = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  if (track && dotsWrap){
    const slips = track.querySelectorAll('.review-slip');
    slips.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.setAttribute('aria-label', `Show review ${i+1}`);
      b.addEventListener('click', () => {
        slips[i].scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
      });
      dotsWrap.appendChild(b);
    });

    const dotButtons = dotsWrap.querySelectorAll('button');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const idx = Array.from(slips).indexOf(entry.target);
          dotButtons.forEach(b => b.classList.remove('active'));
          if (dotButtons[idx]) dotButtons[idx].classList.add('active');
        }
      });
    }, { root: track, threshold: 0.6 });
    slips.forEach(s => io.observe(s));
  }

  /* ---------- back to top ---------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop?.classList.toggle('visible', window.scrollY > 500);
  }, { passive:true });
  toTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------- scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-copy, .receipt, .jar, .review-slip, .photo-card, .visit-info, .visit-map'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

});
