// set up dependencies
const Discord = require("discord.js");

// set up discord client
const { prefix, token } = require("./config.json");
const client = new Discord.Client();

// ready prompt
client.once("ready", () => {
  console.log("Ready.. with prefix " + prefix);
});

// login using bot token
client.login(token);

// CONSTANTS
const WIKI_SEARCH = `${prefix}wikisearch`;
const MAX_CHARS = 500;

// client messages
client.on("message", (message) => {
  if (message.content.startsWith(WIKI_SEARCH)) {
	wikiSearch(message);
  }
});

// functions
function wikiSearch(message) {
	 // parse message
	 var toSearch = message.content.substr(WIKI_SEARCH.length + 1);
 
	 if (toSearch.length > 0) {
	   // output prompt
	   message.channel.send(`Searching \"${toSearch}\" on Wikipedia...`);
 
	   const retrieveSearchResults = async () => {
		 const wikiSearchString = getWikiSearchString(toSearch);
		 const wikiSearchResults = await requestData(wikiSearchString);
		 console.log(wikiSearchResults);
		 let resultArray = [];
		 if (wikiSearchResults.hasOwnProperty("query")) {
		   resultArray = processWikiResults(wikiSearchResults.query.pages[0]);
		 }
		 return resultArray;
	   };
 
	   console.log(retrieveSearchResults[0]);
	 } else {
	   message.channel.send(`I can't search for nothing you dumbfuck`);
	 }
}

function getWikiSearchString(searchTerm) {
  var rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${MAX_CHARS}&exintro&explaintext&exlimit=max&format=json&origin=*`;
  console.log("Raw:\n " + rawSearchString);
  const searchString = encodeURI(rawSearchString);
  console.log("Parsed:\n " + searchString);
  return searchString;
}
/*
var rawSearchString = `https://en.wikipedia.org/w/api.php?action=query`;
	rawSearchString.concat(`&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages`);
	rawSearchString.concat(`|extracts&exchars=${MAX_CHARS}&exintro&explaintext&exlimit=max&format=json&origin=*`);
*/

async function requestData(searchString) {

    console.log(`Requesting data with string \n${searchString}\n...`);

  try {
    console.log(`Requesting data with string \n${searchString}\n...`);
    const response = await fetch(searchString);
    const data = await response.json();
    console.log("Response: " + response);
    console.log("Data: " + data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

function processWikiResults(results) {
  const resultArray = [];
  Object.keys(results).forEach((key) => {
    const id = key;
    const title = results[key].title;
    const text = results[key].extract;
    const img = results[key].hasOwnProperty("thumbnail")
      ? results[key].thumbnail.source
      : null;
    const item = {
      id: id,
      title: title,
      img: img,
      text: text,
    };
    resultArray.push(item);
  });
  return resultArray;
}

// functions
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
