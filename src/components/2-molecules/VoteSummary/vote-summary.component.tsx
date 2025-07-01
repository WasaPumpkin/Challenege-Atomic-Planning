//src/components/2-molecules/VoteSummary/vote-summary.component.tsx
import React from 'react';
import type { Player } from '../../../store/slices/gameSlice';
import './vote-summary.component.scss';

// The calculateAverage function is still correct and needed.
const calculateAverage = (players: Player[]): string | null => {
  const numericVotes = players
    .map((p) => p.vote)
    .filter((vote) => vote && !isNaN(parseInt(vote, 10)))
    .map((vote) => parseInt(vote!, 10));

  if (numericVotes.length === 0) return null;

  const sum = numericVotes.reduce((total, vote) => total + vote, 0);
  const average = sum / numericVotes.length;
  // Use .replace() to match the comma separator from the image
  return average.toFixed(1).replace('.', ',');
};

// --- THIS IS THE NEW CORE LOGIC ---
// This function groups votes and counts how many players chose each card.
const groupAndSortVotes = (players: Player[]) => {
  const voteCounts: { [key: string]: number } = {};

  // 1. Count occurrences of each vote
  players.forEach((player) => {
    if (player.vote) {
      voteCounts[player.vote] = (voteCounts[player.vote] || 0) + 1;
    }
  });

  // 2. Convert the counts object into an array of {value, count}
  const groupedVotes = Object.entries(voteCounts).map(([value, count]) => ({
    value,
    count,
  }));

  // 3. Sort the array. Numeric values first, then non-numeric.
  groupedVotes.sort((a, b) => {
    const aIsNumeric = !isNaN(parseInt(a.value, 10));
    const bIsNumeric = !isNaN(parseInt(b.value, 10));

    if (aIsNumeric && bIsNumeric) {
      return parseInt(a.value, 10) - parseInt(b.value, 10);
    }
    if (aIsNumeric) return -1; // Numbers come before strings
    if (bIsNumeric) return 1; // Strings come after numbers
    return a.value.localeCompare(b.value); // Sort strings alphabetically
  });

  return groupedVotes;
};

const VoteSummary: React.FC<VoteSummaryProps> = ({ players }) => {
  const averageVote = calculateAverage(players);
  const groupedVotes = groupAndSortVotes(players);

  return (
    <div className="vote-summary-container">
      <div className="vote-results-hand">
        {groupedVotes.map(({ value, count }) => (
          <div
            key={value}
            className="vote-result-item"
            data-testid="vote-result-item"
          >
            <div className="result-card">
              <span className="result-card__value" data-testid="vote-value">
                {value}
              </span>
            </div>
            <span className="result-card__count">
              {count} {count === 1 ? 'Voto' : 'Votos'}
            </span>
          </div>
        ))}
      </div>

      {averageVote !== null && (
        <div className="vote-average">
          <span className="vote-average__label">Promedio:</span>
          <span className="vote-average__value">{averageVote}</span>
        </div>
      )}
    </div>
  );
};

interface VoteSummaryProps {
  players: Player[];
}

export default VoteSummary;
