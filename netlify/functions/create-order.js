const db = require("./_shared/supabase-admin");
const { getUser, res } = require("./_shared/auth");

exports.handler = async (e) => {
  if (e.httpMethod !== "POST") {
    return res(405, { error: "Method not allowed" });
  }

  try {
    const u = await getUser(e);

    if (!u) {
      return res(401, {
        error: "Silakan login terlebih dahulu.",
      });
    }

    const b = JSON.parse(e.body || "{}");

    const name = String(b.name || "")
      .trim()
      .slice(0, 100);

    const wa = String(b.whatsapp || "")
      .replace(/[^\d+]/g, "")
      .slice(0, 20);

    const em = String(b.email || "")
      .trim()
      .slice(0, 120);

    const ids = [...new Set(Array.isArray(b.ids) ? b.ids : [])]
      .filter((x) => /^[0-9a-f-]{36}$/i.test(x))
      .slice(0, 50);

    if (
      name.length < 2 ||
      wa.length < 9 ||
      !/^\S+@\S+\.\S+$/.test(em) ||
      !ids.length
    ) {
      return res(400, {
        error: "Data pembeli tidak valid.",
      });
    }

    const { data: ps, error: productError } = await db
      .from("products")
      .select("id,name,price")
      .in("id", ids)
      .eq("is_active", true);

    if (productError) throw productError;

    const total = (ps || []).reduce(
      (a, p) => a + Number(p.price),
      0
    );

    if (!ps || !ps.length || total < 1) {
      return res(400, {
        error: "Produk tidak tersedia.",
      });
    }

    const num =
      "MSD-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const { data: o, error } = await db
      .from("orders")
      .insert({
        order_number: num,
        user_id: u.id,
        customer_name: name,
        customer_whatsapp: wa,
        customer_email: em,
        total_amount: total,
        status: "waiting_payment",
        gateway_order_id: num,
        expires_at: new Date(
          Date.now() + 36e5
        ).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const { error: itemError } = await db
      .from("order_items")
      .insert(
        ps.map((p) => ({
          order_id: o.id,
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          quantity: 1,
        }))
      );

    if (itemError) throw itemError;

    return res(200, {
      order_id: o.id,
      order_number: num,
      total_amount: total,
      payment_method: "dana_manual",
      status: "waiting_payment",
    });

  } catch (err) {
    console.error(err);

    return res(500, {
      error: "Terjadi kesalahan. Coba lagi nanti.",
    });
  }
};
