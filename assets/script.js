var APIkey = "a019a706-259c-4a2f-9933-1f3c5d716d8a";

//https://api.harvardartmuseums.org/object?sort=random&apikey=a019a706-259c-4a2f-9933-1f3c5d716d8a

//values from each checked button
var techniqueChoices = [];
//string values together to place in URL endpoint
var techniques;

//upon submit, any clicked buttons value is pushed to techniqueChoices array
//needs to hide div, make API call, show new div with pics
document.querySelector("#submitBtn").addEventListener("click", function (e) {
  e.preventDefault();
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
      console.log(data);
      console.log(data.records[0].id);
    });
});
