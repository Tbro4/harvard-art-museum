var APIkey = "a019a706-259c-4a2f-9933-1f3c5d716d8a";

//https://api.harvardartmuseums.org/object?sort=random&apikey=a019a706-259c-4a2f-9933-1f3c5d716d8a

//values from each checked button
var techniqueChoices = [];
//string values together to place in URL endpoint
var techniques;
//holds id #s to dynamically generate pics
var ids = [];

//upon submit, any clicked buttons value is pushed to techniqueChoices array
//needs to hide div, make API call, show new div with pics
document.querySelector("#submitBtn").addEventListener("click", function (e) {
  e.preventDefault();
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

  //   var picsURL =
  //     "https://api.harvardartmuseums.org/object/" + id + "?apikey=" + APIkey;

  fetch(museumURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
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
      console.log(ids);
    });
});
