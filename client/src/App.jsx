
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TripResult from "./pages/TripResult";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip-result" element={<TripResult />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
