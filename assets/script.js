var APIkey = "af0d3bac-821d-462a-948e-2e39c2634b42";
//values from each checked button
var techniqueChoices = [];
//string values together to place in URL endpoint
var techniques;
//holds id #s to dynamically generate pics
var ids = [];
var favoritesArr = [];

var idCall;

//Homepage button
$("#homepage").on("click", function () {
  console.log("clicked");
  location.reload();
});

//loads favorites from storage
function loadFaves() {
  $(".frontPage").addClass("hidden");
  $(".pics").addClass("hidden");
  $(".picInfo").addClass("hidden");
  $(".myFaves").removeClass("hidden");

  var loadData = localStorage.getItem("Favorites(IDs)");

  if (loadData != null) {
    var favoritesArr = JSON.parse(loadData);
  } else {
    var favoritesArr = [];
  }

  for (i = 0; i < favoritesArr.length; i++) {
    var objectURL =
      "https://api.harvardartmuseums.org/object/" +
      favoritesArr[i] +
      "?apikey=" +
      APIkey;

    fetch(objectURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var primaryImageURL = data.primaryimageurl;
        //make card elements
        var title = $("<h3>");
        var cardDiv = $("<div>");
        var cardBdyDiv = $("<div>");
        var imageLink = $("<a>");
        var image = $("<img>");
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
        title.text(data.title);

        //append elements to pics section

        cardDiv.append(title, imageLink, cardBdyDiv);
        $(".myFaves").append(cardDiv);
      });
  }
}

//clear favorites
$("#clearFavorites").on("click", function () {
  localStorage.clear();
  console.log("cleared");
  //clears the div of pics and "clear button"
  $(".myFaves").html("");
});

//Favorites button
$("#savedFavorites").on("click", loadFaves);

//reference to the pics container for button event bubbling (cannot listen for dynamically created buttons without this)
var picsContainer = document.querySelector(".pics");

//listen for favBtn click
picsContainer.addEventListener("click", function (e) {
  //check if we are clicking a Favorite button, then do something
  if (e.target.classList.contains("favBtn")) {
    //hide pics section
    $(".pics").addClass("hidden");

    //fetching endpoint using targets ID and appending to picInfo container
    objectID = e.target.getAttribute("data-id");

    var loadData = localStorage.getItem("Favorites(IDs)");

    if (loadData != null) {
      var favoritesArr = JSON.parse(loadData);
    } else {
      var favoritesArr = [];
    }
    favoritesArr.push(objectID);
    localStorage.setItem("Favorites(IDs)", JSON.stringify(favoritesArr));

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
        //dynamically create elements
        var img = $("<img>");
        var title = $("<h2>");
        var centuryHead = $("<h4>");
        var century = $("<span>");
        var centuryContent = $("<span>");
        var periodHead = $("<h4>");
        var period = $("<span>");
        var periodContent = $("<span>");
        var divisionHead = $("<h4>");
        var division = $("<span>");
        var divisionContent = $("<span>");
        var techniqueHead = $("<h4>");
        var technique = $("<span>");
        var techniqueContent = $("<span>");
        var mediumHead = $("<h4>");
        var medium = $("<span>");
        var mediumContent = $("<span>");

        img.attr({
          src: data.primaryimageurl,
          class: "img-responsive m-1",
          width: "100%",
          height: "auto",
        });
        //use if statements to keep null values from appearing
        if (data.title !== null) {
          title.text(data.title).addClass("itemTitle");
        }
        if (data.century !== null) {
          century.text("Century: ").addClass("category");
          centuryContent.text(data.century).addClass("content");
          centuryHead.append(century, centuryContent);
        }
        if (data.period !== null) {
          period.text("Period: ").addClass("category");
          periodContent.text(data.period).addClass("content");
          periodHead.append(period, periodContent);
        }
        if (data.division !== null) {
          division.text("Division: ").addClass("category");
          divisionContent.text(data.division).addClass("content");
          divisionHead.append(division, divisionContent);
        }
        if (data.technique !== null) {
          technique.text("Technique: ").addClass("category");
          techniqueContent.text(data.technique).addClass("content");
          techniqueHead.append(technique, techniqueContent);
        }
        if (data.medium !== null) {
          medium.text("Medium: ").addClass("category");
          mediumContent.text(data.medium).addClass("content");
          mediumHead.append(medium, mediumContent);
        }

        $(".picInfo").append(
          title,
          centuryHead,
          periodHead,
          divisionHead,
          techniqueHead,
          mediumHead,
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
