$(function () {
  const correctAnswers = {
    Liberia: "Uncolonized",
    Rwanda: "France",
    Egypt: "Britain",
    Ethiopia: "Uncolonized",
    Mali: "France",
    Lesotho: "Britain",
    Ghana: "Britain",
    Libya: "Italy",
    Chad: "France",
    Eritrea: "Italy"
  };

  let score = 0;
  let dropped = [];

  // Make all country divs draggable
  $(".draggable").draggable();

  // Define drop logic

  $(".droppable").droppable({

    accept: ".draggable",
    drop: function (event, ui) {
      const countryId = ui.draggable.attr("id");
      const colonizer = $(this).data("colonizer");

      if (!dropped.includes(countryId)) {
        const correct = correctAnswers[countryId] === colonizer;
        
        if (correct) {
          $(this).css("background-color", "#b3e6b3");
          score++;
        } else {
          $(this).css("background-color", "#f4cccc"); // light red for wrong
        }

        dropped.push(countryId);
        ui.draggable.draggable("disable").fadeTo(500, 0.5);

        if (dropped.length === Object.keys(correctAnswers).length) {
          $("#result").text(`🎉 You scored ${score}/${dropped.length}`);
        }
      }
    }
  });
});
