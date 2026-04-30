import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { email, type } = req.body;
  
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    if (type === "welcome") {
      await resend.emails.send({
        from: "Mood Board AI <hello@moodboardai.space>",
        to: email,
        subject: "Welcome to Mood Board AI 🌙",
        html: `
          <div style="background:#0d0d0f;color:#e8e4dc;padding:40px;font-family:system-ui;max-width:600px;margin:0 auto;border-radius:12px">
            <h1 style="font-size:24px;font-weight:500;margin:0 0 8px">Welcome to Mood Board AI 🌙</h1>
            <p style="color:#9d9aa6;margin:0 0 24px">turn any feeling into a visual world</p>
            <p style="line-height:1.7;margin:0 0 16px">You have <strong>3 free mood boards</strong> waiting for you today. Try something unexpected:</p>
            <ul style="color:#9d9aa6;line-height:2;margin:0 0 24px">
              <li>rainy Tokyo night</li>
              <li>Soviet brutalism</li>
              <li>haunted Victorian library</li>
              <li>deep sea bioluminescence</li>
            </ul>
            <a href="https://moodboardai.space" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:500;display:inline-block;margin-bottom:24px">Start Creating →</a>
            <p style="color:#6b6870;font-size:13px;margin:0">Or hit the 🎲 button to get a random aesthetic instantly.</p>
          </div>
        `
      });
    }

    if (type === "followup") {
      await resend.emails.send({
        from: "Mood Board AI <hello@moodboardai.space>",
        to: email,
        subject: "You still have free boards left 🌙",
        html: `
          <div style="background:#0d0d0f;color:#e8e4dc;padding:40px;font-family:system-ui;max-width:600px;margin:0 auto;border-radius:12px">
            <h1 style="font-size:24px;font-weight:500;margin:0 0 8px">Don't forget your free boards 🌙</h1>
            <p style="color:#9d9aa6;margin:0 0 24px">You signed up yesterday but haven't explored yet.</p>
            <p style="line-height:1.7;margin:0 0 24px">Type any mood or aesthetic and instantly get a full mood board — color palette, fonts, textures and a cinematic scene description.</p>
            <a href="https://moodboardai.space" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:500;display:inline-block;margin-bottom:24px">Try it now →</a>
            <p style="color:#6b6870;font-size:13px;margin:0">Hit 🎲 for a random aesthetic if you're not sure where to start.</p>
          </div>
        `
      });
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}