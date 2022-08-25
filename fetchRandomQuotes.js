// *************** Global variables (used in index.js script)
const TOTAL_QUOTES_NUMBER = 72672;
const FETCH_QUOTES_NUMBER = 40;
let randomQuotes;

function fetchRandomQuotes() {
  const request = new Request(
    `https://quote-garden.herokuapp.com/api/v3/quotes?limit=${FETCH_QUOTES_NUMBER}&page=${Math.ceil(
      Math.random() * Math.floor(TOTAL_QUOTES_NUMBER / FETCH_QUOTES_NUMBER)
    )}`,
    {
      method: 'GET',
    }
  );

  fetch(request)
    .then((response) => response.json())
    .then(({ data }) => {
      randomQuotes = data;
    })
    .catch((error) => console.error(error));
}

// Initial fetch (performed asynchronously with the async attribute of the script tag in index.html)
fetchRandomQuotes();
