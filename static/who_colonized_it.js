let results = [];

$(document).ready(function () {

  // Clear previous quiz data
localStorage.removeItem("locateItScore");
localStorage.removeItem("colonizerScore");

  $.getJSON("/data/colonizers", function (data) {
    // Step 1: Build reverse mapping — country => [colonizers]
    const countryMap = {};
    for (const colonizer in data) {
      data[colonizer].forEach(country => {
        if (!countryMap[country]) {
          countryMap[country] = [];
        }
        countryMap[country].push(colonizer);
      });
    }

    // Step 2: Pick 10 unique random countries
    const allCountries = Object.keys(countryMap);
    const selectedCountries = allCountries.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Step 3: Determine all colonizers involved in this round
    const activeColonizers = [...new Set(
      selectedCountries.flatMap(country => countryMap[country])
    )];

    // Step 4: Render droppable colonizer buckets
    activeColonizers.forEach(colonizer => {
      $("#colonizer-buckets").append(`
        <div class="droppable border p-4 text-center" data-colonizer="${colonizer}" style="min-width: 180px;">
          <strong>${colonizer}</strong>
        </div>
      `);
    });

    // Step 5: Render draggable countries (do not assign colonizer, we use countryMap later)
    selectedCountries.forEach(country => {
      $("#country-pool").append(`
        <div class="draggable badge bg-success text-white p-2 m-1"
             data-country="${country}">
          ${country}
        </div>
      `);
    });

    // Step 6: Make draggable
    $(".draggable").draggable({
      revert: "invalid",
      helper: "clone"
    });

    // Step 7: Make colonizer buckets droppable
    $(".droppable").droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        const $dropZone = $(this);
        const $dragged = ui.draggable;
        const country = $dragged.data("country");
        const guessedColonizer = $dropZone.data("colonizer");

        const validColonizers = countryMap[country];
        const isCorrect = validColonizers.includes(guessedColonizer);

        // ✅/❌ Feedback
        const icon = isCorrect ? "✅" : "❌";
        const $icon = $(`<span class="ms-2 fs-3">${icon}</span>`);
        $dropZone.append($icon);

        //highlight 
        const highlightClass = isCorrect? "highlight-correct" : "highlight-incorrect";
        $dropZone
          .removeClass("highlight-correct highlight-incorrect")
          .addClass(highlightClass)
        setTimeout(() => {
          $icon.fadeOut(400, () => $icon.remove());
          $dropZone.removeClass(highlightClass);
        },1000);

        // Record result
        results.push({
          country,
          correct: isCorrect,
          colonizer: validColonizers.join(", "),
          guess: guessedColonizer
        });

        // Remove the dragged item
        $dragged.remove();

        // Check for completion
        if (results.length === 10) {
          localStorage.setItem("colonizerScore", JSON.stringify({
            correct: results.filter(r => r.correct).length,
            incorrect: results.filter(r => !r.correct).length,
            answers: results
          }));
          window.location.href = "/score";
        }
      }
    });
  });
});
