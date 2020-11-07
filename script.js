// jshint esversion: 6
'use strict';

const apiKey = 'wOZNcf2FJtbHw6UqOeP96cP7sfwLq6kV1tB1d9WH';
const searchUrl = 'https://developer.nps.gov/api/v1/parks'; // parks endpoint

function myDebug(str) {
  console.log(str);
}

// format parameters string
// ?stateCode=MI,WI&limit=10
function formatParametersString(paramsObj) {
  let paramItems = Object.keys(paramsObj).map( key => `${key}=${paramsObj[key]}`);

  let paramString = '?' + paramItems.join('&');

  return paramString;
}

// set up parameters object
function setupQueryString(stateList, maxResults) {

  const myParams = {
    api_key: apiKey,
    stateCode: stateList,
    limit: maxResults
  };

  let queryString = searchUrl + formatParametersString(myParams);

return queryString;
}

// fetch results
function fetchResults(queryString) {

  fetch(queryString)
  .then( response => response.json() )
  .then( responseJson => {
    //myDebug(responseJson);
    displayResults(responseJson);
  })
  .catch(error => console.log("There was an error with the request: "+ error.message));
}

function formatAddressString(addressArray) {
  let addressStringArray = addressArray.map( address => {

    let extraLines = '';
    if( address.line2 != '') {
      extraLines = `\n${address.line2}`;
    }
    if( address.line3 != '') {
      extraLines += `\n${address.line3}`;
    }

    let addressString = `<p>Type: ${address.type}</p><p>${address.line1}${extraLines},\n${address.city}, ${address.stateCode} ${address.postalCode}</p>`;
    return addressString;
  });

  let fullAddressString = addressStringArray.join(``);
  return fullAddressString;
}
// parse results
//    fullName
//    description
//    url
//    addresses array
function displayResults( resultsObject) {

  let parksData = resultsObject.data;
  let parksHtml ='';

  parksData.forEach(park => {
    let parkNameString = `<h2>${park.fullName}</h2>`;
    let parkDescriptionString = `<p>${park.description}</p>`;
    let parkUrlString = `<h3>${park.url}</h3>`;
    let parkAddresses = park.addresses;
    let parkAddressString = formatAddressString(parkAddresses);

    parksHtml += parkNameString + parkUrlString + parkDescriptionString + parkAddressString + '<hr>';
  });

  $('.js-results').html(parksHtml);
  $('.hidden').removeClass('hidden');
}

// handle submit button
function handleSubmitButton() {

  $('form').submit(event => {

    event.preventDefault();
    let stateList = $('#states').val();
    let maxResults = $('#numResults').val();

    let urlQuery = setupQueryString(stateList, maxResults);
    let resultsObject = fetchResults(urlQuery);

  });
}

// initialize
$(handleSubmitButton);