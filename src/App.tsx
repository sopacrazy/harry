/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Grade } from './pages/Grade';
import { Feiticos } from './pages/Feiticos';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/grade" element={<Grade />} />
        <Route path="/feiticos" element={<Feiticos />} />
      </Routes>
    </Router>
  );
}
