$(function () {
  
  if ($("#quiz").length) {
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

    $(".draggable").draggable();

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
            $(this).css("background-color", "#f4cccc");
          }

          dropped.push(countryId);
          ui.draggable.draggable("disable").fadeTo(500, 0.5);

          if (dropped.length === Object.keys(correctAnswers).length) {
            $("#result").text(`🎉 You scored ${score}/${dropped.length}`);
          }
        }
      }
    });
  }

 
  if ($("#quiz2").length) {
    const correctLocations = {
      Liberia: "West Africa",
      Rwanda: "East Africa",
      Egypt: "North Africa",
      Ethiopia: "East Africa",
      Mali: "West Africa",
      Lesotho: "South Africa",
      Ghana: "West Africa",
      Libya: "North Africa",
      Chad: "Central Africa",
      Eritrea: "East Africa"
    };

    let locScore = 0;
    let locDropped = [];

    $(".draggable").draggable();

    $(".droppable").droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        const countryId = ui.draggable.attr("id");
        const location = $(this).attr("location");

        if (!locDropped.includes(countryId)) {
          const correct = correctLocations[countryId] === location;

          if (correct) {
            $(this).css("background-color", "#b3e6b3");
            locScore++;
          } else {
            $(this).css("background-color", "#f4cccc");
          }

          locDropped.push(countryId);
          ui.draggable.draggable("disable").fadeTo(500, 0.5);

          if (locDropped.length === Object.keys(correctLocations).length) {
            $("#result").text(`📍 You scored ${locScore}/${locDropped.length}`);
          }
        }
      }
    });
  }
});
