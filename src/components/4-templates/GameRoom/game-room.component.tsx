// // src/components/4-templates/GameRoom/game-room.component.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import {
  playerVote,
  revealVotes,
  finalizeVotes,
  startNewRound,
} from '../../../store/slices/gameSlice';
import EmptySeat from '../../1-atoms/EmptySeat/empty-seat.component';
import PokerCard from '../../1-atoms/PokerCard/poker-card.component';
import GameHeader from '../../3-organisms/GameHeader/game-header.component';
import PlayerSeat from '../../2-molecules/PlayerSeat/player-seat.component';
import PlayerCard from '../../2-molecules/PlayerCard/player-card.component';
import Button from '../../1-atoms/Button/button.component';
// Import the new animation component
import VoteCounterAnimation from '../../2-molecules/VoteCounterAnimation/vote-counter-animation.component';
import VoteSummary from '../../2-molecules/VoteSummary/vote-summary.component';
import './game-room.component.scss';


const GameRoom: React.FC = () => {
  // --- All of your logic from before is correct ---
  const dispatch = useAppDispatch();
  const {
    players,
    currentUser,
    hostId,
    isCounting,
    votesRevealed,
    cardValues,
  } = useAppSelector((state) => state.game);
  const canVote = currentUser?.role === 'player';
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  useEffect(() => {
    if (isCounting) {
      const timer = setTimeout(() => {
        dispatch(finalizeVotes());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isCounting, dispatch]);
  useEffect(() => {
    if (!votesRevealed) {
      setSelectedCard(null);
    }
  }, [votesRevealed]);
  const handleVote = (value: string) => {
    if (!currentUser || votesRevealed || isCounting) return;
    setSelectedCard(value);
    dispatch(playerVote({ playerId: currentUser.id, voteValue: value }));
  };
  const isHost = currentUser?.id === hostId;
  const hasVotes = players.some((p) => p.vote);
  const showRevealButton = isHost && hasVotes && !isCounting && !votesRevealed;
  const showHand = canVote && !isCounting && !votesRevealed;
  const totalSeats = 8;
  const currentUserSeat = 7;
  const availableSeatNumbers = [1, 2, 3, 4, 5, 6, 8];
  const otherPlayers = players.filter(
    (p) => currentUser && p.id !== currentUser.id
  );
  const seatAssignments: { [key: number]: React.ReactNode } = {};
  if (currentUser) {
    seatAssignments[currentUserSeat] = (
      <div
        key={currentUser.id}
        className={`seat-position seat-${currentUserSeat}`}
      >
        <PlayerSeat player={currentUser} votesRevealed={votesRevealed} />
      </div>
    );
  }
  otherPlayers.forEach((player, index) => {
    const seatNumber = availableSeatNumbers[index];
    if (seatNumber) {
      seatAssignments[seatNumber] = (
        <div key={player.id} className={`seat-position seat-${seatNumber}`}>
          <PlayerCard player={player} votesRevealed={votesRevealed} />
        </div>
      );
    }
  });
  for (let i = 1; i <= totalSeats; i++) {
    if (!seatAssignments[i]) {
      seatAssignments[i] = (
        <div key={`empty-${i}`} className={`seat-position seat-${i}`}>
          <EmptySeat />
        </div>
      );
    }
  }

  // --- THIS IS THE CORRECTED RENDER LOGIC ---
  return (
    <div className="game-room">
      <div className="poker-table-bg">
        {isCounting && <VoteCounterAnimation />}
        {votesRevealed && isHost && (
          <div className="new-vote-button-container">
            <Button onClick={() => dispatch(startNewRound())}>
              Nueva Votación
            </Button>
          </div>
        )}
        {showRevealButton && (
          <div className="reveal-button-container">
            <Button onClick={() => dispatch(revealVotes())}>
              Revelar Votos
            </Button>
          </div>
        )}
      </div>
      <GameHeader />
      <div className="seats-container">{Object.values(seatAssignments)}</div>

      {/* The <main> tag is ALWAYS rendered. Its CONTENTS change. */}
      <main className="game-table">
        <div className="player-area">
          {/* If it's time to vote, show the hand of cards. */}
          {showHand && (
            <>
              <div className="card-selection-prompt">
                <span>Elige una carta 👇</span>
              </div>
              <div className="player-hand">
                {cardValues.map((value) => (
                  <PokerCard
                    key={value}
                    value={value}
                    isSelected={selectedCard === value}
                    onClick={() => handleVote(value)}
                  />
                ))}
              </div>
            </>
          )}

          {/* If votes have been revealed, show the summary instead. */}
          {votesRevealed && <VoteSummary players={players} />}
        </div>
      </main>
    </div>
  );
};

export default GameRoom;