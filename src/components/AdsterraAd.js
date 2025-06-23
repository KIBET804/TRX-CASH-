import React, { useEffect } from "react";

const AdsterraAd = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key': 'ee31612493b8236b5da0c1aa1034729c',
        'format': 'iframe',
        'height': 300,
        'width': 160,
        'params': {}
      };
    `;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//www.highperformanceformat.com/ee31612493b8236b5da0c1aa1034729c/invoke.js";
    document.body.appendChild(script2);
  }, []);

  return (
    <div style={{ width: "160px", height: "300px", margin: "10px auto" }}>
      <p>🔸 Sponsored Ad</p>
    </div>
  );
};

export default AdsterraAd;
