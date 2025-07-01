
// // src/store/slices/gameSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type GamePhase = 'SPLASH' | 'CREATE_GAME' | 'JOIN_GAME' | 'GAME_ROOM';
export interface Player {
  id: string;
  name: string;
  role: 'player' | 'spectator';
  vote?: string | null;
}

// --- CHANGE 1: REMOVE editorId from the state definition ---
export interface GameState {
  phase: GamePhase;
  gameName: string | null;
  players: Player[];
  currentUser: Player | null;
  hostId: string | null;
  isCounting: boolean;
  votesRevealed: boolean;
  cardValues: string[];
  // editorId: string | null; // This is now gone.
}

const defaultCardValues = [
  '0',
  '1',
  '3',
  '5',
  '8',
  '13',
  '21',
  '34',
  '55',
  '89',
  '?',
  '☕️',
];

// --- CHANGE 2: REMOVE editorId from the initial state ---
const initialState: GameState = {
  phase: 'SPLASH',
  gameName: null,
  players: [],
  currentUser: null,
  hostId: null,
  isCounting: false,
  votesRevealed: false,
  cardValues: defaultCardValues,
  // editorId: null, // This is now gone.
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGamePhase: (state, action: PayloadAction<GamePhase>) => {
      state.phase = action.payload;
    },
    createGame: (state, action: PayloadAction<string>) => {
      state.gameName = action.payload;
      state.phase = 'JOIN_GAME';
    },
    joinGame: (
      state,
      action: PayloadAction<{ name: string; role: 'player' | 'spectator' }>
    ) => {
      const { name, role } = action.payload;
      const newPlayer: Player = {
        id: new Date().toISOString() + name,
        name,
        role,
      };
      if (state.players.length === 0) {
        state.hostId = newPlayer.id; // Correctly sets the first player as host.
      }
      state.players.push(newPlayer);
      state.currentUser = newPlayer;
      state.phase = 'GAME_ROOM';
    },
    togglePlayerRole: (state, action: PayloadAction<string>) => {
      const playerId = action.payload;
      const playerInArray = state.players.find((p) => p.id === playerId);

      if (playerInArray) {
        // Cambia el rol al opuesto
        playerInArray.role =
          playerInArray.role === 'player' ? 'spectator' : 'player';
      }

      // Actualiza también el rol del currentUser si es el mismo jugador
      if (state.currentUser && state.currentUser.id === playerId) {
        state.currentUser.role =
          state.currentUser.role === 'player' ? 'spectator' : 'player';
      }
    },
    playerVote: (
      state,
      action: PayloadAction<{ playerId: string; voteValue: string }>
    ) => {
      const { playerId, voteValue } = action.payload;
      const playerInArray = state.players.find((p) => p.id === playerId);
      if (playerInArray) {
        playerInArray.vote = voteValue;
      }
      if (state.currentUser && state.currentUser.id === playerId) {
        state.currentUser.vote = voteValue;
      }
    },
    // The existing assignHost reducer is exactly what we need.
    assignHost: (state, action: PayloadAction<string>) => {
      if (state.players.some((p) => p.id === action.payload)) {
        state.hostId = action.payload;
      }
    },
    syncState: (state, action: PayloadAction<GameState>) => {
      const newState = action.payload;
      const self = state.currentUser
        ? newState.players.find((p) => p.id === state.currentUser!.id)
        : null;
      return {
        ...newState,
        currentUser: self || null,
      };
    },
    resetGame: () => {
      return initialState;
    },
    revealVotes: (state) => {
      state.isCounting = true;
      state.votesRevealed = false;
    },
    finalizeVotes: (state) => {
      state.isCounting = false;
      state.votesRevealed = true;
    },
    setCardValues: (state, action: PayloadAction<string[]>) => {
      state.cardValues = action.payload;
    },

    startNewRound: (state) => {
      state.players.forEach((player) => {
        player.vote = null;
      });
      if (state.currentUser) {
        state.currentUser.vote = null;
      }
      state.isCounting = false;
      state.votesRevealed = false;
    },
  },
});


export const {
  setGamePhase,
  createGame,
  joinGame,
  assignHost,
  playerVote,
  togglePlayerRole,
  syncState,
  resetGame,
  setCardValues,
  revealVotes,
  finalizeVotes,
  startNewRound,
} = gameSlice.actions;

export default gameSlice.reducer;