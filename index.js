// ***************** DOM Elements
const randomButton = document.querySelector('header button');
const randomButtonIcon = randomButton.querySelector('span');

const quotesContainer = document.querySelector('main.quotes-container');
const quotesAuthor = quotesContainer.querySelector('.quotes-author');
const firstQuoteText = quotesContainer.querySelector('.quote p');
const quoteMetadata = document.querySelector('main .quote-metadata');
const quoteAuthorText = quoteMetadata.querySelector('.author');
const quoteGenreText = quoteMetadata.querySelector('.genre');

const quoteNavigator = quotesContainer.querySelector('.quote-navigator');

let clickCounter = 0;

// ***************** Functions
function updateQuoteText(quoteText, quoteAuthor, quoteGenre) {
  quotesAuthor.textContent = quoteAuthor;
  firstQuoteText.textContent = quoteText;
  quoteAuthorText.textContent = quoteAuthor;
  quoteGenreText.textContent = quoteGenre;
}

function fetchSingleQuote() {
  const request = new Request(
    `https://quote-garden.herokuapp.com/api/v3/quotes?limit=1&page=${Math.ceil(
      Math.random() * TOTAL_QUOTES_NUMBER
    )}`,
    {
      method: 'GET',
    }
  );

  fetch(request)
    .then((response) => response.json())
    .then(({ data }) => {
      const { quoteText, quoteAuthor, quoteGenre } = data[0];
      updateQuoteText(quoteText, quoteAuthor, quoteGenre);

      // Stop icon animation
      randomButtonIcon.style.animationIterationCount = 1;
    })
    .catch((error) => console.error(error));
}

function fetchAuthorQuotes(quoteAuthor) {
  const request = new Request(
    `https://quote-garden.herokuapp.com/api/v3/quotes?page=1&limit=3&author=${quoteAuthor}`,
    {
      method: 'GET',
    }
  );

  fetch(request)
    .then((response) => response.json())
    .then(({ data }) => {
      const [firstQuote, ...tailData] = data;
      updateQuoteText(
        firstQuote.quoteText,
        firstQuote.quoteAuthor,
        firstQuote.quoteGenre
      );
      tailData.forEach(({ quoteText }) => {
        const quoteEl = document.createElement('div');
        quoteEl.classList.add('quote');
        const quoteTextEl = document.createElement('p');
        quoteTextEl.textContent = quoteText;
        quoteEl.appendChild(quoteTextEl);
        quotesContainer.appendChild(quoteEl);
      });

      // Stop icon animation
      randomButtonIcon.style.animationIterationCount = 1;
    })
    .catch((error) => console.error(error));
}

// ***************** Event listeners
// Display a new random quote. Take it from randomQuotes variable from fetchRandomQuotes.js script or,
// if it didn't finish fetching the quotes, fetch one random quote
randomButton.addEventListener('click', () => {
  // Animate the icon inside the button
  randomButtonIcon.classList.add('icon-animation');

  if (clickCounter >= FETCH_QUOTES_NUMBER) {
    // Fetch a new batch of random quotes
    randomQuotes = null;
    fetchRandomQuotes();
    clickCounter = 0;
  }

  // If there were more than one quote displayed, leave only one
  const quotes = quotesContainer.querySelectorAll('.quote');
  if (quotes.length > 1) {
    // Remove all quote elements but the first one
    quotes.forEach((quoteEl, key) => {
      if (key > 0) {
        quotesContainer.removeChild(quoteEl);
      }
    });
    // Hide quotes author element
    quotesAuthor.style.display = 'none';
    // Show quote navigator
    quoteNavigator.style.display = 'flex';
  }
  if (!randomQuotes) {
    // If fetchRandom.js didn't finish fetching random quotes
    // fetch one random quote
    // Keep icon animated while fetching the quote
    randomButtonIcon.style.animationIterationCount = 'infinite';
    fetchSingleQuote();
  } else {
    // Update quote with a random one
    const { quoteText, quoteAuthor, quoteGenre } =
      randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

    updateQuoteText(quoteText, quoteAuthor, quoteGenre);
    clickCounter += 1;
  }
});

randomButtonIcon.addEventListener('animationend', () => {
  // Remove icon-animation class for future animations
  randomButtonIcon.classList.remove('icon-animation');
});

quoteNavigator.addEventListener('click', () => {
  // Hide navigator element
  quoteNavigator.style.display = 'none';
  // Reveal the quotes' author
  quotesAuthor.style.display = 'initial';
  const currentQuoteAuthor = quoteMetadata.querySelector('.author').textContent;
  fetchAuthorQuotes(currentQuoteAuthor);
});
