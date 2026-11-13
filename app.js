// app.js — alleen de werking van de quiz. Aanpassen doe je in config.js.

const $ = (id) => document.getElementById(id);
const T = TEXTS;
const views = { player: $("playerView"), quiz: $("quizView"), result: $("resultView") };

// ---------- Teksten, plaatjes, bladeren ----------
document.title = T.pageTitle;
document.querySelectorAll("[data-text]").forEach(el => { if (T[el.dataset.text]) el.textContent = T[el.dataset.text]; });
$("introPhoto").src = IMAGES.intro;
$("resultPhoto").src = IMAGES.result;

["🍂", "🍁", "🍃"].forEach((icon, k) => {
  for (let i = 0; i < 5; i++) {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leaf.textContent = icon;
    leaf.style.cssText = `left:${Math.random() * 100}%;font-size:${18 + Math.random() * 16}px;` +
      `animation-duration:${14 + Math.random() * 12}s;animation-delay:-${Math.random() * 20}s`;
    $("leaves").appendChild(leaf);
  }
});

// ---------- Hulpfuncties ----------
function show(name) {
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[name].classList.add("active");
}
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
const stillPhoto = (p = "") => p.replace(/\.(gif|webp|png|jpeg|jpg)$/i, ".jpg");

// Regels met "- " worden een opsomming, lege regels scheiden alinea's
function fmt(text = "") {
  let out = "", list = false;
  for (const raw of text.split("\n")) {
    const l = raw.trim();
    if (l.startsWith("- ")) {
      if (!list) { out += "<ul>"; list = true; }
      out += `<li>${l.slice(2)}</li>`;
    } else {
      if (list) { out += "</ul>"; list = false; }
      if (l) out += `<p>${l}</p>`;
    }
  }
  return out + (list ? "</ul>" : "");
}

// ---------- State ----------
let player = null, idx = 0, state = [], started = false;
let lockTimer = null, fadeTimer = null;
const rules = () => ({ ...DEFAULT_RULES, ...(player?.rules || {}) });

window.addEventListener("beforeunload", (e) => {
  if (started) { e.preventDefault(); e.returnValue = ""; }
});

// ---------- Speler kiezen ----------
PLAYERS.forEach(p => {
  const el = document.createElement("div");
  el.className = "player";
  el.tabIndex = 0;
  el.innerHTML = `<img src="${p.photo}" alt=""><span>${p.name}</span>`;
  const pick = () => {
    player = p;
    [...$("players").children].forEach(c => c.classList.remove("selected"));
    el.classList.add("selected");
    $("startBtn").disabled = false;
  };
  el.onclick = pick;
  el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } };
  $("players").appendChild(el);
});

$("startBtn").onclick = () => {
  started = true;
  idx = 0;
  state = QUESTIONS.map(() => ({ answered: false, pickedIndex: null, correct: false, readyAt: 0 }));
  $("youImg").src = stillPhoto(player.photo);
  $("youName").textContent = player.name;
  show("quiz");
  renderQuestion();
  scrollToTop();
};

// ---------- Afbeelding laten verschijnen ----------
function startFade(img) {
  clearTimeout(fadeTimer);
  const r = rules();
  img.style.transition = "none";
  img.style.opacity = r.fadeImage ? "0" : "1";
  if (!r.fadeImage) return;
  void img.offsetWidth;
  const begin = () => {
    fadeTimer = setTimeout(() => {
      img.style.transition = `opacity ${r.fadeSeconds}s linear`;
      img.style.opacity = "1";
    }, r.fadeDelaySeconds * 1000);
  };
  if (img.complete) begin(); else img.onload = begin;
}

// ---------- Volgende-knop (wachttijd) ----------
function updateNext() {
  clearInterval(lockTimer);
  const r = rules(), s = state[idx];
  const label = idx === QUESTIONS.length - 1 ? T.resultBtn : T.nextBtn;
  const paint = (locked, secs) => {
    $("nextBtn").disabled = locked;
    $("nextBtn").classList.toggle("ghosted", locked);
    $("nextBtn").style.display = locked && r.hideNextWhileLocked ? "none" : "";
    $("nextBtn").textContent = locked && secs ? `${label} (${secs})` : label;
  };
  if (r.mustAnswer && !s.answered) return paint(true);
  const tick = () => {
    const left = Math.ceil((s.readyAt - Date.now()) / 1000);
    if (left <= 0) { clearInterval(lockTimer); paint(false); } else paint(true, left);
  };
  tick();
  lockTimer = setInterval(tick, 250);
}

// ---------- Vraag tonen ----------
function renderQuestion() {
  const q = QUESTIONS[idx], s = state[idx];
  const r = rules(); // Haalt de regels op van de gekozen speler

  $("stats").textContent = `Vraag ${idx + 1} / ${QUESTIONS.length}`;
  $("qNr").textContent = `Vraag ${idx + 1}`;
  $("qText").textContent = q.vraag;

  // 🔊 DIT IS DE BELANGRIJKE CONTROLE:
  // Alleen automatisch voorlezen als de huidige speler (zoals Kaj of Luuk) 'speak: true' heeft!
  if (r.speak) {
    speakText(q.vraag);
  }

  const img = $("qImg");
  img.onload = null;
  img.style.display = q.image ? "" : "none";
  img.alt = q.vraag;
  img.src = q.image || "";
  startFade(img);

  $("answers").innerHTML = "";
  q.antwoorden.forEach((txt, i) => {
    const b = document.createElement("button");
    b.className = "answerBtn";
    b.textContent = txt;
    b.onclick = () => pickAnswer(i);
    $("answers").appendChild(b);
  });

  $("feedback").classList.add("hidden");
  $("backBtn").disabled = idx === 0;
  if (s.answered) { paintAnswers(); showFeedback(); }
  updateNext();
}

function pickAnswer(i) {
  const r = rules(), s = state[idx];
  if (s.answered && !r.canChangeAnswer) return;
  Object.assign(s, { answered: true, pickedIndex: i, correct: i === QUESTIONS[idx].correctIndex });
  if (r.lockSeconds > 0 && !s.readyAt) s.readyAt = Date.now() + r.lockSeconds * 1000;
  paintAnswers();
  showFeedback();
  updateNext();
}

function paintAnswers() {
  const q = QUESTIONS[idx], s = state[idx];
  [...$("answers").children].forEach((b, i) => {
    b.classList.toggle("correct", s.answered && i === q.correctIndex);
    b.classList.toggle("wrong", s.answered && i === s.pickedIndex && i !== q.correctIndex);
    b.disabled = s.answered && !rules().canChangeAnswer;
  });
}

function showFeedback() {
  const q = QUESTIONS[idx], s = state[idx];
  $("feedback").classList.remove("hidden");
  $("feedbackHead").textContent = s.correct ? T.correct : T.wrong;
  $("feedbackHead").className = "feedbackHead " + (s.correct ? "good" : "bad");
  $("feedbackBody").innerHTML =
    `<p><b>${T.correctAnswerLabel}</b> ${q.antwoorden[q.correctIndex]}</p>` +
    (q.uitleg ? `<p><b>${T.explanationLabel}</b></p>${fmt(q.uitleg)}` : "");
}

// ---------- Navigatie ----------
$("backBtn").onclick = () => { if (idx > 0) { idx--; renderQuestion(); scrollToTop(); } };
$("nextBtn").onclick = () => {
  if (idx < QUESTIONS.length - 1) { idx++; renderQuestion(); } else showResult();
  scrollToTop();
};

// ---------- Resultaat ----------
function showResult() {
  clearInterval(lockTimer);
  clearTimeout(fadeTimer);
  started = false;
  show("result");

  const good = state.filter(s => s.correct).length;
  const bad = state.filter(s => s.answered && !s.correct).length;
  $("resultSummary").textContent = fill(T.resultLine, { name: player.name, good, bad });
  $("dipGood").textContent = good;
  $("dipBad").textContent = bad;
  $("dipTotal").textContent = QUESTIONS.length;

  const d = new Date(), p2 = (n) => String(n).padStart(2, "0");
  $("diplomaMeta").textContent =
    `${player.name} • ${p2(d.getDate())}-${p2(d.getMonth() + 1)}-${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  buildReview(false);
}

function buildReview(onlyWrong) {
  const list = $("reviewList");
  list.innerHTML = "";
  QUESTIONS.forEach((q, i) => {
    const s = state[i];
    if (onlyWrong && !(s.answered && !s.correct)) return;
    const badge = !s.answered ? `<span class="badge">${T.unanswered}</span>`
      : s.correct ? `<span class="badge good">${T.correct}</span>` : `<span class="badge bad">${T.wrong}</span>`;
    const row = document.createElement("div");
    row.className = "reviewRow";
    row.innerHTML = `
      <div class="reviewThumb">${q.image ? `<img src="${q.image}" alt="Vraag ${i + 1}">` : ""}</div>
      <div class="reviewInfo">
        <h4>${i + 1}. ${q.vraag}</h4>
        <div class="reviewMeta">${badge}<span><b>${T.correctAnswerLabel}</b> ${q.antwoorden[q.correctIndex]}</span></div>
        ${q.uitleg ? `<div class="smallNote" style="margin-top:8px">${fmt(q.uitleg)}</div>` : ""}
      </div>`;
    const thumb = row.querySelector("img");
    if (thumb) thumb.onclick = () => openLightbox(thumb.src, thumb.alt);
    list.appendChild(row);
  });
}

$("showAllBtn").onclick = () => buildReview(false);
$("showWrongBtn").onclick = () => buildReview(true);
$("toTopBtn").onclick = scrollToTop;
$("restartBtn").onclick = () => {
  player = null;
  $("startBtn").disabled = true;
  [...$("players").children].forEach(c => c.classList.remove("selected"));
  show("player");
  scrollToTop();
};

// ---------- Lightbox ----------
function openLightbox(src, alt) {
  $("lightboxImg").src = src;
  $("lightboxImg").alt = alt || "";
  $("lightbox").classList.remove("hidden");
}
function closeLightbox() {
  $("lightbox").classList.add("hidden");
  $("lightboxImg").src = "";
}
$("lightbox").onclick = closeLightbox;
$("lightboxClose").onclick = (e) => { e.stopPropagation(); closeLightbox(); };
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
$("youImg").onclick = (e) => openLightbox(e.target.src, player?.name);
$("resultPhoto").onclick = (e) => openLightbox(e.target.src, "");
// ---------- Text-to-Speech (Langzamer Nederlands) ----------
function speakText(text) {
  if (!('speechSynthesis' in window)) return;

  // Stop eventuele lopende spraak
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'nl-NL';
  utterance.rate = 0.9; // 0.8 is langzamer dan normaal (1.0) voor betere verstaanbaarheid

  // Probeer een Nederlandse stem te vinden
  const voices = window.speechSynthesis.getVoices();
  const dutchVoice = voices.find(v => v.lang.startsWith('nl'));
  if (dutchVoice) {
    utterance.voice = dutchVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Zorg dat stemmen correct worden geladen in browsers zoals Chrome/Safari
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// Koppel de knop om de huidige vraag opnieuw voor te lezen
$("speakBtn").onclick = () => {
  const q = QUESTIONS[idx];
  if (q) speakText(q.vraag);
};