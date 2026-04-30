import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoStr = threeDaysAgo.toDateString();

  // Get all users
  const { data: users } = await supabase
    .from("users")
    .select("email, generations_today, last_generation_date, is_pro");

  if (!users || users.length === 0) return res.status(200).json({ sent: 0 });

  let sent = 0;

  for (const user of users) {
    // Skip pro users
    if (user.is_pro) continue;

    const lastDate = new Date(user.last_generation_date);
    const daysSinceLastGen = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

    // Never generated a board
    if (user.generations_today === 0 && daysSinceLastGen >= 1) {
      await resend.emails.send({
        from: "Mood Board AI <hello@moodboardai.space>",
        to: user.email,
        subject: "You haven't tried your free boards yet 🌙",
        html: `
          <div style="background:#0d0d0f;color:#e8e4dc;padding:40px;font-family:system-ui;max-width:600px;margin:0 auto;border-radius:12px">
            <h1 style="font-size:24px;font-weight:500;margin:0 0 8px">Your free boards are waiting 🌙</h1>
            <p style="color:#9d9aa6;margin:0 0 24px">You signed up but haven't created anything yet.</p>
            <p style="line-height:1.7;margin:0 0 16px">Type any mood or aesthetic and instantly get a full mood board — color palette, fonts, textures and a cinematic scene description.</p>
            <p style="color:#9d9aa6;margin:0 0 16px">Try something unexpected:</p>
            <ul style="color:#9d9aa6;line-height:2;margin:0 0 24px">
              <li>rainy Tokyo night</li>
              <li>Soviet brutalism</li>
              <li>haunted Victorian library</li>
              <li>deep sea bioluminescence</li>
            </ul>
            <a href="https://moodboardai.space" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:500;display:inline-block;margin-bottom:24px">Create your first board →</a>
            <p style="color:#6b6870;font-size:13px;margin:0">Or hit 🎲 for a random aesthetic instantly.</p>
          </div>
        `
      });
      sent++;
    }

    // Haven't visited in 3+ days
    else if (daysSinceLastGen >= 3) {
      await resend.emails.send({
        from: "Mood Board AI <hello@moodboardai.space>",
        to: user.email,
        subject: "We miss you — new aesthetics to explore 🌙",
        html: `
          <div style="background:#0d0d0f;color:#e8e4dc;padding:40px;font-family:system-ui;max-width:600px;margin:0 auto;border-radius:12px">
            <h1 style="font-size:24px;font-weight:500;margin:0 0 8px">New worlds to explore 🌙</h1>
            <p style="color:#9d9aa6;margin:0 0 24px">It's been a few days — come back and try something new.</p>
            <p style="line-height:1.7;margin:0 0 16px">Here are some aesthetics you haven't tried yet:</p>
            <ul style="color:#9d9aa6;line-height:2;margin:0 0 24px">
              <li>Chernobyl exclusion zone spring</li>
              <li>1920s speakeasy jazz club</li>
              <li>underwater gothic cathedral</li>
              <li>Nordic black metal forest</li>
            </ul>
            <a href="https://moodboardai.space" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:500;display:inline-block;margin-bottom:24px">Explore now →</a>
            <p style="color:#6b6870;font-size:13px;margin:0">You get 3 free boards every day. Hit 🎲 for a surprise!</p>
          </div>
        `
      });
      sent++;
    }
  }

  res.status(200).json({ sent });
}