import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const RD_API_URL = "https://api.rd.services/platform/events";

    const rdToken = process.env.RD_ACCESS_TOKEN;
    if (!rdToken) {
      console.error("RD_ACCESS_TOKEN não encontrada!");
      return NextResponse.json(
        { error: "RD token not configured" },
        { status: 500 }
      );
    }

    const payload = {
      event_type: "CONVERSION",
      event_family: "CDP",
      payload: {
        conversion_identifier: "Formulario Terra Ventos",
        name: body.name,
        email: body.email,
        mobile_phone: body.mobile_phone,
        // Origem do lead - necessário para não aparecer como "Desconhecido"
        traffic_source: body.traffic_source || "Comunidade Terra Ventos",
        source: body.traffic_source || "Comunidade Terra Ventos",

        // 🔥 CAMPOS CUSTOMIZADOS → precisam estar aqui!
        custom_fields: {
          investment_range: body.investment_range,
          main_interest: body.main_interest,
        },
      },
    };

    const response = await fetch(RD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rdToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro RD:", result);
      return NextResponse.json(
        { error: "Erro ao enviar ao RD", details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, rd_return: result });
  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
