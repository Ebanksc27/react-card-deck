import React, { useState, useEffect } from 'react';
import './App.css';

// Definition of the Card component which is responsible for rendering the image of a card.
// It receives `image` as a prop, which is the URL of the card's image, and `style` for inline styling.
const Card = ({ image, style }) => {
  return (
    <div className="card" style={style}>
      <img src={image} alt="card" />
    </div>
  );
};

// Main functional component of the application that manages the deck and card drawing logic.
function App() {
  // State hooks to manage the deck data, the list of drawn cards, and the loading state.
  const [deck, setDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Asynchronous function to fetch a new deck from the Deck of Cards API.
  // It sets the loading state, makes an API request, updates the deck state with the fetched data,
  // resets the drawnCards state, and then sets the loading state back to false.
  const fetchNewDeck = async () => {
    setIsLoading(true);
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    setDeck(data);
    setDrawnCards([]);
    setIsLoading(false);
  };

  // Asynchronous function to draw a card from the deck.
  // It checks if there are remaining cards. If not, it shows an alert.
  // If there are remaining cards, it sets the loading state, makes an API request to draw a card,
  // updates the deck and drawnCards states, and then sets the loading state back to false.
  const drawCard = async () => {
    if (deck.remaining === 0) {
      alert('Error: no cards remaining!');
      return;
    }
    setIsLoading(true);
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    const data = await response.json();
    setDeck({ ...deck, remaining: data.remaining });
    setDrawnCards(prevDrawnCards => [...prevDrawnCards, ...data.cards]);
    setIsLoading(false);
  };

  // Asynchronous function to shuffle the existing deck.
  // It sets the loading state, makes an API request to shuffle the deck,
  // updates the deck state to reflect the full count of cards, clears the drawnCards state,
  // and then sets the loading state back to false.
  const shuffleDeck = async () => {
    setIsLoading(true);
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
    const data = await response.json();
    if (data.success) {
      setDeck({ ...deck, remaining: data.remaining });
      setDrawnCards([]);
    } else {
      alert('Error: could not shuffle the deck.');
    }
    setIsLoading(false);
  };

  // Effect hook to fetch a new deck when the component mounts.
  // The empty dependency array means this effect will run once after the initial render.
  useEffect(() => {
    fetchNewDeck();
  }, []);

  // Render method that returns JSX.
  // It displays a title, maps through the drawnCards state to render Card components,
  // and shows two buttons to draw a card and shuffle the deck.
  // The buttons are disabled when isLoading is true.
  return (
    <div className="App">
      <h1>Click to Draw!</h1>
      <div className="card-container">
        {drawnCards.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            style={{
              transform: `translate(-50%, -50%) rotate(${index * 5}deg)`,
              zIndex: index // Stack the cards with increasing z-index values
            }}
          />
        ))}
      </div>
      <button onClick={drawCard} disabled={isLoading}>
        {isLoading ? 'Drawing...' : 'Draw Card'}
      </button>
      <button onClick={shuffleDeck} disabled={isLoading}>
        {isLoading ? 'Shuffling...' : 'Shuffle Deck'}
      </button>
    </div>
  );
}

export default App;
