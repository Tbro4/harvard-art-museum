var APIkey = "a019a706-259c-4a2f-9933-1f3c5d716d8a";
//values from each checked button
var techniqueChoices = [];
//string values together to place in URL endpoint
var techniques;
//holds id #s to dynamically generate pics
var ids = [];

var idCall;

//reference to the pics container for button event bubbling (cannot listen for dynamically created buttons without this)
var picsContainer = document.querySelector(".pics");

//listen for favBtn click
picsContainer.addEventListener("click", function (e) {
  //check if we are clicking a Favorite button, then do something
  if (e.target.classList.contains("favBtn")) {
    // console.log(e.target);
    //hide pics section
    $(".pics").addClass("hidden");

    //fetching endpoint using targets ID and appending to picInfo container
    objectID = e.target.getAttribute("data-id");
    // console.log(objectID);
    var objectURL =
      "https://api.harvardartmuseums.org/object/" +
      objectID +
      "?apikey=" +
      APIkey;

    fetch(objectURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        //dynamically create elements
        var img = $("<img>");
        var title = $("<h2>");
        var century = $("<h4>");
        var period = $("<h4>");
        var division = $("<h4>");
        var technique = $("<h4>");
        var medium = $("<h4>");

        img.attr({
          src: data.primaryimageurl,
          class: "img-responsive m-1",
          width: "100%",
          height: "auto",
        });
        //use if statements to keep null values from appearing
        if (data.title !== null) {
          title.text(data.title);
        }
        if (data.century !== null) {
          century.text("Century: " + data.century);
        }
        if (data.period !== null) {
          period.text("Period: " + data.period);
        }
        if (data.division !== null) {
          division.text("Division: " + data.division);
        }
        if (data.technique !== null) {
          technique.text("Technique: " + data.technique);
        }
        if (data.medium !== null) {
          medium.text("Medium: " + data.medium);
        }

        $(".picInfo").append(
          title,
          century,
          period,
          division,
          technique,
          medium,
          img
        );
      });
  }
});

//upon submit, any clicked buttons value is pushed to techniqueChoices array
document.querySelector("#submitBtn").addEventListener("click", function (e) {
  e.preventDefault();
  //hide frontPage
  $(".frontPage").addClass("hidden");
  //checks to see which buttons have been selected and pushes their value to an array
  var form = document.querySelector("#buttonGroup");
  Array.from(form.querySelectorAll("input")).forEach(function (inp) {
    if (inp.checked === true) {
      techniqueChoices.push(inp.value);
    }
  });
  //string array values with | seperator
  techniques = techniqueChoices.join("|");

  var museumURL =
    "https://api.harvardartmuseums.org/object?technique=" +
    techniques +
    "&sort=random&size=100&apikey=" +
    APIkey;

  fetch(museumURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //   console.log(data);
      //looks through each record, checks if it has an image (needed 3 || conditions because some of the records only contain one of them), and if it does, pushes object ID to array until 4 ids have been pushed
      for (i = 0, x = 0; i < 4; i++, x++) {
        if (
          data.records[x].primaryimageurl == null ||
          data.records[x].imagecount == 0 ||
          data.records[x].images === []
        ) {
          i--;
        } else {
          ids.push(data.records[x].id);
        }
      }
      //   console.log(ids);
      //loop through each id in array and create and append a card to the pic section
      for (i = 0; i < 4; i++) {
        //URL variable used to fetch the specific object data by its ID. Then we will use that data to grab primaryimageurl
        var idCall =
          "https://api.harvardartmuseums.org/object/" +
          ids[i] +
          "?apikey=" +
          APIkey;

        fetch(idCall)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            // console.log(data);
            var primaryImageURL = data.primaryimageurl;
            // console.log(primaryImageURL);
            //make card elements
            var cardDiv = $("<div>");
            var cardBdyDiv = $("<div>");
            var imageLink = $("<a>");
            var image = $("<img>");
            var button = $("<button>");
            //fill card elements with classes,data,etc
            cardDiv.addClass("card col-lg-6 col-sm-12");
            cardBdyDiv.addClass("card-body");
            imageLink.attr({ href: primaryImageURL, target: "_blank" });
            image.attr({
              src: primaryImageURL,
              class: "card-img-top",
              alt: "...",
            });
            imageLink.append(image);

            button
              .attr({ class: "btn btn-primary favBtn", "data-id": data.id })
              .text("Favorite");
            //append elements to pics section
            cardBdyDiv.append(button);
            cardDiv.append(imageLink, cardBdyDiv);
            $(".pics").append(cardDiv);

            //show pics section
            $(".pics").removeClass("hidden");
          });
      }
    });
});
