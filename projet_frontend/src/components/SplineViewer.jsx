// src/components/SplineViewer.jsx
import { useEffect } from "react";

function SplineViewer() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
    document.body.appendChild(script);
  }, []);

  return (
    <spline-viewer
      url="https://prod.spline.design/FVZWbQH2B6ndj9UU/scene.splinecode"
      events-target="global"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}

export default SplineViewer;

