import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Main from './pages/Main';

export default function App(){
  return (
      <Router basename = '/javatrol'>
        <Routes>
            <Route path ='/' element={<Home />} />
            <Route path ='/app' element={<Main />} />
        </Routes>
      </Router>
  )
}

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/app" element={<Main />} />
//       </Routes>
//   </Router>
//   )
// }

