import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("stability.stable-diffusion-xl-v1");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // Expect base64 PNGs from the server
      setImages((prev) => [...data.images, ...prev]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="badge">AWS Bedrock • Image Gen</div>
        <h1 className="h1">AI Image Generator</h1>
        <p className="sub">Type a prompt and generate images using an AWS Bedrock model.</p>

        <form onSubmit={handleGenerate}>
          <div className="row">
            <input
              className="input"
              placeholder="e.g., a watercolor fox in a misty forest, cinematic lighting"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="btn" disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          <div className="row" style={{gridTemplateColumns:"1fr"}}>
            <label className="small">Model</label>
            <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="stability.stable-diffusion-xl-v1">Stable Diffusion XL (Bedrock)</option>
              <option value="stability.sd3-large-v1:0">SD3 Large (Bedrock)</option>
            </select>
          </div>
        </form>

        {error && <p style={{ color: "#ff7575" }}>{error}</p>}
        <hr />
        <div className="grid">
          {loading && (
            <div className="thumb loading" style={{display:"grid", placeItems:"center"}}>
              <span className="small">Generating…</span>
            </div>
          )}
          {images.map((b64, i) => (
            <img key={i} className="thumb" src={`data:image/png;base64,${b64}`} />
          ))}
        </div>
        <div className="footer">Built with React + Vite • Proxy to AWS Bedrock Runtime</div>
      </div>
    </div>
  );
}
