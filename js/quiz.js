document.addEventListener("DOMContentLoaded", () => {
  fetch("quiz/quiz-data.json")
    .then(r => r.json())
    .then(data => startQuiz(data))
    .catch(() => {
      document.getElementById("birdQuiz").innerText =
        "Quiz data could not be loaded.";
    });
});

function startQuiz(data) {
  const quiz = document.getElementById("birdQuiz");

  const startDate = new Date(data.startDate);
  const today = new Date();

  // Calculate number of days since start date
  let dayIndex = Math.floor((today - startDate) / 86400000);
  if (dayIndex < 0) dayIndex = 0;

  // --- DAILY QUESTION SET ---
  const dayData =
    data.days[dayIndex % data.days.length];
  const questions = dayData.questions;

  // --- DAILY IMAGE (loops after 9) ---
  const imageCount = 9;
  const imageIndex = (dayIndex % imageCount) + 1;
  const imagePath = `images/birds/${imageIndex}.jpg`;

  let index = 0;
  let timer = null;
  let locked = false;

  function showQuestion() {
    if (index >= questions.length) {
      quiz.innerHTML = `
        <img src="${imagePath}" alt="Bird">
        <strong>Quiz complete</strong>
        <p>Come back tomorrow for a new bird.</p>
      `;
      return;
    }

    locked = false;
    const q = questions[index];
    const options = shuffle([q.correct, ...q.wrong]);

    quiz.innerHTML = `
      <img src="${imagePath}" alt="Bird">
      <div class="quiz-question">${index + 1}. ${q.q}</div>
      ${options
        .map(
          o =>
            `<div class="quiz-option" data-answer="${o}">${o}</div>`
        )
        .join("")}
      <div id="timer" style="font-size:0.85em;color:#666;margin-top:6px;">
        Time left: 8s
      </div>
    `;

    let timeLeft = 8;
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").innerText =
        `Time left: ${timeLeft}s`;

      if (timeLeft === 0) {
        clearInterval(timer);
        showCorrectAndAdvance(q);
      }
    }, 1000);

    document.querySelectorAll(".quiz-option").forEach(opt => {
      opt.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        clearInterval(timer);
        showCorrectAndAdvance(q, opt);
      });
    });
  }

  function showCorrectAndAdvance(q, selected = null) {
    document.querySelectorAll(".quiz-option").forEach(opt => {
      if (opt.dataset.answer === q.correct) {
        opt.style.background = "#c8f7c5";
      } else if (
        selected &&
        opt.dataset.answer === selected.dataset.answer
      ) {
        opt.style.background = "#f7c5c5";
      }
    });

    setTimeout(() => {
      index++;
      showQuestion();
    }, 1000);
  }

  showQuestion();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
