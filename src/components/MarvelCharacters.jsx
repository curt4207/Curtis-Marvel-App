import { useState, useEffect } from "react";
// import style from '../App.css'
import axios from "axios";
import { getMarvelCharacters } from "../helperFunction/getMarvelCharacters";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "styled-components";

const FlipCard = styled.div`
cursor: pointer;
perspective:  1000px;
width: 200px;
height: 300px;
margin: 10px;

`
const FlipCardInner = styled.div`
 position: relative;
 width: 100%;
 height: 100%;
 text-align: center;
 transition: transform 0.5s;
 transform-style: preserve-3d;
 box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
 transform: ${({ isFlipped }) => (isFlipped ? "rotateY(180deg)" : "none")};
`
const FlipCardFront = styled(Card)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`
const FlipCardBack = styled(Card)`
   position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #fff;
  color: black;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;

`


const MarvelCharacters = () => {
  const [allCharacters, setAllCharacters] = useState([]); // State for storing all characters
  const [characters, setCharacters] = useState([]); // State for storing characters currently displayed
  const [loading, setLoading] = useState(true); // State for tracking loading status
  const [error, setError] = useState(null); // State for tracking errors
  const [offset, setOffset] = useState(0); // State for tracking pagination offset
  const [search, setSearch] = useState(""); // State for storing search input
  const [filteredCharacters, setFilteredCharacters] = useState([]); // State for storing filtered characters
  const [flippedCards, setFlippedCards] = useState({}); // State for tracking flipped cards

  // Function to fetch characters from the API
  const fetchData = async (offset) => {
    try {
      const characters = await getMarvelCharacters(offset); // Fetch characters using helper function
      setAllCharacters((prev) => [...prev, ...characters]); // Append new characters to allCharacters
      setCharacters(characters); // Set characters state
      setFilteredCharacters(characters); // Set filtered characters state
      setLoading(false); // Set loading to false
    } catch (error) {
      setError(error.message); // Set error message
      setLoading(false); // Set loading to false
    }
  };

  // useEffect to fetch data on component mount and when offset changes
  useEffect(() => {
    fetchData(offset);
  }, [offset]);

  // useEffect to filter characters based on search input
  useEffect(() => {
    setFilteredCharacters(
      allCharacters.filter((character) =>
        character.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, allCharacters]);

  // Display loading message if data is still loading
  if (loading) return <p>Loading...</p>;

  // Display error message if there's an error
  if (error) return <p>Error: {error}</p>;

  // Function to handle next button click for pagination
  const handleNext = () => {
    setOffset(offset + 20);
  };

  // Function to handle previous button click for pagination
  const handlePrevious = () => {
    setOffset(offset - 20);
  };

  // Function to handle card click to flip the card
  const handleCardClick = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  console.log(characters); // Log characters to console for debugging

  // Return JSX to render the component
  return (
    <>
      <h1>Marvel Characters</h1>
      <input
        type="text"
        placeholder="Search Character..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredCharacters.slice(offset, offset + 20).map((character) => (
          <FlipCard className="card" key={character.id} onClick={() => handleCardClick(character.id)}>
            <FlipCardInner className="card-content" isFlipped={flippedCards[character.id]}>
              <FlipCardFront className="card-front">
                <Typography variant="h5" style={{ margin: "10px", textAlign: "left" }}>
                  <h4>{character.name}</h4>
                  <img
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                    height={100}
                    width={100}
                  />
                </Typography>
              </FlipCardFront>
              <FlipCardBack className="card-back">
                <Typography variant="body2">{character.description ? character.description : "N/A"}</Typography>
              </FlipCardBack>
            </FlipCardInner>
          </FlipCard>
        ))}
      </div>

      <div>
        {offset > 0 && <button onClick={handlePrevious}>Previous</button>}
        <button onClick={handleNext}>Next</button>
      </div>
    </>
  );
};

export default MarvelCharacters; // Export the component as default
