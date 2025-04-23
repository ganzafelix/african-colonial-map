let correctCount = 0;
let incorrectCount = 0;
let results = [];

$(document).ready(function () {
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

        // Set drop box color based on result — stays colored
        if (isCorrect) {
          $dropBox.css("background-color", "#b3e6b3"); // ✅ green
          correctCount++;
          results.push({ country: countryName, correct: true });
        } else {
          $dropBox.css("background-color", "#f4cccc"); // ❌ red
          incorrectCount++;
          results.push({ country: countryName, correct: false });
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
