// // src/components/2-molecules/PlayerSeat/player-seat.component.tsx
import React from 'react';
import type { Player } from '../../../store/slices/gameSlice';
import { useAppSelector } from '../../../hooks/redux-hooks';
import './player-seat.component.scss';

interface PlayerSeatProps {
  player: Player;
  votesRevealed: boolean;
}

const getInitials = (name: string = '') =>
  name.trim().slice(0, 2).toUpperCase();

const PlayerSeat: React.FC<PlayerSeatProps> = ({ player, votesRevealed }) => {
  // --- CHANGE 1: Get ONLY hostId. editorId no longer exists. ---
  const hostId = useAppSelector((state) => state.game.hostId);

  // --- CHANGE 2: Simplify the logic to only check for the host. ---
  const isThisPlayerTheHost = player.id === hostId;

  const hasVoted = !!player.vote;
  const seatClassName = `player-seat ${hasVoted ? 'player-seat--voted' : ''} ${
    votesRevealed && hasVoted ? 'player-seat--revealed' : ''
  }`;

  return (
    <div className={seatClassName}>
      <div className="player-seat__avatar">
        {votesRevealed && player.vote ? (
          <span className="player-seat__vote-value">{player.vote}</span>
        ) : (
          <span className="player-seat__initials" data-testid="player-initials">
            {getInitials(player.name)}
          </span>
        )}
      </div>
      <div className="player-seat__name">
        {player.name}
        {/* --- CHANGE 3: Remove the editor logic. Only show the crown for the host. --- */}
        {isThisPlayerTheHost && (
          <span className="player-seat-icon player-seat__crown">👑</span>
        )}
      </div>
    </div>
  );
};

export default PlayerSeat;

