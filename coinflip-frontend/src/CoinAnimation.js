import React, { useState, useEffect } from 'react';
import coinFlipGif from './assets/CoinflipGIF.gif';
import coinHead from './assets/Coin-Head.png';
import coinTail from './assets/Coin-Tail.png';

const CoinAnimation = ({ isFlipping, flipResult, userChoice }) => {
  const [currentFace, setCurrentFace] = useState(coinHead);

  useEffect(() => {
    if (!isFlipping && flipResult !== 'none') {
      if (flipResult === 'win') {
        // If the user won, show the face they chose
        setCurrentFace(userChoice ? coinHead : coinTail);
      } else {
        // If the user lost, show the opposite face
        setCurrentFace(userChoice ? coinTail : coinHead);
      }
    }
  }, [isFlipping, flipResult, userChoice]);

  return (
    <div className="coin-container transition-all duration-1000">
      {isFlipping ? (
        <img src={coinFlipGif} alt="Coin flipping" className="coin-gif scale-125" />
      ) : (
        <img src={currentFace} alt="Coin face" className="coin-face" />
      )}
    </div>
  );
};

export default CoinAnimation;
