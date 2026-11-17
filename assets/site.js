// Two small things, both optional: the thread down a page fills in as you read, and the contents list
// highlights the section you are in. The page reads fine without this file.
(() => {
  const stops = [...document.querySelectorAll(".stop")];
  const links = [...document.querySelectorAll(".page-toc a")];
  if (!stops.length) return;

  const update = () => {
    const line = window.innerHeight * 0.45;
    let current = null;
    for (const stop of stops) {
      const top = stop.getBoundingClientRect().top;
      stop.classList.toggle("reached", top < line);
      if (top < line) current = stop;
    }
    const id = current?.querySelector("h2")?.id;
    for (const a of links) {
      if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    }
  };

  let queued = false;
  addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }, { passive: true });
  addEventListener("resize", update);
  update();
})();
