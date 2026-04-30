import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import html2canvas from "html2canvas";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const STRIPE_LINK = "https://buy.stripe.com/fZu28sgwWcqoa84cZcfnO00";
const FREE_LIMIT = 3;

const CATEGORIES = {
  "🌑 Dark & Moody": ["Soviet brutalism", "noir detective rainy street", "Gothic Victorian funeral parlor", "Nordic black metal forest", "abandoned Japanese pachinko parlor", "Chernobyl exclusion zone spring", "Cold War nuclear bunker", "Transylvanian castle thunderstorm", "Siberian gulag winter", "Detroit abandoned factory"],
  "🕰️ Vintage": ["1920s speakeasy jazz club", "1970s Italian cinema", "1940s Hollywood film noir", "1930s Shanghai nightclub", "1950s American diner", "1960s Mod London boutique", "1920s Harlem Renaissance", "Weimar Republic cabaret", "1970s Blaxploitation cinema", "1950s French Riviera glamour"],
  "🌿 Nature": ["deep sea bioluminescence", "Himalayan monastery snowstorm", "Mongolian steppe at dusk", "Amazonian shaman ritual", "Pacific island volcanic eruption", "Icelandic black sand beach storm", "Norwegian fjord winter storm", "Patagonian wilderness fog", "Andean condor peak at dawn", "Finnish sauna winter night"],
  "🏙️ Urban": ["rainy Tokyo night", "cyberpunk Bangkok", "Tokyo convenience store at 3am", "cyberpunk favela rooftop", "brutalist Eastern European apartment block", "1980s Miami Vice sunset", "1980s Tokyo bubble economy", "1970s Hong Kong action cinema", "neon noir detective agency", "brutalist parking garage midnight"],
  "🚀 Futuristic": ["Martian dust storm settlement", "underwater gothic cathedral", "post-apocalyptic greenhouse", "Soviet cosmonaut training facility", "1960s NASA mission control", "underwater abandoned city", "deep sea pressure laboratory", "Arctic research station isolation", "1960s Cape Canaveral rocket launch", "Martian colony greenhouse"],
  "🔮 Spiritual": ["Amazonian shaman ritual", "Sufi whirling dervish ceremony", "Tibetan sky burial plateau", "New Orleans voodoo jazz funeral", "ancient Egyptian tomb at midnight", "Indonesian shadow puppet theater", "Byzantine mosaic church", "Japanese wabi-sabi tea ceremony", "ancient Mayan observatory", "Siberian shaman ritual"]
};

const AESTHETICS = Object.values(CATEGORIES).flat();

const EXAMPLE_BOARDS = [
  {
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
    fonts: [
      { name: "Noto Sans JP", role: "Display", description: "Clean Japanese-inspired typography for urban signage" },
      { name: "Space Mono", role: "Body", description: "Monospaced digital type evoking flickering screens" }
    ],
    textures: ["rain-slicked asphalt", "neon tube glass", "concrete pillar grime", "foggy glass condensation"],
    keywords: ["noir", "electric", "humid", "lonely", "cinematic", "urban", "midnight", "neon"],
    sceneDescription: "A narrow alley in Shinjuku at 2am. Rain hammers corrugated metal roofs. Vending machines cast pink and cyan pools on flooded pavement. A salaryman stands motionless under a broken umbrella, cigarette ember the only warmth in the frame."
  },
  {
    title: "Soviet Brutalism",
    tagline: "Concrete. Cold. Built to last forever.",
    palette: [
      { hex: "#2a2a2a", name: "Soot Gray" },
      { hex: "#8b7355", name: "Rust Ochre" },
      { hex: "#f5f0e8", name: "Bone White" },
      { hex: "#1c1c1c", name: "Shadow Black" },
      { hex: "#6b6b6b", name: "Weathered Steel" },
      { hex: "#c4a882", name: "Aged Concrete" }
    ],
    fonts: [
      { name: "Oswald", role: "Display", description: "Condensed authority — built for propaganda posters" },
      { name: "IBM Plex Mono", role: "Body", description: "Cold mechanical precision of state-issued documents" }
    ],
    textures: ["poured concrete panels", "rusted rebar exposed", "crumbling plaster", "stamped metal ventilation grates"],
    keywords: ["imposing", "raw", "monolithic", "austere", "cold", "permanent", "mass", "state"],
    sceneDescription: "A housing block in Minsk, 1978. Sixteen floors of identical windows stare down at an empty courtyard. Wind moves through gaps in the structure with a low moan. Nothing here was built for beauty — only duration."
  },
  {
    title: "Deep Sea Bioluminescence",
    tagline: "Light born in total darkness",
    palette: [
      { hex: "#020b18", name: "Abyss Black" },
      { hex: "#003366", name: "Midnight Ocean" },
      { hex: "#00ffcc", name: "Bioluminescent Teal" },
      { hex: "#7b2fff", name: "Deep Violet" },
      { hex: "#00a8cc", name: "Cold Blue" },
      { hex: "#0d1f3c", name: "Bathyal Dark" }
    ],
    fonts: [
      { name: "Cormorant Garamond", role: "Display", description: "Elegant and otherworldly — like creatures that have never seen sunlight" },
      { name: "Raleway Light", role: "Body", description: "Thin and ethereal, barely there like light at 3000 meters depth" }
    ],
    textures: ["jellyfish membrane translucency", "deep sea pressure distortion", "bioluminescent particle drift", "black smoker mineral crust"],
    keywords: ["ethereal", "alien", "glowing", "silent", "pressure", "ancient", "invisible", "cold"],
    sceneDescription: "Three thousand meters below the surface. No light has ever reached here from above. A lanternfish drifts past — its photophores firing in a rhythm no human has decoded. The darkness here is not absence. It is presence."
  }
];

const isMobile = () => window.innerWidth < 768;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { background: #0a0a12; margin: 0; font-family: 'Inter', system-ui, sans-serif; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes moonFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .fade-in { animation: fadeInUp 0.5s ease forwards; }
  .card { background: rgba(20,20,30,0.7); backdrop-filter: blur(12px); border: 0.5px solid rgba(139,92,246,0.15); border-radius: 16px; transition: border-color 0.2s ease; }
  .card:hover { border-color: rgba(139,92,246,0.3); }
  .btn-primary { background: linear-gradient(135deg, #8b5cf6, #6d28d9); border: none; border-radius: 10px; color: #fff; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', system-ui, sans-serif; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(139,92,246,0.4); }
  .btn-secondary { background: rgba(30,28,34,0.8); border: 0.5px solid rgba(139,92,246,0.2); border-radius: 10px; color: #c4c0cc; cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', system-ui, sans-serif; }
  .btn-secondary:hover { border-color: rgba(139,92,246,0.5); background: rgba(40,38,50,0.8); }
  .swatch { transition: all 0.15s ease; }
  .swatch:hover { transform: scaleY(1.05); border-radius: 10px; }
  .keyword { background: rgba(139,92,246,0.08); border: 0.5px solid rgba(139,92,246,0.2); border-radius: 20px; color: #c4c0cc; transition: all 0.15s ease; }
  .keyword:hover { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4); }
  .category-btn { background: transparent; border: 0.5px solid rgba(255,255,255,0.08); border-radius: 20px; color: #6b6870; cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', system-ui, sans-serif; white-space: nowrap; }
  .category-btn:hover { border-color: rgba(139,92,246,0.4); color: #c4c0cc; background: rgba(139,92,246,0.08); }
  .category-btn.active { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.5); color: #e8e4dc; }
  .trending-tag { background: rgba(139,92,246,0.06); border: 0.5px solid rgba(139,92,246,0.15); border-radius: 20px; color: #9d9aa6; cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', system-ui, sans-serif; white-space: nowrap; }
  .trending-tag:hover { background: rgba(139,92,246,0.12); color: #c4c0cc; }
  input:focus { border-color: rgba(139,92,246,0.5) !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
  .loading-moon { animation: moonFloat 2s ease-in-out infinite; font-size: 32px; display: block; text-align: center; margin-bottom: 12px; }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
`;

function ExampleBoard({ board, mobile }) {
  return (
    <div className="card fade-in" style={{ padding: mobile ? "1.25rem" : "1.5rem", marginBottom: 16 }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: mobile ? 18 : 22, fontWeight: 600, color: "#e8e4dc", letterSpacing: "-0.3px" }}>{board.title}</h3>
        <p style={{ margin: "4px 0 0", fontSize: mobile ? 13 : 14, color: "#9d9aa6", fontStyle: "italic" }}>{board.tagline}</p>
      </div>
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Palette</p>
        <div style={{ display: "flex", gap: 6 }}>
          {board.palette.map((c, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div className="swatch" style={{ height: mobile ? 48 : 60, borderRadius: 8, background: c.hex }} />
              {!mobile && <p style={{ margin: "4px 0 0", fontSize: 9, color: "#4a4850", textAlign: "center", fontFamily: "monospace" }}>{c.hex}</p>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Keywords</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {board.keywords.map((k, i) => (
            <span key={i} className="keyword" style={{ padding: "4px 10px", fontSize: mobile ? 11 : 12 }}>{k}</span>
          ))}
        </div>
      </div>
      <div style={{ background: "rgba(139,92,246,0.05)", border: "0.5px solid rgba(139,92,246,0.1)", borderRadius: 10, padding: "12px 14px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Scene</p>
        <p style={{ margin: 0, fontSize: mobile ? 12 : 13, color: "#c4c0cc", lineHeight: 1.7, fontStyle: "italic" }}>{board.sceneDescription}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState("create");
  const [usage, setUsage] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mobile, setMobile] = useState(isMobile());
  const [copied, setCopied] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserData(session.user);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserData(session.user);
      if (!session?.user) setSaved([]);
    });
    loadTrending();
  }, []);

  async function loadTrending() {
    const { data } = await supabase
      .from("trending")
      .select("aesthetic, count")
      .order("count", { ascending: false })
      .limit(6);
    if (data) setTrending(data);
  }

  async function trackTrending(aesthetic) {
    const { data } = await supabase
      .from("trending")
      .select("*")
      .eq("aesthetic", aesthetic)
      .single();
    if (data) {
      await supabase.from("trending").update({ count: data.count + 1 }).eq("aesthetic", aesthetic);
    } else {
      await supabase.from("trending").insert({ aesthetic, count: 1 });
    }
    loadTrending();
  }

  async function loadUserData(u) {
    const { data } = await supabase.from("users").select("*").eq("email", u.email).single();
    if (!data) {
      await supabase.from("users").insert({
        email: u.email, is_pro: false, generations_today: 0,
        last_generation_date: new Date().toDateString()
      });
      setUsage(0); setIsPro(false);
      const sentKey = `welcome_sent_${u.email}`;
      if (!localStorage.getItem(sentKey)) {
        localStorage.setItem(sentKey, "true");
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: u.email, type: "welcome" })
        });
      }
    } else {
      const today = new Date().toDateString();
      const count = data.last_generation_date === today ? data.generations_today : 0;
      setUsage(count); setIsPro(data.is_pro);
    }
    const { data: boards } = await supabase
      .from("boards").select("*").eq("email", u.email)
      .order("created_at", { ascending: false });
    if (boards) setSaved(boards.map(b => JSON.parse(b.board_data)));
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null); setIsPro(false); setUsage(0); setSaved([]);
  }

  const remaining = isPro ? 999 : FREE_LIMIT - usage;

  async function generate(prompt) {
    if (!user) { signInWithGoogle(); return; }
    if (remaining <= 0) { setShowUpgradeModal(true); return; }
    setLoading(true); setResult(null);
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
      const newCount = usage + 1;
      setUsage(newCount);
      await supabase.from("users").update({
        generations_today: newCount,
        last_generation_date: new Date().toDateString()
      }).eq("email", user.email);
      trackTrending(prompt);
    } catch (e) {
      console.error(e); setResult({ error: true });
    }
    setLoading(false);
  }

  function surpriseMe() {
    const list = activeCategory ? CATEGORIES[activeCategory] : AESTHETICS;
    const a = list[Math.floor(Math.random() * list.length)];
    setInput(a); generate(a);
  }

  function pickCategory(cat) {
    if (activeCategory === cat) {
      setActiveCategory(null);
    } else {
      setActiveCategory(cat);
      const list = CATEGORIES[cat];
      const a = list[Math.floor(Math.random() * list.length)];
      setInput(a);
    }
  }

  async function handleSave() {
    if (!result || result.error) return;
    if (!user) return;
    if (!isPro && saved.length >= 5) { setShowUpgradeModal(true); return; }
    const entry = { ...result, prompt: input, id: Date.now() };
    setSaved(prev => [entry, ...prev].slice(0, 100));
    const { error } = await supabase.from("boards").insert({ email: user.email, board_data: JSON.stringify(entry) });
    if (error) console.error("supabase board save error:", error);
  }

  async function handleDelete(s) {
    setSaved(prev => prev.filter(x => x.id !== s.id));
    await supabase.from("boards").delete().eq("email", user.email).eq("board_data", JSON.stringify(s));
  }

  function copyToClipboard(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(null), 1500);
  }

  async function shareBoard() {
    const el = document.getElementById("mood-board-result");
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: "#0a0a12", scale: 2 });
    const ctx = canvas.getContext("2d");
    if (!isPro) {
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "24px system-ui";
      ctx.textAlign = "right";
      ctx.fillText("moodboardai.space", canvas.width - 20, canvas.height - 20);
    }
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.title || "moodboard"}.png`;
      a.click();
    });
  }

  const headerBtns = (size) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {user && !isPro && <div style={{ fontSize: size, color: remaining > 0 ? "#6b6870" : "#f87171" }}>{remaining > 0 ? `${remaining} free left${!mobile ? " today" : ""}` : "No free left"}</div>}
      {user && isPro && <div style={{ fontSize: size, color: "#8b5cf6", fontWeight: 500 }}>✦ Pro</div>}
      {!isPro && <button className="btn-primary" onClick={() => window.open(STRIPE_LINK, "_blank")} style={{ fontSize: size, padding: mobile ? "6px 12px" : "7px 14px" }}>Go Pro $7/mo</button>}
      {["create", "saved"].map(t => (
        <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "rgba(139,92,246,0.15)" : "transparent", border: `0.5px solid ${tab === t ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, color: tab === t ? "#e8e4dc" : "#6b6870", borderRadius: 8, padding: mobile ? "5px 12px" : "6px 14px", fontSize: size, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{t}</button>
      ))}
      {user ? (
        <button onClick={signOut} style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#6b6870", fontSize: size, padding: mobile ? "5px 12px" : "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
      ) : (
        <button className="btn-secondary" onClick={signInWithGoogle} style={{ fontSize: size, padding: mobile ? "5px 12px" : "6px 14px" }}>{mobile ? "Sign in" : "Sign in with Google"}</button>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a12", color: "#e8e4dc", fontFamily: "'Inter', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{styles}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(109,40,217,0.06) 0%, transparent 50%)" }} />

      {showUpgradeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem", backdropFilter: "blur(8px)" }}>
          <div className="card fade-in" style={{ padding: "2.5rem", maxWidth: 420, width: "100%", textAlign: "center" }}>
            <span className="loading-moon">🌙</span>
            <h2 style={{ margin: "0 0 8px", fontSize: mobile ? 18 : 22, color: "#e8e4dc", fontWeight: 600 }}>You've reached your free limit</h2>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#9d9aa6", lineHeight: 1.6 }}>Upgrade to Pro for unlimited mood boards, unlimited saves, and full access — just $7/month.</p>
            <button className="btn-primary" onClick={() => window.open(STRIPE_LINK, "_blank")} style={{ fontSize: 16, padding: "14px 32px", width: "100%", marginBottom: 12 }}>Upgrade to Pro — $7/mo</button>
            <button onClick={() => setShowUpgradeModal(false)} style={{ background: "transparent", border: "none", color: "#6b6870", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Maybe later</button>
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, borderBottom: "0.5px solid rgba(255,255,255,0.06)", padding: mobile ? "1rem" : "1.25rem 2rem", backdropFilter: "blur(20px)", background: "rgba(10,10,18,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: mobile ? 10 : 0 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: mobile ? 18 : 22, fontWeight: 600, color: "#e8e4dc", letterSpacing: "-0.5px" }}>Mood Board <span style={{ color: "#8b5cf6" }}>AI</span></h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b6870" }}>turn a feeling into a visual world</p>
          </div>
          {!mobile && headerBtns(13)}
        </div>
        {mobile && headerBtns(12)}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: mobile ? "1rem" : "2rem" }}>
        {tab === "create" ? (
          <>
            {user && !isPro && remaining <= 0 && (
              <div className="fade-in" style={{ background: "rgba(139,92,246,0.08)", border: "0.5px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, color: "#e8e4dc", fontSize: 14 }}>You've used all 3 free generations today</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9d9aa6" }}>Upgrade for unlimited — $7/month</p>
                </div>
                <button className="btn-primary" onClick={() => setShowUpgradeModal(true)} style={{ fontSize: 13, padding: "9px 16px" }}>Upgrade Now</button>
              </div>
            )}

            {!user && (
              <div className="card fade-in" style={{ padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, color: "#e8e4dc", fontSize: 14 }}>Sign in to start creating</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9d9aa6" }}>Get 3 free mood boards per day</p>
                </div>
                <button className="btn-secondary" onClick={signInWithGoogle} style={{ fontSize: 13, padding: "9px 16px" }}>Sign in with Google</button>
              </div>
            )}

            {/* Categories */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.keys(CATEGORIES).map(cat => (
                  <button key={cat} className={`category-btn${activeCategory === cat ? " active" : ""}`} onClick={() => pickCategory(cat)} style={{ fontSize: mobile ? 11 : 12, padding: mobile ? "5px 10px" : "6px 13px" }}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Trending */}
            {trending.length > 0 && (
              <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#6b6870", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap" }}>🔥 Trending</span>
                {trending.map((t, i) => (
                  <button key={i} className="trending-tag" onClick={() => { setInput(t.aesthetic); generate(t.aesthetic); }} style={{ fontSize: 11, padding: "4px 10px" }}>{t.aesthetic}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input.trim() && generate(input.trim())} placeholder={activeCategory ? `Random from ${activeCategory}...` : "rainy Tokyo night, haunted library..."} style={{ flex: 1, background: "rgba(20,20,30,0.8)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#e8e4dc", fontSize: mobile ? 16 : 15, padding: mobile ? "14px 16px" : "13px 16px", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s" }} />
              <button className="btn-secondary" onClick={surpriseMe} disabled={loading} title={activeCategory ? `Random ${activeCategory}` : "Surprise me!"} style={{ fontSize: 18, padding: "0 14px", minWidth: 48, opacity: loading ? 0.5 : 1 }}>🎲</button>
              <button className="btn-primary" onClick={() => input.trim() && generate(input.trim())} disabled={loading} style={{ fontSize: mobile ? 13 : 14, padding: "0 18px", minWidth: mobile ? 80 : 100, opacity: loading ? 0.5 : 1 }}>
                {loading ? "..." : !user ? "Sign in" : remaining > 0 ? "Generate" : "Upgrade"}
              </button>
            </div>

            {loading && (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <span className="loading-moon">🌙</span>
                <p className="pulse" style={{ color: "#6b6870", fontSize: 13, margin: 0 }}>curating your world...</p>
              </div>
            )}

            {result?.error && (
              <div className="fade-in" style={{ background: "rgba(248,71,71,0.08)", border: "0.5px solid rgba(248,71,71,0.3)", borderRadius: 12, padding: "1.5rem", color: "#f87171", fontSize: 14 }}>Something went wrong. Try again.</div>
            )}

            {result && !result.error && (
              <div id="mood-board-result" className="fade-in">
                <div style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ margin: 0, fontSize: mobile ? 24 : 30, fontWeight: 600, color: "#e8e4dc", letterSpacing: "-0.5px" }}>{result.title}</h2>
                  <p style={{ margin: "8px 0 0", fontSize: mobile ? 13 : 15, color: "#9d9aa6", fontStyle: "italic" }}>{result.tagline}</p>
                </div>

                <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Palette</p>
                  <div style={{ display: "flex", gap: mobile ? 4 : 8 }}>
                    {result.palette?.map((c, i) => (
                      <div key={i} style={{ flex: 1 }} onClick={() => copyToClipboard(c.hex, i)}>
                        <div className="swatch" style={{ height: mobile ? 60 : 80, borderRadius: 10, background: c.hex, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {copied === i && <span style={{ fontSize: 16, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>✓</span>}
                        </div>
                        {!mobile && <p style={{ margin: "6px 0 0", fontSize: 10, color: "#6b6870", textAlign: "center" }}>{c.name}</p>}
                        <p style={{ margin: "3px 0 0", fontSize: 9, color: "#4a4850", textAlign: "center", fontFamily: "monospace", cursor: "pointer" }}>{c.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Keywords</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {result.keywords?.map((k, i) => (
                      <span key={i} className="keyword" style={{ padding: mobile ? "4px 10px" : "5px 13px", fontSize: mobile ? 12 : 13 }}>{k}</span>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Typography</p>
                  <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                    {result.fonts?.map((f, i) => (
                      <div key={i} style={{ background: "rgba(139,92,246,0.05)", border: "0.5px solid rgba(139,92,246,0.1)", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e4dc" }}>{f.name}</span>
                          <span style={{ fontSize: 9, background: "rgba(139,92,246,0.15)", borderRadius: 4, padding: "2px 6px", color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.role}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12, color: "#6b6870", lineHeight: 1.5 }}>{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Textures & Materials</p>
                  <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8 }}>
                    {result.textures?.map((t, i) => (
                      <div key={i} style={{ background: "rgba(139,92,246,0.04)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#9d9aa6", lineHeight: 1.4 }}>{t}</div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.15)" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500 }}>Scene</p>
                  <p style={{ margin: 0, fontSize: mobile ? 13 : 14, color: "#c4c0cc", lineHeight: 1.8, fontStyle: "italic" }}>{result.sceneDescription}</p>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: mobile ? "wrap" : "nowrap" }}>
                  <button className="btn-secondary" onClick={() => generate(input.trim())} style={{ fontSize: 13, padding: "10px 18px", flex: mobile ? "1 1 auto" : "none" }}>Regenerate</button>
                  <button className="btn-secondary" onClick={handleSave} style={{ fontSize: 13, padding: "10px 18px", flex: mobile ? "1 1 auto" : "none" }}>Save</button>
                  <button className="btn-secondary" onClick={shareBoard} style={{ fontSize: 13, padding: "10px 18px", flex: mobile ? "1 1 auto" : "none" }}>{isPro ? "Export PNG" : "Share 📸"}</button>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontSize: 10, letterSpacing: "0.15em", color: "#6b6870", textTransform: "uppercase", fontWeight: 500, marginBottom: 16 }}>✨ Example boards</p>
                {EXAMPLE_BOARDS.map((board, i) => (
                  <ExampleBoard key={i} board={board} mobile={mobile} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {saved.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#6b6870", fontSize: 14 }}>No saved boards yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {saved.map(s => (
                  <div key={s.id} className="card" onClick={() => { setResult(s); setInput(s.prompt); setTab("create"); }} style={{ padding: mobile ? "1rem" : "1.25rem 1.5rem", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: mobile ? 14 : 16, color: "#e8e4dc" }}>{s.title}</p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b6870" }}>{s.prompt}</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleDelete(s); }} style={{ background: "transparent", border: "none", color: "#4a4850", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {s.palette?.map((c, i) => (
                        <div key={i} style={{ width: mobile ? 24 : 28, height: mobile ? 24 : 28, borderRadius: 6, background: c.hex }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}