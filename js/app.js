$(document).ready(function () {

  var arr = [];
  checkData();

  $('#table-pagination').DataTable({
    pagingType: 'simple_numbers',
  });

});


//


function loadData() {

  $.ajax('https://restcountries.com/v3.1/all',
    {
      type: 'GET',
      success: function (data, status, xhr) {
        console.log(data)  // success callback function
        data.forEach(countryData => {
          let countryName = countryData.name.common;

          let countryObj = {
            name: countryName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
            cap: countryData.capital,
            cont: countryData.continents,
            pop: countryData.population
          }
          arr.push(JSON.stringify(countryObj));

        });
        // console.log(arr);
        localStorage.setItem("countryKey", JSON.stringify(arr));

        dispalyData();
      },
      error: function (jqXhr, textStatus, errorMessage) { // error callback 
        console.log('error')
      }
    });

}

function dispalyData() {

  // console.log(localStorage.getItem("countryKey"))
  var localData = localStorage.getItem("countryKey")
  let parserLocalData = JSON.parse(localData)

  parserLocalData.forEach(arrData => {
    arrData = JSON.parse(arrData)
    let rowElement = `<tr><td>${arrData.name}</td><td>${arrData.cap}</td><td>${arrData.cont}</td><td>${arrData.pop.toLocaleString()}</td><td><a href="javascript:void(0);" onclick="fetchIndCountryInfo('${arrData.name}');" class="btn btn-primary">view</a></td></tr>`
    $("#countryData-element").append(rowElement)
    // console.log(arrData)

  })
  hideAnimation();
}

function checkData() {
  if (localStorage.getItem("countryKey") == null) {
    showloadinganimation();
    loadData();
  } else {
    dispalyData()

  }

}

function fetchIndCountryInfo(countryName) {
  showloadinganimation()

  $.ajax('https://restcountries.com/v3.1/name/' + countryName + '?fullText=true',
    {
      type: 'GET',
      success: function (data, status, xhr) {   // success callback function
        // console.log(data)

        dispalyCountryData(data)
      },
      error: function (jqXhr, textStatus, errorMessage) { // error callback 
        console.log('error')
      }
    });
}

function dispalyCountryData(obj) {

  // console.log(obj)
  $("#my-image").attr("src", obj[0].flags.png)
  $("#name").text(obj[0].name.common)
  $("#cap").text(obj[0].capital)
  $("#cont").text(obj[0].continents)
  $("#reg").text(obj[0].region)
  $("#sub").text(obj[0].subregion)
  let countryLang = obj[0].languages
  $("#lang").text(Object.values(countryLang))
  let countryPOp = obj[0].population;
  $("#pop").text(countryPOp.toLocaleString())

  if (obj[0].independent === true) {
    $("#ind").text('Yes')
  } else {
    $("#ind").text('No')
  }

  if (obj[0].landlocked === true) {
    $("#land").text('Yes')
  } else {
    $("#land").text('No')
  }

  hideAnimation()
  $("#myModal").modal('show');



}

function showloadinganimation() {
  $('#loading-spin').show()
}

function hideAnimation() {
  $('#loading-spin').hide()
}

