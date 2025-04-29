document.addEventListener("DOMContentLoaded", function () {
    const locateData = JSON.parse(localStorage.getItem("locateItScore"));
    const colonizerData = JSON.parse(localStorage.getItem("colonizerScore"));
  
    let data = locateData || colonizerData;
    let quizType = locateData ? "locate" : colonizerData ? "colonizer" : null;
  
    const summary = document.getElementById("score-summary");
    const message = document.getElementById("score-message");
    const answersDiv = document.getElementById("answers");
  
    if (!data || !quizType) {
      summary.textContent = "No quiz data found.";
      return;
    }
  
    const { correct, incorrect, answers } = data;
    summary.textContent = `You scored ${correct}/10`;
  
    // Encouragement
    if (correct >= 8) {
      message.textContent = "🎉 Great job! You're mastering this!";
      message.style.color = "#28a745";
    } else {
      message.textContent = "💪 Keep learning! You can try the quiz again.";
      message.style.color = "#dc3545";
    }
  
    // Render each answer
    answers.forEach(entry => {
      console.log(entry);
      const userGuess = entry.guess || "Unknown";
      const correctAnswer = entry.region || entry.colonizer || "Not specified";

      const detail = entry.correct
      ? `<strong>${entry.country}</strong>: ✅ Correct`
      : `<strong>${entry.country}</strong>: ❌ Wrong – you said <strong>${userGuess}</strong>, but the correct answer is <strong>${correctAnswer}</strong>`;

      const row = document.createElement("div");
      row.className = "mb-2";
      row.innerHTML = `${status} ${detail}`;
      answersDiv.appendChild(row);
    });
  
    // Button logic
    document.getElementById("try-again").onclick = () => {
      if (quizType === "locate") {
        localStorage.removeItem("locateItScore");
        window.location.href = "/locate-it";
      } else {
        localStorage.removeItem("colonizerScore");
        window.location.href = "/who-colonized-it";
      }
    };
  
    document.getElementById("switch-quiz").onclick = () => {
      window.location.href = "/quiz";
    };
  });
  