import { HashRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Lesson } from './pages/Lesson'
import { CompanyData } from './pages/CompanyData'
import { NotFound } from './pages/NotFound'

// HashRouter: עובד בכל אירוח סטטי בלי הגדרות הפניה (GitHub Pages / Netlify)
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/data" element={<CompanyData />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}
