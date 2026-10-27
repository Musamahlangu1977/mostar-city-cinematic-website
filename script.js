document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".cinema-scroll");
  const root = document.documentElement;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  const reduceMotion = { get matches() { return paused || motionPreference.matches; } };
  const motionToggle = document.querySelector('.motion-toggle');
  motionToggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  function syncMotion() {
    document.body.classList.toggle('motion-paused', reduceMotion.matches);
    motionToggle.setAttribute('aria-pressed', String(reduceMotion.matches));
    motionToggle.setAttribute("aria-label", reduceMotion.matches ? "Motion disabled" : "Pause ambient animation");
    motionToggle.textContent = reduceMotion.matches ? 'Motion off' : 'Pause motion Ⅱ';
    targetMouseX = targetMouseY = 0;
    requestTick();
  }
  motionPreference.addEventListener('change', syncMotion);
  const track = document.querySelector(".sights-track");
  const sightsControls = document.querySelector(".sights-controls");
  const prevBtn = document.querySelector(".sight-prev");
  const nextBtn = document.querySelector(".sight-next");
  const originalCards = Array.from(document.querySelectorAll(".sight-card"));

  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetScroll = 0;
  let smoothScroll = 0;
  let initialized = false;
  let rafPending = false;
  let sightCards = [];
  let originalSightCount = originalCards.length || 5;
  let activeSight = 0;

  // Helpers
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const smoothstep = (e0, e1, v) => {
    const x = clamp((v - e0) / (e1 - e0));
    return x * x * (3 - 2 * x);
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const segmentInOut = (s, a, b, c, d) => {
    const enter = smoothstep(a, b, s);
    const exit = smoothstep(c, d, s);
    return { enter, exit, active: enter * (1 - exit) };
  };
  const getScrollDistance = () => {
    if (!section) return 0;
    return clamp(
      -section.getBoundingClientRect().top,
      0,
      section.offsetHeight - window.innerHeight
    );
  };

  function requestTick() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(update);
    }
  }

  let lastTime = 0;
  function update(time = performance.now()) {
    const elapsed = Math.min(64, time - lastTime || 16.67); lastTime = time;
    rafPending = false;

    targetScroll = getScrollDistance();
    if (!initialized || reduceMotion.matches) {
      smoothScroll = targetScroll;
      initialized = true;
    } else {
      smoothScroll = lerp(smoothScroll, targetScroll, 1 - Math.exp(-elapsed / 105));
    }
    if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

    if (reduceMotion.matches) {
      mouseX = 0;
      mouseY = 0;
    } else {
      mouseX = lerp(mouseX, targetMouseX, 1 - Math.exp(-elapsed / 130));
      mouseY = lerp(mouseY, targetMouseY, 1 - Math.exp(-elapsed / 130));
    }

    const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
    const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
    const progress = clamp(smoothScroll / 2700);
    const introExit = smoothstep(90, 650, smoothScroll);
    const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
    const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
    const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
    const blurActive = clamp(frame2.active + frame3.active);
    const frame2Opacity = frame2.active * (1 - frame3.enter);
    const splitDrift = Math.pow(frame2.enter, 1.5);
    const panel2Opacity = frame2.active * (1 - frame2.exit);
    const panel3Opacity = frame3.active * (1 - frame3.exit);
    const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
    const sharedHeroY = progress * -74;
    const sharedHeroScale = progress * 0.23;
    const sightsScreenTop = Math.max(window.innerWidth < 641 ? 180 : 145, window.innerHeight * 0.22);
    const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;

    root.style.setProperty("--mx", reduceMotion.matches ? "0" : mouseX.toFixed(4));
    root.style.setProperty("--my", reduceMotion.matches ? "0" : mouseY.toFixed(4));

    root.style.setProperty("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
    root.style.setProperty("--back-x", `${(mouseX * -12).toFixed(4)}px`);
    root.style.setProperty("--back-y", `${(mouseY * -4).toFixed(4)}px`);
    root.style.setProperty("--back-scale", backScale.toFixed(4));
    root.style.setProperty("--four-y", `${(10 + progress * 10).toFixed(4)}vh`);
    root.style.setProperty("--four-scale", (0.78 + progress * 0.16).toFixed(4));
    root.style.setProperty("--bazaar-y", `${(20 - progress * 8).toFixed(4)}vh`);
    root.style.setProperty("--blur-px", `${(blurActive * 14).toFixed(4)}px`);
    root.style.setProperty("--back-brightness", (1 - blurActive * 0.255).toFixed(4));
    root.style.setProperty("--bazaar-blur-px", `${(frame2.active * 14).toFixed(4)}px`);
    root.style.setProperty("--bazaar-brightness", (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4));
    root.style.setProperty("--bazaar-saturation", (1 + frame3.active * 0.18).toFixed(4));
    root.style.setProperty("--shade-opacity", "1");
    root.style.setProperty("--shade-z", frame2.active > 0.02 ? "2" : "0");
    root.style.setProperty("--shade-top-alpha", (blurActive * 0.465).toFixed(4));
    root.style.setProperty("--shade-mid-alpha", (blurActive * 0.42).toFixed(4));
    root.style.setProperty("--shade-bottom-alpha", (blurActive * 0.51).toFixed(4));

    root.style.setProperty("--title-y", `${(introExit * -210).toFixed(4)}px`);
    root.style.setProperty("--title-scale", (1 - introExit * 0.08).toFixed(4));
    root.style.setProperty("--title-opacity", (1 - introExit).toFixed(4));

    root.style.setProperty("--bridge-x", `calc(-50% + ${(mouseX * 18).toFixed(4)}px)`);
    root.style.setProperty("--bridge-y", `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(4)}px`);
    root.style.setProperty("--bridge-bottom", `${(5 - frame2.enter * 13).toFixed(4)}vh`);
    root.style.setProperty("--bridge-width", `${(67.2 + frame2.enter * 37.8).toFixed(4)}vw`);
    root.style.setProperty("--bridge-scale", (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4));

    root.style.setProperty("--split-left-x", `calc(-50% + ${(-splitDrift * 46).toFixed(4)}vw + ${(mouseX * 22).toFixed(4)}px)`);
    root.style.setProperty("--split-left-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(4)}px`);
    root.style.setProperty("--split-left-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));
    root.style.setProperty("--split-right-x", `calc(-50% + ${(splitDrift * 46).toFixed(4)}vw + ${(mouseX * 22).toFixed(4)}px)`);
    root.style.setProperty("--split-right-y", `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(4)}px`);
    root.style.setProperty("--split-right-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));

    root.style.setProperty("--frame2-opacity", frame2Opacity.toFixed(4));
    root.style.setProperty("--frame2-x", `calc(-50% + ${(mouseX * 10).toFixed(4)}px)`);
    root.style.setProperty("--frame2-y", `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(4)}px)`);
    root.style.setProperty("--frame2-scale", (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4));

    root.style.setProperty("--intro-copy-y", `${(introExit * 90).toFixed(4)}px`);
    root.style.setProperty("--intro-copy-opacity", (1 - introExit).toFixed(4));
    root.style.setProperty("--panel2-opacity", panel2Opacity.toFixed(4));
    root.style.setProperty("--panel2-y", `calc(-50% + ${(-frame2.exit * 86 + (1 - frame2.enter) * 58).toFixed(4)}px)`);
    root.style.setProperty("--panel3-opacity", panel3Opacity.toFixed(4));
    root.style.setProperty("--panel3-y", `calc(-50% + ${(-frame3.exit * 86 + (1 - frame3.enter) * 58).toFixed(4)}px)`);

    root.style.setProperty("--sights-opacity", sightsEnter.toFixed(4));
    root.style.setProperty("--sights-controls-opacity", sightsControlsEnter.toFixed(4));
    if (sightsControls) {
      sightsControls.classList.toggle("is-ready", sightsControlsEnter > 0.98);
    }
    root.style.setProperty("--sights-visibility", sightsEnter > 0.01 ? "visible" : "hidden");
    root.style.setProperty("--sights-y", "0px");
    root.style.setProperty("--sights-enter-x", `${((1 - sightsEnter) * 420).toFixed(4)}vw`);
    root.style.setProperty("--sights-scale", (1 / backScale).toFixed(4));
    root.style.setProperty("--sights-top", `${sightsParentTop.toFixed(4)}px`);
    root.style.setProperty("--sights-screen-top", `${sightsScreenTop.toFixed(4)}px`);

    const chapter = smoothScroll < 650 ? 0 : smoothScroll < 1650 ? 1 : smoothScroll < 2750 ? 2 : 3;
    document.querySelector('.chapter-count').textContent = '0' + (chapter + 1) + ' / 05';
    document.querySelectorAll('.chapter-links a, .site-nav a').forEach((a, i) => { if (i % 5 === chapter) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
    root.style.setProperty('--journey-progress', String(clamp(smoothScroll / 3700)));
    document.querySelector('.journey-hint').textContent = chapter === 3 ? 'SCROLL FOR THE PHOTO JOURNEY ↓' : 'SCROLL TO EXPLORE ↓';
    document.querySelector('.story-panel-bazaar').inert = panel3Opacity < 0.7;
    document.querySelector('.story-panel-bridge').inert = panel2Opacity < 0.7;
    sightsControls.inert = sightsControlsEnter < 0.98;
    document.querySelector('.sights-slider').inert = sightsControlsEnter < 0.98;
    if (!reduceMotion.matches && (
      Math.abs(smoothScroll - targetScroll) > 0.08 ||
      Math.abs(mouseX - targetMouseX) > 0.001 ||
      Math.abs(mouseY - targetMouseY) > 0.001
    )) {
      requestTick();
    }
  }

  // Infinite slider logic
  function setupSightSlider() {
    if (!track) return;
    const cards = Array.from(track.querySelectorAll(".sight-card"));
    originalSightCount = cards.length || 5;
    track.replaceChildren();

    for (let setIndex = 0; setIndex < 1; setIndex++) {
      cards.forEach((card, cardIndex) => {
        const clone = card.cloneNode(true);
        clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex);
        track.appendChild(clone);
      });
    }

    sightCards = Array.from(track.children);
    activeSight = 0;

    sightCards.forEach((card) => {
      card.addEventListener("click", () => selectSightCard(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectSightCard(card);
        }
      });
    });

    
    updateSightSlider();
  }

  function updateSightSlider() {
    if (!sightCards.length || !track) return;
    const cardWidth = sightCards[0].offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0");
    root.style.setProperty("--sights-shift", `${-(cardWidth + gap) * activeSight}px`);
    sightCards.forEach((card, index) => {
      card.classList.toggle("is-active", index === activeSight);
      card.tabIndex = index === activeSight ? 0 : -1;
    });
  }

  function moveSightSlider(dir) {
    activeSight = (activeSight + dir + originalSightCount) % originalSightCount;
    updateSightSlider();
  }

  function selectSightCard(card) {
    const idx = Number(card.dataset.sightIndex);
    if (Number.isFinite(idx)) {
      activeSight = idx;
      updateSightSlider();
      const dialog = document.querySelector('.sight-dialog');
      const title = card.querySelector('h3').textContent;
      dialog.querySelector('h2').textContent = title;
      dialog.querySelector('.dialog-kicker').textContent = card.querySelector('.sight-kicker').textContent;
      dialog.querySelector('.dialog-copy').textContent = card.querySelector('p').textContent;
      dialog.querySelector('a').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(title + ', Mostar, Bosnia and Herzegovina');
      window.MostarGallery?.open(idx);
    }
  }

  // Listeners
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => {
    updateSightSlider();
    requestTick();
  });

  window.addEventListener("pointermove", (e) => {
    if (!reduceMotion.matches && e.pointerType === "mouse") {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
    } else {
      targetMouseX = 0;
      targetMouseY = 0;
    }
    requestTick();
  }, { passive: true });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => moveSightSlider(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => moveSightSlider(1));
  }

  // Navigation anchor links smoothly jump to corresponding story stages
  const navLinks = document.querySelectorAll(".site-nav a, .site-logo, .chapter-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      let target = 0;
      if (href === "#bridge") target = 1100;
      else if (href === "#bazaar") target = 2140;
      else if (href === "#routes") target = 3700;
      else if (href === "#cinema") target = 0;
      else if (href === "#gallery") target = document.querySelector("#gallery").offsetTop;

      window.scrollTo({
        top: target,
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });
    });
  });

  // Old town note interactive feedback
  const noteBtn = document.querySelector(".note-button");
  if (noteBtn) {
    noteBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 3700,
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });
    });
  }

  // Accessible details and touch navigation.
  const dialog = document.querySelector('.sight-dialog');
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if(e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - touchX; if(Math.abs(d) > 45) moveSightSlider(d < 0 ? 1 : -1); }, {passive:true});
  track.addEventListener('keydown', e => { if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); moveSightSlider(e.key === 'ArrowRight' ? 1 : -1); sightCards[activeSight].focus({preventScroll:true}); } });
  setupSightSlider();
  syncMotion();
  requestTick();
});
