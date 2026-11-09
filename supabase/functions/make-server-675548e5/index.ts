import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.ts";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ─── Auth helper ───────────────────────────────────────────────────────────────
// Only users whose email is listed in the ADMIN_EMAILS secret (comma-separated)
// may manage content. Set it with: supabase secrets set ADMIN_EMAILS=you@example.com
const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function requireAuth(authHeader: string | null) {
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user?.id) return null;
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) return null;
  return user;
}

// ─── Health ────────────────────────────────────────────────────────────────────
app.get("/make-server-675548e5/health", (c) => c.json({ status: "ok" }));

// ════════════════════════════════════════════════════════
// ─── COLLABORATIONS ──────────────────────────────────────
// ════════════════════════════════════════════════════════

app.get("/make-server-675548e5/collaborations", async (c) => {
  try {
    const collaborations = await kv.getByPrefix("collaboration:");
    const sorted = collaborations.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ collaborations: sorted });
  } catch (error) {
    console.log(`Error fetching collaborations: ${error.message}`);
    return c.json({ error: "Failed to fetch collaborations" }, 500);
  }
});

app.get("/make-server-675548e5/collaborations/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const collaboration = await kv.get(`collaboration:${id}`);
    if (!collaboration) return c.json({ error: "Not found" }, 404);
    return c.json({ collaboration });
  } catch (error) {
    console.log(`Error fetching collaboration ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to fetch collaboration" }, 500);
  }
});

app.post("/make-server-675548e5/collaborations", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized — please sign in to add collaborations" }, 401);

    const body = await c.req.json();
    const { brandName, brandLogo, thumbnail, campaignName, description, type, platforms, year, featured, metrics, testimonial } = body;

    if (!brandName || !description) {
      return c.json({ error: "Brand name and description are required" }, 400);
    }

    const id = crypto.randomUUID();
    const collaboration = {
      id, brandName, brandLogo: brandLogo || '',
      thumbnail: thumbnail || '', campaignName: campaignName || brandName,
      description, type: type || 'Collaboration',
      platforms: platforms || [], year: year || new Date().getFullYear().toString(),
      featured: featured || false,
      metrics: metrics || {},
      testimonial: testimonial || {},
      createdAt: new Date().toISOString(),
    };

    await kv.set(`collaboration:${id}`, collaboration);
    console.log(`Collaboration added: ${id} — ${brandName}`);
    return c.json({ collaboration });
  } catch (error) {
    console.log(`Error adding collaboration: ${error.message}`);
    return c.json({ error: "Failed to add collaboration" }, 500);
  }
});

app.put("/make-server-675548e5/collaborations/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const id = c.req.param('id');
    const existing = await kv.get(`collaboration:${id}`);
    if (!existing) return c.json({ error: "Collaboration not found" }, 404);

    const body = await c.req.json();
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`collaboration:${id}`, updated);
    console.log(`Collaboration updated: ${id}`);
    return c.json({ collaboration: updated });
  } catch (error) {
    console.log(`Error updating collaboration ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to update collaboration" }, 500);
  }
});

app.delete("/make-server-675548e5/collaborations/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param('id');
    await kv.del(`collaboration:${id}`);
    console.log(`Collaboration deleted: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting collaboration: ${error.message}`);
    return c.json({ error: "Failed to delete collaboration" }, 500);
  }
});

// ════════════════════════════════════════════════════════
// ─── REVIEWS ─────────────────────────────────────────────
// ════════════════════════════════════════════════════════

app.get("/make-server-675548e5/reviews", async (c) => {
  try {
    const reviews = await kv.getByPrefix("review:");
    const sorted = reviews.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ reviews: sorted });
  } catch (error) {
    console.log(`Error fetching reviews: ${error.message}`);
    return c.json({ error: "Failed to fetch reviews" }, 500);
  }
});

app.get("/make-server-675548e5/reviews/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const review = await kv.get(`review:${id}`);
    if (!review) return c.json({ error: "Not found" }, 404);
    return c.json({ review });
  } catch (error) {
    console.log(`Error fetching review ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to fetch review" }, 500);
  }
});

app.post("/make-server-675548e5/reviews", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized — please sign in to add reviews" }, 401);

    const body = await c.req.json();
    const { productName, brand, productImage, excerpt, review, rating, category, skinType, concern, price, priceRange, wouldRepurchase, isHolyGrail } = body;

    if (!productName || !review || !rating) {
      return c.json({ error: "Product name, review, and rating are required" }, 400);
    }

    const id = crypto.randomUUID();
    const reviewData = {
      id, productName, brand: brand || '',
      productImage: productImage || '',
      excerpt: excerpt || '',
      review, rating: Number(rating),
      category: category || 'Uncategorized',
      skinType: skinType || 'All Skin Types',
      concern: concern || '',
      price: price || '',
      priceRange: priceRange || '',
      wouldRepurchase: wouldRepurchase ?? true,
      isHolyGrail: isHolyGrail ?? false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`review:${id}`, reviewData);
    console.log(`Review added: ${id} — ${productName}`);
    return c.json({ review: reviewData });
  } catch (error) {
    console.log(`Error adding review: ${error.message}`);
    return c.json({ error: "Failed to add review" }, 500);
  }
});

app.put("/make-server-675548e5/reviews/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const id = c.req.param('id');
    const existing = await kv.get(`review:${id}`);
    if (!existing) return c.json({ error: "Review not found" }, 404);

    const body = await c.req.json();
    if (body.rating) body.rating = Number(body.rating);
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`review:${id}`, updated);
    console.log(`Review updated: ${id}`);
    return c.json({ review: updated });
  } catch (error) {
    console.log(`Error updating review ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to update review" }, 500);
  }
});

app.delete("/make-server-675548e5/reviews/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param('id');
    await kv.del(`review:${id}`);
    console.log(`Review deleted: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting review: ${error.message}`);
    return c.json({ error: "Failed to delete review" }, 500);
  }
});

// ════════════════════════════════════════════════════════
// ─── VIDEOS ──────────────────────────────────────────────
// ════════════════════════════════════════════════════════

app.get("/make-server-675548e5/videos", async (c) => {
  try {
    const videos = await kv.getByPrefix("video:");
    const sorted = videos.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ videos: sorted });
  } catch (error) {
    console.log(`Error fetching videos: ${error.message}`);
    return c.json({ error: "Failed to fetch videos" }, 500);
  }
});

app.get("/make-server-675548e5/videos/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const video = await kv.get(`video:${id}`);
    if (!video) return c.json({ error: "Not found" }, 404);
    return c.json({ video });
  } catch (error) {
    console.log(`Error fetching video ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to fetch video" }, 500);
  }
});

app.post("/make-server-675548e5/videos", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const { title, description, thumbnail, platform, type, views, likes, duration, date, url, featured } = body;

    if (!title || !platform || !url) {
      return c.json({ error: "Title, platform, and URL are required" }, 400);
    }

    const id = crypto.randomUUID();
    const video = {
      id, title,
      description: description || '',
      thumbnail: thumbnail || '',
      platform: platform || 'Instagram',
      type: type || 'Content',
      views: views || '0',
      likes: likes || '0',
      duration: duration || '',
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      url,
      featured: featured || false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`video:${id}`, video);
    console.log(`Video added: ${id} — ${title}`);
    return c.json({ video });
  } catch (error) {
    console.log(`Error adding video: ${error.message}`);
    return c.json({ error: "Failed to add video" }, 500);
  }
});

app.put("/make-server-675548e5/videos/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const id = c.req.param('id');
    const existing = await kv.get(`video:${id}`);
    if (!existing) return c.json({ error: "Video not found" }, 404);

    const body = await c.req.json();
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`video:${id}`, updated);
    console.log(`Video updated: ${id}`);
    return c.json({ video: updated });
  } catch (error) {
    console.log(`Error updating video ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to update video" }, 500);
  }
});

app.delete("/make-server-675548e5/videos/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param('id');
    await kv.del(`video:${id}`);
    console.log(`Video deleted: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting video: ${error.message}`);
    return c.json({ error: "Failed to delete video" }, 500);
  }
});

// ════════════════════════════════════════════════════════
// ─── CONTACT FORM ────────────────────────────────────────
// ════════════════════════════════════════════════════════

app.post("/make-server-675548e5/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, subject, message, company, service, budget, type } = body;

    if (!name || !email || !message) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }
    const tooLong = [name, email, subject, company, service, budget, type]
      .some((v) => typeof v === 'string' && v.length > 500) || String(message).length > 5000;
    if (tooLong) {
      return c.json({ error: "Submission is too long" }, 400);
    }

    const id = crypto.randomUUID();
    const submission = {
      id,
      type: type || 'general',
      name, email,
      subject: subject || '',
      message,
      company: company || '',
      service: service || '',
      budget: budget || '',
      createdAt: new Date().toISOString(),
      read: false,
    };

    await kv.set(`contact:${id}`, submission);
    console.log(`Contact form submission: ${id} — from ${name} (${email}) — type: ${type || 'general'}`);
    return c.json({ success: true, id });
  } catch (error) {
    console.log(`Error saving contact submission: ${error.message}`);
    return c.json({ error: "Failed to save contact submission" }, 500);
  }
});

app.get("/make-server-675548e5/contacts", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const submissions = await kv.getByPrefix("contact:");
    const sorted = submissions.sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ submissions: sorted });
  } catch (error) {
    console.log(`Error fetching contacts: ${error.message}`);
    return c.json({ error: "Failed to fetch contact submissions" }, 500);
  }
});

app.put("/make-server-675548e5/contacts/:id/read", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param('id');
    const existing = await kv.get(`contact:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const updated = { ...existing, read: true };
    await kv.set(`contact:${id}`, updated);
    console.log(`Contact marked as read: ${id}`);
    return c.json({ success: true, submission: updated });
  } catch (error) {
    console.log(`Error marking contact as read ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to update contact" }, 500);
  }
});

app.delete("/make-server-675548e5/contacts/:id", async (c) => {
  try {
    const user = await requireAuth(c.req.header('Authorization'));
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const id = c.req.param('id');
    await kv.del(`contact:${id}`);
    console.log(`Contact deleted: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting contact ${c.req.param('id')}: ${error.message}`);
    return c.json({ error: "Failed to delete contact" }, 500);
  }
});

Deno.serve(app.fetch);
