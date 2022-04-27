//access random object

//https://api.harvardartmuseums.org/object?sort=random&apikey=a019a706-259c-4a2f-9933-1f3c5d716d8a

//this will be the filler of techniques for the URL endpoint. Each technique needs a | between it
var techniqueChoices = [];

//upon submit, any clicked buttons value is pushed to techniqueChoices array
document.querySelector("#submitBtn").addEventListener("click", function (e) {
  e.preventDefault();
  var form = document.querySelector("#buttonGroup");
  Array.from(form.querySelectorAll("input")).forEach(function (inp) {
    if (inp.checked === true) {
      techniqueChoices.push(inp.value);
    }
  });
  console.log(techniqueChoices);
});
