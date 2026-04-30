import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Landing from "./Landing.jsx";

function Root() {
  const [showApp, setShowApp] = useState(false);
  return showApp ? <App /> : <Landing onEnter={() => setShowApp(true)} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);