import { useState, useEffect } from "react";

const STRIPE_LINK = "https://buy.stripe.com/fZu28sgwWcqoa84cZcfnO00";
const FREE_LIMIT = 3;
const STORAGE_KEY = "moodboard_usage";

function getUsage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const today = new Date().toDateString();
    if (data.date !== today) return 0;
    return data.count || 0;
  } catch { return 0; }
}

function incrementUsage() {
  try {
    const today = new Date().toDateString();
    const count = getUsage() + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }));
  } catch {}
}

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState("create");
  const [usage, setUsage] = useState(getUsage());
  const remaining = FREE_LIMIT - usage;

  async function generate(prompt) {
    if (remaining <= 0) {
      window.open(STRIPE_LINK, "_blank");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are a mood board curator. Given a mood or aesthetic, return ONLY a JSON object with no markdown, no preamble. Schema:
{
  "title": "string",
  "tagline": "string",
  "palette": [{ "hex": "#xxxxxx", "name": "string" }],
  "fonts": [{ "name": "string", "role": "string", "description": "string" }],
  "textures": ["string"],
  "keywords": ["string"],
  "sceneDescription": "string"
}`,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
      incrementUsage();
      setUsage(getUsage());
    } catch (e) {
      console.error(e);
      setResult({ error: true });
    }
    setLoading(false);
  }

  function handleSave() {
    if (!result || result.error) return;
    setSaved(prev => [{ ...result, prompt: input, id: Date.now() }, ...prev].slice(0, 20));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0f", color: "#e8e4dc", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "0.5px solid #2a2a2e", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "#e8e4dc" }}>Mood Board</h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b6870" }}>turn a feeling into a visual world</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13, color: remaining > 0 ? "#6b6870" : "#f87171" }}>
            {remaining > 0 ? `${remaining} free left today` : "No free generations left"}
          </div>
          <button onClick={() => window.open(STRIPE_LINK, "_blank")} style={{
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "none",
            borderRadius: 8, color: "#fff", fontWeight: 500, fontSize: 13,
            padding: "7px 14px", cursor: "pointer"
          }}>Go Pro $7/mo</button>
          {["create", "saved"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "#1e1c22" : "transparent",
              border: `0.5px solid ${tab === t ? "#3a3740" : "#2a2a2e"}`,
              color: tab === t ? "#e8e4dc" : "#6b6870",
              borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer"
            }}>{t}</button>
          ))}
        </div>
      </div>

      {tab === "create" ? (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>

          {/* Paywall banner */}
          {remaining <= 0 && (
            <div style={{ background: "#1a1015", border: "0.5px solid #8b5cf6", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, color: "#e8e4dc", fontSize: 15 }}>You've used all 3 free generations today</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9d9aa6" }}>Upgrade to Pro for unlimited boards — $7/month</p>
              </div>
              <button onClick={() => window.open(STRIPE_LINK, "_blank")} style={{
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "none",
                borderRadius: 8, color: "#fff", fontWeight: 500, fontSize: 14,
                padding: "10px 20px", cursor: "pointer", whiteSpace: "nowrap"
              }}>Upgrade Now</button>
            </div>
          )}

          {/* Input */}
          <div style={{ display: "flex", gap: 10, marginBottom: "2rem" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && input.trim() && generate(input.trim())}
              placeholder="rainy Tokyo night, haunted library, melancholic autumn..."
              style={{
                flex: 1, background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 10,
                color: "#e8e4dc", fontSize: 15, padding: "12px 16px", outline: "none"
              }}
            />
            <button onClick={() => input.trim() && generate(input.trim())} disabled={loading} style={{
              background: remaining > 0 ? "#8b5cf6" : "#3a3740", border: "none", borderRadius: 10, color: "#fff",
              fontWeight: 500, fontSize: 14, padding: "0 22px", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1
            }}>
              {loading ? "..." : remaining > 0 ? "Generate" : "Upgrade"}
            </button>
          </div>

          {loading && <div style={{ textAlign: "center", padding: "3rem 0", color: "#6b6870", fontSize: 13 }}>curating your world...</div>}
          {result?.error && <div style={{ background: "#1a1015", border: "0.5px solid #3a2028", borderRadius: 12, padding: "1.5rem", color: "#f87171", fontSize: 14 }}>Something went wrong. Check your API key and try again.</div>}

          {result && !result.error && (
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#e8e4dc" }}>{result.title}</h2>
                <p style={{ margin: "6px 0 0", fontSize: 15, color: "#9d9aa6", fontStyle: "italic" }}>{result.tagline}</p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Palette</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {result.palette?.map((c, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      <div style={{ height: 72, borderRadius: 8, background: c.hex }} />
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#6b6870", textAlign: "center" }}>{c.name}</p>
                      <p style={{ margin: "1px 0 0", fontSize: 10, color: "#4a4850", textAlign: "center", fontFamily: "monospace" }}>{c.hex}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Keywords</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {result.keywords?.map((k, i) => (
                    <span key={i} style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 20, padding: "5px 12px", fontSize: 13, color: "#c4c0cc" }}>{k}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Typography</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {result.fonts?.map((f, i) => (
                    <div key={i} style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#e8e4dc" }}>{f.name}</span>
                        <span style={{ fontSize: 10, background: "#1e1c22", borderRadius: 4, padding: "2px 6px", color: "#8b7fa0", textTransform: "uppercase" }}>{f.role}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b6870", lineHeight: 1.5 }}>{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Textures & Materials</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {result.textures?.map((t, i) => (
                    <div key={i} style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#9d9aa6" }}>{t}</div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "2rem", background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 12, padding: "1.25rem 1.5rem" }}>
                <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Scene</p>
                <p style={{ margin: 0, fontSize: 14, color: "#c4c0cc", lineHeight: 1.75, fontStyle: "italic" }}>{result.sceneDescription}</p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => generate(input.trim())} style={{ background: "transparent", border: "0.5px solid #2a2a2e", borderRadius: 8, color: "#9d9aa6", fontSize: 13, padding: "9px 18px", cursor: "pointer" }}>Regenerate</button>
                <button onClick={handleSave} style={{ background: "#1e1c22", border: "0.5px solid #3a3740", borderRadius: 8, color: "#c4c0cc", fontSize: 13, padding: "9px 18px", cursor: "pointer" }}>Save to collection</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
          {saved.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "#6b6870", fontSize: 14 }}>No saved boards yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {saved.map(s => (
                <div key={s.id} style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 14, padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: 16, color: "#e8e4dc" }}>{s.title}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b6870" }}>{s.prompt}</p>
                    </div>
                    <button onClick={() => setSaved(prev => prev.filter(x => x.id !== s.id))} style={{ background: "transparent", border: "none", color: "#4a4850", fontSize: 16, cursor: "pointer" }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {s.palette?.map((c, i) => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: c.hex }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}