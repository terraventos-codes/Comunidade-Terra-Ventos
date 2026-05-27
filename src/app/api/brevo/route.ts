import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[brevo] incoming body:", JSON.stringify(body));

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID || "2";

    console.log("[brevo] BREVO_API_KEY present:", !!BREVO_API_KEY);

    if (!BREVO_API_KEY) {
      console.error("[brevo] missing BREVO_API_KEY");
      return NextResponse.json(
        { error: "BREVO_API_KEY não configurada" },
        { status: 500 },
      );
    }

    if (!body?.email) {
      console.warn("[brevo] missing email in request body");
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 },
      );
    }

    const payload = {
      email: body.email,
      listIds: [Number(BREVO_LIST_ID)],
      attributes: {
        FIRSTNAME: body.name || "",
        SMS: body.mobile_phone || "",
        PAIS_ESTADO: body.paisEstado || "",
        INVESTMENT_RANGE: body.investment_range || "",
        MAIN_INTEREST: body.main_interest || "",
        CALENDAR_DATE: body.calendar_date || "",
      },
    };

    console.log("[brevo] payload:", JSON.stringify(payload));

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await brevoRes.text();
    console.log("[brevo] response status:", brevoRes.status);
    console.log("[brevo] raw response text:", responseText);

    let responseJson = null;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = responseText;
    }

    if (!brevoRes.ok) {
      console.error("[brevo] non-ok response from Brevo:", brevoRes.status);
      return NextResponse.json(
        {
          error: true,
          status: brevoRes.status,
          body: responseJson,
        },
        { status: 500 },
      );
    }

    console.log("[brevo] contact created successfully", responseJson);
    return NextResponse.json({ success: true, brevo_response: responseJson });
  } catch (err: any) {
    console.error("[brevo] internal error:", err);
    return NextResponse.json(
      { error: "Erro interno", message: err?.message },
      { status: 500 },
    );
  }
}
