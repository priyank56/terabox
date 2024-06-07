import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/v/:id" element={<VideoPage />} />
        {/* <Route path="/.well-known/assetlinks.json" element={<Assetlinks />} /> */}
      </Routes>
    </div>
  );
}

export default App;
