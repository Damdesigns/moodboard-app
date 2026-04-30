import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a12; font-family: 'Inter', system-ui, sans-serif; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes moonFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
  @keyframes gradientText { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .fade-in { animation: fadeInUp 0.8s ease forwards; }
  .fade-in-delay-1 { animation: fadeInUp 0.8s ease 0.2s both; }
  .fade-in-delay-2 { animation: fadeInUp 0.8s ease 0.4s both; }
  .fade-in-delay-3 { animation: fadeInUp 0.8s ease 0.6s both; }
  .gradient-text {
    background: linear-gradient(135deg, #e8e4dc, #8b5cf6, #c4b5fd, #e8e4dc);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientText 4s ease infinite;
  }
  .btn-primary {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    border: none; border-radius: 12px; color: #fff;
    font-weight: 600; cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(139,92,246,0.5); }
  .btn-ghost {
    background: transparent;
    border: 0.5px solid rgba(255,255,255,0.15);
    border-radius: 12px; color: #9d9aa6;
    font-weight: 500; cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .btn-ghost:hover { border-color: rgba(139,92,246,0.5); color: #e8e4dc; }
  .card {
    background: rgba(20,20,30,0.7);
    backdrop-filter: blur(12px);
    border: 0.5px solid rgba(139,92,246,0.15);
    border-radius: 16px;
    transition: all 0.3s ease;
  }
  .card:hover { border-color: rgba(139,92,246,0.35); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(139,92,246,0.1); }
  .feature-icon { font-size: 32px; margin-bottom: 16px; animation: moonFloat 3s ease-in-out infinite; }
  .swatch { transition: transform 0.15s ease; cursor: pointer; }
  .swatch:hover { transform: scaleY(1.08); }
  .pricing-card { background: rgba(20,20,30,0.7); backdrop-filter: blur(12px); border-radius: 20px; padding: 2rem; }
  .pricing-pro { border: 1px solid rgba(139,92,246,0.4); position: relative; }
  .pricing-free { border: 0.5px solid rgba(255,255,255,0.08); }
  .check { color: #8b5cf6; margin-right: 8px; }
  .cross { color: #4a4850; margin-right: 8px; }
`;

const EXAMPLE = {
  title: "Rainy Tokyo Night",
  tagline: "Where neon bleeds into wet asphalt",
  palette: [
    { hex: "#0a0a0f", name: "Void Black" },
    { hex: "#1a1a2e", name: "Midnight Blue" },
    { hex: "#ff2d78", name: "Neon Pink" },
    { hex: "#00d4ff", name: "Electric Cyan" },
    { hex: "#4a4a6a", name: "Concrete Gray" },
    { hex: "#ffd700", name: "Taxi Yellow" }
  ],
  keywords: ["noir", "electric", "humid", "lonely", "cinematic", "urban", "midnight", "neon"],
  fonts: [
    { name: "Noto Sans JP", role: "Display" },
    { name: "Space Mono", role: "Body" }
  ],
  sceneDescription: "A narrow alley in Shinjuku at 2am. Rain hammers corrugated metal roofs. Vending machines cast pink and cyan pools on flooded pavement. A salaryman stands motionless under a broken umbrella, cigarette ember the only warmth in the frame."
};

const ROTATING = [
  "rainy Tokyo night",
  "Soviet brutalism",
  "deep sea bioluminescence",
  "haunted Victorian library",
  "1970s Italian cinema",
  "Chernobyl exclusion zone",
  "underwater gothic cathedral",
  "Nordic black metal forest"
];

export default function Landing({ onEnter }) {
  const [rotatingIdx, setRotatingIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRotatingIdx(i => (i + 1) % ROTATING.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a12", color: "#e8e4dc", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{styles}</style>

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(109,40,217,0.08) 0%, transparent 60%)" }} />

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: mobile ? "1rem" : "1.25rem 3rem", borderBottom: "0.5px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", background: "rgba(10,10,18,0.8)" }}>
        <div>
          <span style={{ fontSize: mobile ? 16 : 18, fontWeight: 700, letterSpacing: "-0.5px" }}>Mood Board <span style={{ color: "#8b5cf6" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-ghost" onClick={onEnter} style={{ fontSize: 13, padding: "8px 16px" }}>Sign in</button>
          <button className="btn-primary" onClick={onEnter} style={{ fontSize: 13, padding: "8px 18px" }}>Try Free →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: mobile ? "4rem 1.5rem 3rem" : "6rem 2rem 4rem", maxWidth: 800, margin: "0 auto" }}>
        <div className="fade-in" style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", border: "0.5px solid rgba(139,92,246,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#a78bfa", marginBottom: 24, letterSpacing: "0.05em" }}>
          🌙 AI-Powered Mood Boards
        </div>

        <h1 className="fade-in-delay-1" style={{ fontSize: mobile ? 36 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 }}>
          Turn any feeling into<br />
          <span className="gradient-text">a visual world</span>
        </h1>

        <div className="fade-in-delay-2" style={{ fontSize: mobile ? 16 : 20, color: "#6b6870", marginBottom: 12, height: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span>Type</span>
          <span style={{ color: "#c4b5fd", fontStyle: "italic", transition: "opacity 0.3s", opacity: visible ? 1 : 0 }}>"{ROTATING[rotatingIdx]}"</span>
          <span>and get a world</span>
        </div>

        <p className="fade-in-delay-2" style={{ fontSize: mobile ? 14 : 16, color: "#6b6870", marginBottom: 36, lineHeight: 1.6 }}>
          Color palettes · Font pairings · Textures · Cinematic scene descriptions<br />
          Generated instantly by AI for designers, creatives and dreamers
        </p>

        <div className="fade-in-delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={onEnter} style={{ fontSize: mobile ? 15 : 17, padding: mobile ? "14px 28px" : "16px 36px" }}>
            Start Creating Free →
          </button>
          <button className="btn-ghost" onClick={onEnter} style={{ fontSize: mobile ? 14 : 16, padding: mobile ? "14px 24px" : "16px 30px" }}>
            See example ↓
          </button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "#4a4850" }}>No credit card required · 3 free boards per day</p>
      </section>

      {/* Example board */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: mobile ? "0 1rem 3rem" : "0 2rem 4rem" }}>
        <div className="card fade-in" style={{ padding: mobile ? "1.5rem" : "2rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ margin: 0, fontSize: mobile ? 22 : 28, fontWeight: 700, letterSpacing: "-0.5px" }}>{EXAMPLE.title}</h3>
            <p style={{ margin: "6px 0 0", fontSize: mobile ? 13 : 15, color: "#9d9aa6", fontStyle: "italic" }}>{EXAMPLE.tagline}</p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ margin: "0 0 10px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Palette</p>
            <div style={{ display: "flex", gap: 8 }}>
              {EXAMPLE.palette.map((c, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div className="swatch" style={{ height: mobile ? 56 : 72, borderRadius: 10, background: c.hex }} />
                  {!mobile && <p style={{ margin: "6px 0 0", fontSize: 10, color: "#6b6870", textAlign: "center" }}>{c.name}</p>}
                  <p style={{ margin: "3px 0 0", fontSize: 9, color: "#4a4850", textAlign: "center", fontFamily: "monospace" }}>{c.hex}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ margin: "0 0 10px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Keywords</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {EXAMPLE.keywords.map((k, i) => (
                <span key={i} style={{ background: "rgba(139,92,246,0.08)", border: "0.5px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: "5px 13px", fontSize: 13, color: "#c4c0cc" }}>{k}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
            {EXAMPLE.fonts.map((f, i) => (
              <div key={i} style={{ background: "rgba(139,92,246,0.05)", border: "0.5px solid rgba(139,92,246,0.1)", borderRadius: 10, padding: "12px 14px" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e4dc", marginRight: 8 }}>{f.name}</span>
                <span style={{ fontSize: 9, background: "rgba(139,92,246,0.15)", borderRadius: 4, padding: "2px 6px", color: "#a78bfa", textTransform: "uppercase" }}>{f.role}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(139,92,246,0.05)", border: "0.5px solid rgba(139,92,246,0.1)", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Scene</p>
            <p style={{ margin: 0, fontSize: mobile ? 12 : 13, color: "#c4c0cc", lineHeight: 1.8, fontStyle: "italic" }}>{EXAMPLE.sceneDescription}</p>
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button className="btn-primary" onClick={onEnter} style={{ fontSize: 15, padding: "13px 32px" }}>Generate yours free →</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: mobile ? "2rem 1rem" : "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: mobile ? 24 : 36, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>Everything you need to <span className="gradient-text">set the mood</span></h2>
        <p style={{ textAlign: "center", color: "#6b6870", fontSize: mobile ? 14 : 16, marginBottom: 40 }}>One input. A complete visual world.</p>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {[
            { icon: "🎨", title: "Color Palettes", desc: "7+ carefully curated hex codes with names and mood-matched combinations. Click to copy instantly." },
            { icon: "✍️", title: "Font Pairings", desc: "Typography suggestions that match the aesthetic — display, body and accent fonts with descriptions." },
            { icon: "🌿", title: "Textures & Materials", desc: "Physical texture descriptions for your designs — from rain-slicked asphalt to aged parchment." },
            { icon: "💬", title: "Keywords", desc: "A set of evocative words that capture the essence of your aesthetic for copy and brainstorming." },
            { icon: "🎬", title: "Cinematic Scene", desc: "A rich scene description that puts you inside the world — perfect for creative writing and briefs." },
            { icon: "🎲", title: "Surprise Me", desc: "Hit the dice button for a random aesthetic from 100+ options across 6 mood categories." }
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div className="feature-icon" style={{ animationDelay: `${i * 0.3}s` }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "#e8e4dc" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#6b6870", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: mobile ? "2rem 1rem" : "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", fontSize: mobile ? 24 : 36, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>Simple pricing</h2>
        <p style={{ textAlign: "center", color: "#6b6870", fontSize: mobile ? 14 : 16, marginBottom: 40 }}>Start free. Upgrade when you're ready.</p>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div className="pricing-card pricing-free">
            <p style={{ fontSize: 13, color: "#6b6870", marginBottom: 4 }}>Free</p>
            <p style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>$0</p>
            <p style={{ fontSize: 13, color: "#6b6870", marginBottom: 24 }}>forever</p>
            {[
              [true, "3 boards per day"],
              [true, "5 saved boards"],
              [true, "All aesthetics & categories"],
              [true, "Share with watermark"],
              [false, "Unlimited boards"],
              [false, "Unlimited saves"],
              [false, "Clean PNG export"],
            ].map(([check, text], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 10, fontSize: 14, color: check ? "#c4c0cc" : "#4a4850" }}>
                <span className={check ? "check" : "cross"}>{check ? "✓" : "✕"}</span>{text}
              </div>
            ))}
            <button className="btn-ghost" onClick={onEnter} style={{ width: "100%", padding: "12px", fontSize: 14, marginTop: 16 }}>Get started free</button>
          </div>

          <div className="pricing-card pricing-pro">
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>MOST POPULAR</div>
            <p style={{ fontSize: 13, color: "#a78bfa", marginBottom: 4 }}>Pro</p>
            <p style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>$7<span style={{ fontSize: 16, fontWeight: 400, color: "#6b6870" }}>/mo</span></p>
            <p style={{ fontSize: 13, color: "#6b6870", marginBottom: 24 }}>billed monthly</p>
            {[
              [true, "Unlimited boards per day"],
              [true, "Unlimited saved boards"],
              [true, "All aesthetics & categories"],
              [true, "Clean PNG export (no watermark)"],
              [true, "Sync across all devices"],
              [true, "Priority support"],
            ].map(([check, text], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 10, fontSize: 14, color: "#c4c0cc" }}>
                <span className="check">✓</span>{text}
              </div>
            ))}
            <button className="btn-primary" onClick={onEnter} style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 16 }}>Upgrade to Pro →</button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: "relative", zIndex: 1, textAlign: "center", padding: mobile ? "3rem 1.5rem 4rem" : "4rem 2rem 6rem" }}>
        <div className="card" style={{ maxWidth: 600, margin: "0 auto", padding: mobile ? "2rem 1.5rem" : "3rem" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16, animation: "moonFloat 2s ease-in-out infinite" }}>🌙</span>
          <h2 style={{ fontSize: mobile ? 24 : 36, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>Ready to find your aesthetic?</h2>
          <p style={{ fontSize: mobile ? 14 : 16, color: "#6b6870", marginBottom: 28, lineHeight: 1.6 }}>Join designers, writers, brand strategists and creatives who use Mood Board AI to turn feelings into visual worlds.</p>
          <button className="btn-primary" onClick={onEnter} style={{ fontSize: mobile ? 16 : 18, padding: mobile ? "15px 32px" : "18px 48px" }}>Start Creating Free →</button>
          <p style={{ marginTop: 12, fontSize: 12, color: "#4a4850" }}>No credit card · 3 free boards daily</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "0.5px solid rgba(255,255,255,0.06)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <span style={{ fontSize: 13, color: "#4a4850" }}>© 2026 Mood Board AI</span>
        <span style={{ fontSize: 13, color: "#4a4850" }}>moodboardai.space</span>
      </footer>
    </div>
  );
}