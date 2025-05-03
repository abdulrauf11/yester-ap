import { createContext, useContext, useState } from 'react';

// Create a new context to share global state across the app
const GlobalStateContext = createContext();

// This component wraps your entire app and provides shared state
export const GlobalStateProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null); // stores user info: { userId, username }
  // const [gameState, setGameState] = useState(null); // stores game session info after matchmaking

  // Add any other global states here and include in the value below
  return (
    <GlobalStateContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        // gameState,
        // setGameState,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to access global state anywhere in the app
export const useGlobalState = () => useContext(GlobalStateContext);
