import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const { data: users } = await supabase
    .from("users")
    .select("email, generations_today, last_generation_date")
    .eq("last_generation_date", yesterdayStr)
    .eq("generations_today", 0);

  if (!users || users.length === 0) return res.status(200).json({ sent: 0 });

  for (const user of users) {
    await fetch(`${process.env.VITE_APP_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, type: "followup" })
    });
  }

  res.status(200).json({ sent: users.length });
}