// src/store/slices/gameSlice.test.ts
import { beforeEach, describe, expect, it } from '@jest/globals';
import reducer, {
  createGame,
  joinGame,
  setGamePhase,
  assignHost,
  playerVote,
  syncState,
  resetGame,
  revealVotes,
  finalizeVotes,
  startNewRound,
  setCardValues,
  type GameState,
} from './gameSlice';

// Estado inicial para las pruebas
const initialState: GameState = {
  phase: 'SPLASH',
  gameName: null,
  players: [],
  currentUser: null,
  hostId: null,
  isCounting: false,
  votesRevealed: false,
  cardValues: [
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
  ],
};

describe('gameSlice', () => {
  let state: GameState;

  beforeEach(() => {
    // Clonamos el estado inicial antes de cada test
    state = JSON.parse(JSON.stringify(initialState));

  });

  it('debería cambiar la fase del juego', () => {
    const nextState = reducer(state, setGamePhase('CREATE_GAME'));
    expect(nextState.phase).toBe('CREATE_GAME');
  });

  it('debería crear un juego y pasar a la fase JOIN_GAME', () => {
    const nextState = reducer(state, createGame('DEVTEAM'));
    expect(nextState.gameName).toBe('DEVTEAM');
    expect(nextState.phase).toBe('JOIN_GAME');
  });

  it('debería unir a un jugador y establecerlo como host si es el primero', () => {
    const nextState = reducer(
      state,
      joinGame({ name: 'Antonio', role: 'player' })
    );
    expect(nextState.players.length).toBe(1);
    expect(nextState.currentUser?.name).toBe('Antonio');
    expect(nextState.hostId).toBeDefined();
    expect(nextState.phase).toBe('GAME_ROOM');
  });

  it('debería asignar un host correctamente', () => {
    const joined = reducer(state, joinGame({ name: 'Maria', role: 'player' }));
    const playerId = joined.players[0].id;
    const nextState = reducer(joined, assignHost(playerId));
    expect(nextState.hostId).toBe(playerId);
  });

  it('debería actualizar el voto del jugador', () => {
    let nextState = reducer(state, joinGame({ name: 'Luis', role: 'player' }));
    const playerId = nextState.players[0].id;
    nextState = reducer(nextState, playerVote({ playerId, voteValue: '5' }));
    expect(nextState.players[0].vote).toBe('5');
    expect(nextState.currentUser?.vote).toBe('5');
  });

  it('debería sincronizar el estado pero mantener el currentUser', () => {
    const joined = reducer(
      state,
      joinGame({ name: 'Carla', role: 'spectator' })
    );
    const synced = reducer(
      joined,
      syncState({
        ...initialState,
        players: [{ id: 'xxx', name: 'Other', role: 'player' }],
        phase: 'GAME_ROOM',
        gameName: 'NEWGAME',
        currentUser: null,
        hostId: 'xxx',
        isCounting: false,
        votesRevealed: false,
        cardValues: [],
      })
    );
    expect(synced.currentUser).toBeNull();
    expect(synced.gameName).toBe('NEWGAME');
  });

  it('debería reiniciar el juego al estado inicial', () => {
    let nextState = reducer(state, createGame('Juego'));
    nextState = reducer(nextState, resetGame());
    expect(nextState).toEqual(initialState);
  });

  it('debería revelar y finalizar los votos correctamente', () => {
    let nextState = reducer(state, revealVotes());
    expect(nextState.isCounting).toBe(true);
    expect(nextState.votesRevealed).toBe(false);

    nextState = reducer(nextState, finalizeVotes());
    expect(nextState.isCounting).toBe(false);
    expect(nextState.votesRevealed).toBe(true);
  });

  it('debería iniciar una nueva ronda limpiando los votos', () => {
    let nextState = reducer(state, joinGame({ name: 'Test', role: 'player' }));
    const playerId = nextState.players[0].id;
    nextState = reducer(nextState, playerVote({ playerId, voteValue: '13' }));

    nextState = reducer(nextState, startNewRound());
    expect(nextState.players[0].vote).toBeNull();
    expect(nextState.currentUser?.vote).toBeNull();
    expect(nextState.isCounting).toBe(false);
    expect(nextState.votesRevealed).toBe(false);
  });

  it('debería establecer un nuevo set de valores de cartas', () => {
    const newCards = ['1', '2', '3'];
    const nextState = reducer(state, setCardValues(newCards));
    expect(nextState.cardValues).toEqual(newCards);
  });
});
