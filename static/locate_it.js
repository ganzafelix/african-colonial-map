let correctCount = 0;
let incorrectCount = 0;
let results = [];

$(document).ready(function () {
  // Clear previous quiz data
localStorage.removeItem("locateItScore");
localStorage.removeItem("colonizerScore");

  $.getJSON("/data/regions", function (regions) {
    // Render region drop zones
    for (const region in regions) {
      $("#regions").append(`
        <div class="region-drop-zone mb-4" data-region="${region}">
          <h4>${region}</h4>
          <div class="drop-box bg-light border p-3 droppable" data-region="${region}" style="min-height: 120px;"></div>
        </div>
      `);
    }

    // Flatten, shuffle, select 10
    let countries = Object.entries(regions).flatMap(([region, list]) =>
      list.map(country => ({ name: country, region }))
    );
    countries = countries.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Render draggable countries
    countries.forEach(({ name, region }) => {
      $("#country-pool").append(`
        <div class="draggable badge bg-success text-white p-2 m-1"
             data-country="${name}"
             data-region="${region}"
             id="${name}">
          ${name}
        </div>
      `);
    });

    // Make countries draggable
    $(".draggable").draggable({
      revert: "invalid",
      helper: "clone",
      start: function () {
        $(this).css("opacity", "0.6");
      },
      stop: function () {
        $(this).css("opacity", "1");
      }
    });

    // Setup droppables
    $(".droppable").droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        const $dropBox = $(this);
        const $dragged = ui.draggable;
        const countryName = $dragged.data("country");
        const correctRegion = $dragged.data("region");
        const selectedRegion = $dropBox.data("region");

        const isCorrect = correctRegion === selectedRegion;

        const icon = isCorrect ? "✅" : "❌";
        const $feedbackIcon = $(`<span class="ms-2 fs-3 feedback-icon">${icon}</span>`);
        $dropBox.append($feedbackIcon);

        //add highlighr based on result 
        const highlightClass = isCorrect? "highlight-correct" : "highlight-incorrect";
        $dropBox
          .removeClass("highlight-correct highlight-incorrect")
          .addClass(highlightClass);

      // Fade out and remove after 1 second
      setTimeout(() => {
        $feedbackIcon.fadeOut(400, () => $feedbackIcon.remove());
        $dropBox.removeClass(highlightClass);
      }, 1000);

        console.log(isCorrect);

        // Set drop box color based on result — stays colored
        if (isCorrect) {
          correctCount++;
          console.log("this was correct");
          results.push({
            country: countryName,
            correct: true,
            region: correctRegion,
            guess: selectedRegion
          });
        } else {
          
          incorrectCount++;
          console.log("this was incorrect");
          results.push({
            country: countryName,
            correct: false,
            region: correctRegion,
            guess: selectedRegion
          });
        }

        // Remove the dragged country
        $dragged.remove();

        // If all done, go to score
        if (correctCount + incorrectCount === 10) {
          localStorage.setItem("locateItScore", JSON.stringify({
            correct: correctCount,
            incorrect: incorrectCount,
            answers: results
          }));
          window.location.href = "/score";
        }
      }
    });
  });
});
