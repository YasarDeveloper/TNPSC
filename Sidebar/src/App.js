// import './App.css';
// import Sidebar from './sidebar';
// import { BrowserRouter as Router } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Sidebar />
//       </div>
//     </Router>
//   );
// }

// export default App;

import './App.css';
import Sidebar from './sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from './ProfilePage'; // Import your profile page component

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}> {/* Flex container */}
        <Sidebar /> {/* Sidebar */}
        <div style={{ flex: 1 }}> {/* Content area */}
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            {/* other routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;