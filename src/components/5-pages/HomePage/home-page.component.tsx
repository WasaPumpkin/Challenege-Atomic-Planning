// // src/components/5-pages/HomePage/home-page.component.tsx

// src/components/5-pages/HomePage/home-page.component.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { setGamePhase } from '../../../store/slices/gameSlice';
import Logo from '../../1-atoms/Logo/logo.component';
import CreateGameForm from '../../3-organisms/CreateGameForm/create-game-form.component';
import JoinGameForm from '../../3-organisms/JoinGameForm/join-game-form.component';
import GameRoom from '../../4-templates/GameRoom/game-room.component';
import './home-page.component.scss';

// The SplashScreen is now just a simple visual component with its own timer.
const SplashScreen = () => {
  const dispatch = useAppDispatch();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const displayTimer = setTimeout(() => {
      setIsFadingOut(true);
      const phaseChangeTimer = setTimeout(() => {
        dispatch(setGamePhase('CREATE_GAME'));
      }, 400);
      return () => clearTimeout(phaseChangeTimer);
    }, 1000);
    return () => clearTimeout(displayTimer);
  }, [dispatch]);

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <Logo text="pragma" />
    </div>
  );
};


const HomePage: React.FC = () => {
  // Get all the state we need to make a decision
  const { phase, gameName, currentUser } = useAppSelector((state) => state.game);

  // --- THIS IS THE NEW, BULLETPROOF LOGIC ---
  let currentPhase = phase;

  if (gameName && !currentUser) {
    // If a game exists, but WE have no identity in this tab, we MUST be in the JOIN phase.
    // This is the case for Luisa, both when she first joins AND when she refreshes her page.
    currentPhase = 'JOIN_GAME';
  } else if (gameName && currentUser) {
    // If a game exists and WE have an identity, we MUST be in the GAME_ROOM.
    // This is the case for Antonio after he has joined, and also for Luisa after she has joined.
    currentPhase = 'GAME_ROOM';
  } else if (!gameName && phase !== 'CREATE_GAME') {
    // If there is no game at all, and we're not already creating one, we should be at the start.
    currentPhase = 'SPLASH';
  }

  // The render logic now uses our calculated, guaranteed-correct phase.
  const renderPhase = () => {
    switch (currentPhase) {
      case 'SPLASH':
        return <SplashScreen />;
      case 'CREATE_GAME':
        return <CreateGameForm />;
      case 'JOIN_GAME':
        return (
          <div className="game-container--blurred">
            <GameRoom />
            <JoinGameForm />
          </div>
        );
      case 'GAME_ROOM':
        return <GameRoom />;
      default:
        // A safe fallback
        return <CreateGameForm />;
    }
  };

  return <div className="home-page">{renderPhase()}</div>;
};

export default HomePage;