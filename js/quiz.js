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
  const questions = data.days[0].questions;
  const image = "images/birds/0.jpg";

  let index = 0;
  let timer = null;
  let locked = false;

  function showQuestion() {
    if (index >= questions.length) {
      quiz.innerHTML = `
        <img src="${image}" alt="Bird">
        <strong>Quiz complete</strong>
        <p>Come back tomorrow for new questions.</p>
      `;
      return;
    }

    locked = false;
    const q = questions[index];
    const options = shuffle([q.correct, ...q.wrong]);

    quiz.innerHTML = `
      <img src="${image}" alt="Bird">
      <div class="quiz-question">${index + 1}. ${q.q}</div>
      ${options.map(o =>
        `<div class="quiz-option" data-answer="${o}">${o}</div>`
      ).join("")}
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
    const options = document.querySelectorAll(".quiz-option");

    options.forEach(opt => {
      if (opt.dataset.answer === q.correct) {
        opt.style.background = "#c8f7c5"; // green
      } else if (selected && opt.dataset.answer === selected.dataset.answer) {
        opt.style.background = "#f7c5c5"; // red
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
