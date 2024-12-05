const quotesURL =
  "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";

export const getRandomQuote = async () => {
  try {
    const response = await fetch(quotesURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const quotesArray = data.quotes;
    return quotesArray[Math.floor(Math.random() * quotesArray.length)];
  } catch (error) {
    console.error("Error fetching quotes:", error.message);
    return {
      quote: "Oops! Something went wrong.",
      author: "Unknown",
    };
  }
};
