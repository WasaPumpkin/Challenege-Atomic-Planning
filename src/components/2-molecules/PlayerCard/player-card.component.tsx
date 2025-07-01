// // // src/components/2-molecules/PlayerCard/player-card.component.tsx
import React from 'react';
import type { Player } from '../../../store/slices/gameSlice';
import { useAppSelector } from '../../../hooks/redux-hooks';
import './player-card.component.scss';

interface PlayerCardProps {
  player: Player;
  votesRevealed: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, votesRevealed }) => {
  const hostId = useAppSelector((state) => state.game.hostId);
  const isThisPlayerTheHost = player.id === hostId;
  const hasVoted = !!player.vote;

  const cardContainerClassName = `player-card-container ${
    hasVoted ? 'player-card-container--voted' : ''
  } ${votesRevealed && hasVoted ? 'player-card-container--revealed' : ''}`;

  return (
    <div className={cardContainerClassName}>
      <div className="player-card">
        {votesRevealed && player.vote && (
          <span className="player-vote-value">{player.vote}</span>
        )}
      </div>
      <span className="player-card-name">
        {player.name}
        {isThisPlayerTheHost && <span className="player-card-crown">👑</span>}
      </span>
    </div>
  );
};

export default PlayerCard;