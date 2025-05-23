import './App.css';

// Import routing components from React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import global state provider to share data (like user info) across components
import { GlobalStateProvider } from './GlobalStateContext';

// Import page components
import Welcome from './Welcome';
import Login from './Login';
import Home from './Home';
import Waiting from './Waiting';
import Gameplay from './Gameplay';
import Signup from './Signup';
import UpdateProfile from './UpdateProfile';
import History from './History';
import HistoryDetail from './HistoryDetail';

function App() {
  return (
    <div>
      {/* Wrap the entire app with GlobalStateProvider to make state accessible throughout */}
      <GlobalStateProvider>
        {/* Set up routing for different pages */}
        <BrowserRouter>
          <Routes>
            {/* Route for welcome/landing page */}
            <Route path="/" element={<Welcome />} />

            {/* Route for login page */}
            <Route path="/login" element={<Login />} />

            {/* Route for signup page */}
            <Route path="/signup" element={<Signup />} />

            {/* Route for home screen after login */}
            <Route path="/home" element={<Home />} />

            {/* Route for update profile page */}
            <Route path="/update-profile" element={<UpdateProfile />} />

            {/* Waiting room before game starts */}
            <Route path="/newgame/waiting" element={<Waiting />} />

            {/* Game page (dynamic route based on game ID) */}
            <Route path="/newgame/:gameId" element={<Gameplay />} />

            {/* History page */}
            <Route path="/history" element={<History />} />

            {/* History detail page (dynamic route based on game ID) */}
            <Route path="/history/:gameId" element={<HistoryDetail />} />
          </Routes>
        </BrowserRouter>
      </GlobalStateProvider>
    </div>
  );
}

export default App;
