/* ============================================================
   Wow layer — preloader, animated ETL pipeline hero background,
   smooth scroll (Lenis), scroll reveals, sticky-nav state.
   Kept separate from app.js (the graph) for clarity.
   ============================================================ */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- PRELOADER ---- */
  const preloader = document.getElementById("preloader");
  function finishLoad() {
    document.body.classList.add("loaded");
    if (preloader) {
      preloader.classList.add("phase-2");
      setTimeout(() => preloader.classList.add("phase-3"), 400);
      setTimeout(() => preloader.classList.add("done"), 1400);
    }
  }
  if (reduced) {
    if (preloader) preloader.style.display = "none";
    document.body.classList.add("loaded");
  } else {
    setTimeout(finishLoad, 900);
  }

  /* ---- LENIS SMOOTH SCROLL ---- */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // Anchor links route through Lenis for smooth in-page jumps.
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -70 }); }
      });
    });
  }

  /* ---- SCROLL REVEALS ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---- STICKY NAV STATE ---- */
  const nav = document.getElementById("nav");
  function onScroll() {
    const y = lenis ? lenis.scroll : window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
  }
  if (lenis) lenis.on("scroll", onScroll);
  else window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- ANIMATED ETL PIPELINE (hero background) ---- */
  const canvas = document.getElementById("pipeline-canvas");
  if (!canvas || reduced) return;
  const ctx = canvas.getContext("2d");

  const NODES = [
    { label: "SEC EDGAR",  x: 0.08, y: 0.62 },
    { label: "Scraper",    x: 0.24, y: 0.48 },
    { label: "PostgreSQL", x: 0.42, y: 0.58 },
    { label: "NLP / LLM",  x: 0.58, y: 0.44 },
    { label: "Neo4j",      x: 0.74, y: 0.56 },
    { label: "GNN",        x: 0.90, y: 0.42 },
  ];
  const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]];
  let W = 0, H = 0, dpr = 1, packets = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const pos = (n) => ({ x: n.x * W, y: n.y * H });
  const spawn = () => packets.push({ edge: 0, t: 0, speed: 0.004 + Math.random() * 0.003 });

  function drawEdge(a, b) {
    const pa = pos(NODES[a]), pb = pos(NODES[b]);
    const cx = (pa.x + pb.x) / 2, cy = (pa.y + pb.y) / 2 - 18;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.quadraticCurveTo(cx, cy, pb.x, pb.y);
    ctx.strokeStyle = "rgba(201,162,39,0.22)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  function drawNode(n) {
    const p = pos(n);
    ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(201,162,39,0.06)"; ctx.fill();
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(201,162,39,0.55)"; ctx.fill();
    ctx.font = "500 10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(138,129,112,0.7)";
    ctx.textAlign = "center";
    ctx.fillText(n.label, p.x, p.y + 22);
  }
  function packetPos(pkt) {
    const [a, b] = EDGES[pkt.edge];
    const pa = pos(NODES[a]), pb = pos(NODES[b]);
    const cx = (pa.x + pb.x) / 2, cy = (pa.y + pb.y) / 2 - 18;
    const t = pkt.t, u = 1 - t;
    return { x: u * u * pa.x + 2 * u * t * cx + t * t * pb.x, y: u * u * pa.y + 2 * u * t * cy + t * t * pb.y };
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    EDGES.forEach(([a, b]) => drawEdge(a, b));
    NODES.forEach(drawNode);
    if (Math.random() < 0.04) spawn();
    packets = packets.filter((p) => {
      p.t += p.speed;
      if (p.t >= 1) {
        if (p.edge < EDGES.length - 1) { p.edge++; p.t = 0; return true; }
        return false;
      }
      const q = packetPos(p);
      ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#5eead4"; ctx.shadowColor = "#5eead4"; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;
      return true;
    });
    requestAnimationFrame(tick);
  }
  resize();
  window.addEventListener("resize", resize);
  for (let i = 0; i < 4; i++) spawn();
  requestAnimationFrame(tick);
})();
