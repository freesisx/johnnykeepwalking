import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import TenPull from "./pages/TenPull"
import Roles from "./pages/Roles"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/10pull" element={<TenPull />} />
      <Route path="/roles" element={<Roles />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
