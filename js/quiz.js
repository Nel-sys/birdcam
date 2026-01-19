document.addEventListener("DOMContentLoaded", () => {
  fetch("quiz/quiz-data.json")
    .then(response => response.json())
    .then(data => renderQuiz(data))
    .catch(() => {
      document.getElementById("birdQuiz").innerText =
        "Quiz data could not be loaded.";
    });
});

function renderQuiz(data) {
  const quiz = document.getElementById("birdQuiz");

  const image = "images/birds/0.jpg"; // static for now
  const day = data.days[0];

  let html = `<img src="${image}" alt="Bird of the day">`;

  day.questions.forEach((q, i) => {
    const options = shuffle([q.correct, ...q.wrong]);

    html += `<div class="quiz-question">${i + 1}. ${q.q}</div>`;
    options.forEach(opt => {
      html += `<div class="quiz-option">${opt}</div>`;
    });
  });

  quiz.innerHTML = html;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}