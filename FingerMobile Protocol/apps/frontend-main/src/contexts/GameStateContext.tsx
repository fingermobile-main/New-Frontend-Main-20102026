import React, { createContext, useContext } from 'react';
// Game State Context - Stub
const GameStateContext = createContext<any>(null);

export const useGameState = () => useContext(GameStateContext);
export default GameStateContext;
