import { addnavIcon } from "./index.js";
import { tasks } from "./test.js";

addnavIcon();
window.addEventListener("resize", addnavIcon);

console.log(window.location);
function getParam(param) {
  const paramString = window.location.search;
  // console.log(window.location);
  const params = new URLSearchParams(paramString);
  return params.get(param);
}

// url parameter
console.log(tasks);

// 1. Get the `words` parameter from the URL
const wordsParam = getParam("description");
if (!wordsParam) {
  console.error("No 'words' parameter found in the URL.");
} else {
  // 2. Parse the list of words
  const words = wordsParam.split(",");
  console.log("Words from URL:", words);

  // 3. Lookup each word in localStorage and filter matching descriptions
  const matchedWords = words.filter((word) => {
    const storedValue = localStorage.getItem(word); // Get word from localStorage
    return storedValue !== null; // Match found if the word exists in localStorage
  });

  console.log("Matched words in localStorage:", matchedWords);

  // 4. Insert matched words into localStorage as a single list
  localStorage.setItem("matchedWords", JSON.stringify(matchedWords));

  // 5. Redirect to insert.html
  window.location.href = "insert.html";
}
