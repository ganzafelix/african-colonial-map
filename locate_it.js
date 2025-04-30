let results = [];

$(document).ready(function () {
  // Clear previous quiz data
  localStorage.removeItem("locateItScore");
  localStorage.removeItem("colonizerScore");

  $.getJSON("/data/regions", function (regions) {
    // Render region drop zones
    for (const region in regions) {
      $("#regions").append(`
        <div class="region-drop-zone mb-4 droppable border p-4 text-center" data-region="${region}" style="min-height: 120px;">
          <strong>${region}</strong>
        </div>
      `);
    }

    // Flatten, shuffle, select 10 countries
    let countries = Object.entries(regions).flatMap(([region, list]) =>
      list.map(country => ({ name: country, region }))
    );
    countries = countries.sort(() => 0.5 - Math.random()).slice(0, 10);

    // Render draggable countries
    countries.forEach(({ name, region }) => {
      $("#country-pool").append(`
        <div class="draggable badge bg-success text-white p-2 m-1"
             data-country="${name}"
             data-region="${region}">
          ${name}
        </div>
      `);
    });

    // Make countries draggable
    $(".draggable").draggable({
      revert: "invalid",
      helper: "clone"
    });

    // Setup droppables
    $(".droppable").droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        const $dropBox = $(this);
        const $dragged = ui.draggable;
        const country = $dragged.data("country");
        const correctRegion = $dragged.data("region");
        const guessedRegion = $dropBox.data("region");

        const isCorrect = correctRegion === guessedRegion;

        // ✅/❌ Feedback
        const icon = isCorrect ? "✅" : "❌";
        const $icon = $(`<span class="ms-2 fs-3">${icon}</span>`);
        $dropBox.append($icon);
        setTimeout(() => $icon.fadeOut(400, () => $icon.remove()), 1000);

        // Record result
        results.push({
          country,
          correct: isCorrect,
          region: correctRegion,
          guess: guessedRegion
        });

        // Remove dragged item
        $dragged.remove();

        // Check if quiz is done
        if (results.length === 10) {
          localStorage.setItem("locateItScore", JSON.stringify({
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