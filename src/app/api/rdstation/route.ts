import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const RD_TOKEN = process.env.RD_PUBLIC_TOKEN;
    if (!RD_TOKEN) {
      return NextResponse.json(
        { error: "RD_PUBLIC_TOKEN não configurado" },
        { status: 500 }
      );
    }

    // Campos oficiais aceitos pela API 1.3
    const payload = {
      token: RD_TOKEN,
      identificador: "Formulario_Terra_Ventos",
      email: body.email,
      nome: body.name,
      telefone: body.mobile_phone,
      pais_estado: body.paisEstado,
      faixa_investimento: body.investment_range,
      interesse_principal: body.main_interest,
      origem: "Comunidade Terra Ventos",
    };

    const rdRes = await fetch(
      "https://www.rdstation.com.br/api/1.3/conversions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const rdText = await rdRes.text();
    let rdJson = null;
    try {
      rdJson = JSON.parse(rdText);
    } catch {}

    if (!rdRes.ok) {
      return NextResponse.json(
        { error: true, status: rdRes.status, body: rdText },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rd_response: rdJson,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro interno", message: err?.message },
      { status: 500 }
    );
  }
}
