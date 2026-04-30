import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import html2canvas from "html2canvas";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const STRIPE_LINK = "https://buy.stripe.com/fZu28sgwWcqoa84cZcfnO00";
const FREE_LIMIT = 3;
const AESTHETICS = [
  "rainy Tokyo night", "haunted Victorian library", "Soviet brutalism",
  "deep sea bioluminescence", "1970s Italian cinema", "cottagecore witch",
  "cyberpunk Bangkok", "North Korean propaganda poster", "Victorian plague doctor",
  "abandoned Japanese pachinko parlor", "Saharan desert rave at sunrise",
  "Cold War Berlin spy thriller", "underwater gothic cathedral",
  "1920s speakeasy jazz club", "Martian dust storm settlement",
  "medieval alchemist workshop", "neon noir detective agency",
  "Scandinavian dark forest folklore", "90s grunge Seattle basement",
  "ancient Egyptian tomb at midnight", "French New Wave cinema",
  "Siberian gulag winter", "tropical brutalism", "art deco ocean liner",
  "1960s NASA mission control", "baroque cathedral in ruins",
  "Tokyo convenience store at 3am", "Venetian carnival masquerade",
  "post-apocalyptic greenhouse", "Soviet cosmonaut training facility",
  "1970s Munich psychedelia", "Mongolian steppe at dusk",
  "underwater abandoned city", "WWI trench poetry", "Himalayan monastery snowstorm",
  "1980s Miami Vice sunset", "Chernobyl exclusion zone spring",
  "ancient Roman bathhouse", "noir detective rainy street",
  "Nordic black metal forest", "1950s American diner", "Persian garden at night",
  "brutalist Eastern European apartment block", "Amazonian shaman ritual",
  "1930s Shanghai nightclub", "Arctic research station isolation",
  "Indonesian shadow puppet theater", "Belle Époque Paris greenhouse",
  "Cold War nuclear bunker", "Kyoto temple in autumn fog",
  "1970s Berlin underground club", "Georgian manor house decay",
  "Pacific island volcanic eruption", "Moroccan souk at midnight",
  "1960s Mod London boutique", "Transylvanian castle thunderstorm",
  "Japanese wabi-sabi tea ceremony", "Soviet constructivism poster",
  "New Orleans voodoo jazz funeral", "Tibetan sky burial plateau",
  "1940s Hollywood film noir", "Icelandic black sand beach storm",
  "Ottoman palace harem", "1990s rave warehouse", "Cambodian jungle temple",
  "Weimar Republic cabaret", "Chilean Atacama desert observatory",
  "1920s Harlem Renaissance", "Finnish sauna winter night",
  "Byzantine mosaic church", "cyberpunk favela rooftop",
  "1970s Blaxploitation cinema", "Andean condor peak at dawn",
  "medieval plague village", "1960s psychedelic poster art",
  "Russian Orthodox monastery winter", "Deep South Gothic mansion",
  "1980s Tokyo bubble economy", "Patagonian wilderness fog",
  "ancient Greek symposium night", "Detroit abandoned factory",
  "1950s Atomic Age suburban home", "Sufi whirling dervish ceremony",
  "1970s Hong Kong action cinema", "Norwegian fjord winter storm",
  "ancient Mayan observatory", "1920s Expressionist cinema",
  "Siberian shaman ritual", "1960s Cape Canaveral rocket launch",
  "Gothic Victorian funeral parlor", "1980s Spielberg suburban adventure",
  "Berber desert nomad camp", "1970s Jamaican reggae studio",
  "ancient Persian court", "brutalist parking garage midnight",
  "1950s French Riviera glamour", "Mongolian throat singing ceremony",
  "1930s Depression era dust bowl", "Japanese cherry blossom cemetery"
];

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
      { name: "Oswald", role: "Display", description: "Condensed authority — built for propaganda posters and monumental signage" },
      { name: "IBM Plex Mono", role: "Body", description: "Cold mechanical precision of state-issued documents" }
    ],
    textures: ["poured concrete panels", "rusted rebar exposed", "crumbling plaster", "stamped metal ventilation grates"],
    keywords: ["imposing", "raw", "monolithic", "austere", "cold", "permanent", "mass", "state"],
    sceneDescription: "A housing block in Minsk, 1978. Sixteen floors of identical windows stare down at an empty courtyard. Wind moves through gaps in the structure with a low moan. Snow has settled in the corners of every concrete ledge. Nothing here was built for beauty — only duration."
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
    sceneDescription: "Three thousand meters below the surface. No light has ever reached here from above. A lanternfish drifts past — its photophores firing in a rhythm no human has decoded. Around it, invisible currents carry microscopic creatures that have evolved in complete isolation for forty million years. The darkness here is not absence. It is presence."
  }
];

function ExampleBoard({ board }) {
  return (
    <div style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 14, padding: "1.5rem", marginBottom: 16 }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "#e8e4dc" }}>{board.title}</h3>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#9d9aa6", fontStyle: "italic" }}>{board.tagline}</p>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Palette</p>
        <div style={{ display: "flex", gap: 6 }}>
          {board.palette.map((c, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ height: 56, borderRadius: 6, background: c.hex }} />
              <p style={{ margin: "4px 0 0", fontSize: 9, color: "#4a4850", textAlign: "center", fontFamily: "monospace" }}>{c.hex}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Keywords</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {board.keywords.map((k, i) => (
            <span key={i} style={{ background: "#1e1c22", border: "0.5px solid #2a2a2e", borderRadius: 20, padding: "4px 10px", fontSize: 12, color: "#c4c0cc" }}>{k}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Typography</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {board.fonts.map((f, i) => (
            <div key={i} style={{ background: "#1e1c22", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#e8e4dc" }}>{f.name}</span>
                <span style={{ fontSize: 9, background: "#2a2a2e", borderRadius: 4, padding: "2px 5px", color: "#8b7fa0", textTransform: "uppercase" }}>{f.role}</span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#6b6870", lineHeight: 1.4 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#1e1c22", borderRadius: 10, padding: "12px 14px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Scene</p>
        <p style={{ margin: 0, fontSize: 13, color: "#c4c0cc", lineHeight: 1.7, fontStyle: "italic" }}>{board.sceneDescription}</p>
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
  }, []);

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
      .from("boards")
      .select("*")
      .eq("email", u.email)
      .order("created_at", { ascending: false });
    if (boards) setSaved(boards.map(b => JSON.parse(b.board_data)));
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
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
    } catch (e) {
      console.error(e); setResult({ error: true });
    }
    setLoading(false);
  }

  function surpriseMe() {
    const a = AESTHETICS[Math.floor(Math.random() * AESTHETICS.length)];
    setInput(a);
    generate(a);
  }

  async function handleSave() {
    if (!result || result.error) return;
    if (!user) return;
    if (!isPro && saved.length >= 5) { setShowUpgradeModal(true); return; }
    const entry = { ...result, prompt: input, id: Date.now() };
    setSaved(prev => [entry, ...prev].slice(0, 100));
    const { error } = await supabase.from("boards").insert({
      email: user.email,
      board_data: JSON.stringify(entry)
    });
    if (error) console.error("supabase board save error:", error);
  }

  async function handleDelete(s) {
    setSaved(prev => prev.filter(x => x.id !== s.id));
    await supabase.from("boards").delete().eq("email", user.email).eq("board_data", JSON.stringify(s));
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  async function shareBoard() {
    const el = document.getElementById("mood-board-result");
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: "#0d0d0f", scale: 2 });
    const ctx = canvas.getContext("2d");
    if (!isPro) {
      ctx.fillStyle = "rgba(255,255,255,0.3)";
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

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0f", color: "#e8e4dc", fontFamily: "system-ui, sans-serif" }}>

      {showUpgradeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#141418", border: "0.5px solid #3a3740", borderRadius: 16, padding: "2.5rem", maxWidth: 420, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌙</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#e8e4dc", fontWeight: 500 }}>You've reached your free limit</h2>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#9d9aa6", lineHeight: 1.6 }}>Upgrade to Pro for unlimited mood boards, unlimited saves, and full access — just $7/month.</p>
            <button onClick={() => window.open(STRIPE_LINK, "_blank")} style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 500, fontSize: 16, padding: "14px 32px", cursor: "pointer", width: "100%", marginBottom: 12 }}>Upgrade to Pro — $7/mo</button>
            <button onClick={() => setShowUpgradeModal(false)} style={{ background: "transparent", border: "none", color: "#6b6870", fontSize: 13, cursor: "pointer" }}>Maybe later</button>
          </div>
        </div>
      )}

      <div style={{ borderBottom: "0.5px solid #2a2a2e", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "#e8e4dc" }}>Mood Board</h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b6870" }}>turn a feeling into a visual world</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user && !isPro && <div style={{ fontSize: 13, color: remaining > 0 ? "#6b6870" : "#f87171" }}>{remaining > 0 ? `${remaining} free left today` : "No free generations left"}</div>}
          {user && isPro && <div style={{ fontSize: 13, color: "#8b5cf6" }}>✦ Pro</div>}
          {!isPro && <button onClick={() => window.open(STRIPE_LINK, "_blank")} style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 500, fontSize: 13, padding: "7px 14px", cursor: "pointer" }}>Go Pro $7/mo</button>}
          {["create", "saved"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1e1c22" : "transparent", border: `0.5px solid ${tab === t ? "#3a3740" : "#2a2a2e"}`, color: tab === t ? "#e8e4dc" : "#6b6870", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>{t}</button>
          ))}
          {user ? (
            <button onClick={signOut} style={{ background: "transparent", border: "0.5px solid #2a2a2e", borderRadius: 8, color: "#6b6870", fontSize: 13, padding: "6px 14px", cursor: "pointer" }}>Sign out</button>
          ) : (
            <button onClick={signInWithGoogle} style={{ background: "#1e1c22", border: "0.5px solid #3a3740", borderRadius: 8, color: "#c4c0cc", fontSize: 13, padding: "6px 14px", cursor: "pointer" }}>Sign in with Google</button>
          )}
        </div>
      </div>

      {tab === "create" ? (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
          {user && !isPro && remaining <= 0 && (
            <div style={{ background: "#1a1015", border: "0.5px solid #8b5cf6", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, color: "#e8e4dc", fontSize: 15 }}>You've used all 3 free generations today</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9d9aa6" }}>Upgrade to Pro for unlimited boards — $7/month</p>
              </div>
              <button onClick={() => setShowUpgradeModal(true)} style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 500, fontSize: 14, padding: "10px 20px", cursor: "pointer" }}>Upgrade Now</button>
            </div>
          )}

          {!user && (
            <div style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, color: "#e8e4dc", fontSize: 15 }}>Sign in to start creating</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9d9aa6" }}>Get 3 free mood boards per day</p>
              </div>
              <button onClick={signInWithGoogle} style={{ background: "#1e1c22", border: "0.5px solid #3a3740", borderRadius: 8, color: "#c4c0cc", fontSize: 14, padding: "10px 20px", cursor: "pointer" }}>Sign in with Google</button>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginBottom: "2rem" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input.trim() && generate(input.trim())} placeholder="rainy Tokyo night, haunted library, melancholic autumn..." style={{ flex: 1, background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 10, color: "#e8e4dc", fontSize: 15, padding: "12px 16px", outline: "none" }} />
            <button onClick={surpriseMe} disabled={loading} title="Surprise me!" style={{ background: "#1e1c22", border: "0.5px solid #3a3740", borderRadius: 10, color: "#c4c0cc", fontSize: 18, padding: "0 14px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}>🎲</button>
            <button onClick={() => input.trim() && generate(input.trim())} disabled={loading} style={{ background: !user ? "#3a3740" : remaining > 0 ? "#8b5cf6" : "#3a3740", border: "none", borderRadius: 10, color: "#fff", fontWeight: 500, fontSize: 14, padding: "0 22px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}>
              {loading ? "..." : !user ? "Sign in" : remaining > 0 ? "Generate" : "Upgrade"}
            </button>
          </div>

          {loading && <div style={{ textAlign: "center", padding: "3rem 0", color: "#6b6870", fontSize: 13 }}>curating your world...</div>}
          {result?.error && <div style={{ background: "#1a1015", border: "0.5px solid #3a2028", borderRadius: 12, padding: "1.5rem", color: "#f87171", fontSize: 14 }}>Something went wrong. Try again.</div>}

          {result && !result.error && (
            <div id="mood-board-result">
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#e8e4dc" }}>{result.title}</h2>
                <p style={{ margin: "6px 0 0", fontSize: 15, color: "#9d9aa6", fontStyle: "italic" }}>{result.tagline}</p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase" }}>Palette</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {result.palette?.map((c, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      <div onClick={() => copyToClipboard(c.hex)} title="Click to copy" style={{ height: 72, borderRadius: 8, background: c.hex, cursor: "pointer" }} />
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#6b6870", textAlign: "center" }}>{c.name}</p>
                      <p onClick={() => copyToClipboard(c.hex)} title="Click to copy" style={{ margin: "1px 0 0", fontSize: 10, color: "#4a4850", textAlign: "center", fontFamily: "monospace", cursor: "pointer" }}>{c.hex} 📋</p>
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
                <button onClick={shareBoard} style={{ background: "#1e1c22", border: "0.5px solid #3a3740", borderRadius: 8, color: "#c4c0cc", fontSize: 13, padding: "9px 18px", cursor: "pointer" }}>{isPro ? "Export PNG" : "Share 📸"}</button>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.12em", color: "#6b6870", textTransform: "uppercase", marginBottom: 16 }}>✨ Example boards</p>
              {EXAMPLE_BOARDS.map((board, i) => (
                <ExampleBoard key={i} board={board} />
              ))}
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
                <div key={s.id} onClick={() => { setResult(s); setInput(s.prompt); setTab("create"); }} style={{ background: "#141418", border: "0.5px solid #2a2a2e", borderRadius: 14, padding: "1.25rem 1.5rem", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: 16, color: "#e8e4dc" }}>{s.title}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b6870" }}>{s.prompt}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); handleDelete(s); }} style={{ background: "transparent", border: "none", color: "#4a4850", fontSize: 16, cursor: "pointer" }}>✕</button>
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