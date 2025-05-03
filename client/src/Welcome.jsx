// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>Welcome | ColorGrid</title>
//   <link rel="stylesheet" href="../css/welcome.css" />
// </head>
// <body>
//   <main class="welcome-container">
//     <h1 class="welcome-title">Welcome to ColorGrid</h1>
//     <p class="welcome-subtitle">A real‑time, multiplayer grid conquest game.</p>
//     <div class="welcome-buttons">
//       <a href="./login.html" class="btn btn-primary">Login</a>
//       <a href="./signup.html" class="btn btn-secondary">Sign Up</a>
//     </div>
//   </main>
// </body>
// </html>
import { Link } from 'react-router-dom';
import '../../design/css/welcome.css'; // import the css file for the specific component

function Welcome() {
  return (
    <div>
      <main className="welcome-container">
        <h1 className="welcome-title">Welcome to ColorGrid</h1>
        <p className="welcome-subtitle">
          A real‑time, multiplayer grid conquest game.
        </p>
        <div className="welcome-buttons">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            SignUp
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Welcome;
