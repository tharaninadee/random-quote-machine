import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Switch,
} from "@mui/material";
import { getRandomQuote } from "./quoteAPI";
import { Twitter, WhatsApp, Facebook, ContentCopy } from "@mui/icons-material";
import "./index.css";

const App = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [nextQuote, setNextQuote] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuote = useCallback(() => {
    setLoading(true);
    getRandomQuote()
      .then((data) => {
        setQuote(data.quote);
        setAuthor(data.author);
        localStorage.setItem("currentQuote", JSON.stringify(data));
        preloadNextQuote();
      })
      .finally(() => setLoading(false));
  }, []);

  const preloadNextQuote = () => {
    getRandomQuote().then((data) => setNextQuote(data));
  };

  useEffect(() => {
    const savedQuote = JSON.parse(localStorage.getItem("currentQuote"));
    if (savedQuote) {
      setQuote(savedQuote.quote);
      setAuthor(savedQuote.author);
    } else {
      fetchQuote();
    }
  }, [fetchQuote]);

  const handleNewQuote = () => {
    if (nextQuote) {
      setQuote(nextQuote.quote);
      setAuthor(nextQuote.author);
      localStorage.setItem("currentQuote", JSON.stringify(nextQuote));
      preloadNextQuote();
    } else {
      fetchQuote();
    }
  };

  const copyToClipboard = () => {
    const text = `"${quote}" - ${author}`;
    navigator.clipboard.writeText(text);
    alert("Quote copied to clipboard!");
  };

  const shareQuote = (platform) => {
    const message = `"${quote}" - ${author}`;
    const url = window.location.href;
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}%20${encodeURIComponent(
          url
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <Container maxWidth="sm">
        <div className="theme-switch">
          <Typography variant="body1">{darkMode ? "Dark Mode" : "Light Mode"}</Typography>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
        <Card className="quote-card">
          <CardContent>
            {loading ? (
              <Typography variant="h6" className="loading-text">
                Loading...
              </Typography>
            ) : (
              <>
                <Typography variant="h5" className="quote-text">
                  <span className="quote-icon">❝</span> {quote}
                </Typography>

                <Typography variant="h6" className="quote-author">
                  - {author}
                </Typography>
              </>
            )}
            <Button
              variant="contained"
              className="new-quote-button"
              onClick={handleNewQuote}
              disabled={loading}
            >
              New Quote
            </Button>
            <div className="share-icons">
              <IconButton onClick={copyToClipboard} className="share-icon">
                <ContentCopy />
              </IconButton>
              <IconButton onClick={() => shareQuote("twitter")} className="share-icon">
                <Twitter />
              </IconButton>
              <IconButton onClick={() => shareQuote("whatsapp")} className="share-icon">
                <WhatsApp />
              </IconButton>
              <IconButton onClick={() => shareQuote("facebook")} className="share-icon">
                <Facebook />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default App;
