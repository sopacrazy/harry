/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Grade } from './pages/Grade';
import { Feiticos } from './pages/Feiticos';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/grade" element={<Grade />} />
        <Route path="/feiticos" element={<Feiticos />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
