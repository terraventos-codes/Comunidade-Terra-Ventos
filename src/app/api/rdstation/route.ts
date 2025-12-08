import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rdToken = process.env.RD_ACCESS_TOKEN;
    if (!rdToken) {
      console.error("RD_ACCESS_TOKEN não encontrada!");
      return NextResponse.json(
        { error: "RD token not configured" },
        { status: 500 }
      );
    }

    const trafficSource = body.traffic_source || "Comunidade Terra Ventos";

    // 1. Primeiro, criar/atualizar o contato com a origem usando a API de contatos
    const CONTACTS_API_URL = "https://api.rd.services/platform/contacts";
    
    const contactPayload = {
      name: body.name,
      email: body.email,
      personal_phone: body.mobile_phone,
      // Definir a origem do lead (campo de sistema)
      traffic_source: trafficSource,
      source: trafficSource,
      // Campos customizados
      custom_fields: {
        // Campo personalizado "Origem do Lead" (seleção múltipla)
        origem_do_lead: trafficSource, // Valor deve corresponder a uma das opções configuradas
        investment_range: body.investment_range,
        main_interest: body.main_interest,
      },
    };

    // Criar ou atualizar contato
    const contactResponse = await fetch(CONTACTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rdToken}`,
      },
      body: JSON.stringify(contactPayload),
    });

    let contactResult;
    try {
      const contactText = await contactResponse.text();
      contactResult = contactText ? JSON.parse(contactText) : {};
    } catch (parseError) {
      console.error("Erro ao parsear resposta do contato:", parseError);
      contactResult = { error: "Erro ao processar resposta" };
    }

    if (!contactResponse.ok) {
      console.error("Erro RD - Contato:", {
        status: contactResponse.status,
        statusText: contactResponse.statusText,
        result: contactResult,
      });
      return NextResponse.json(
        { 
          error: "Erro ao criar/atualizar contato no RD Station", 
          details: contactResult,
          status: contactResponse.status
        },
        { status: 500 }
      );
    }

    // 2. Depois, enviar o evento de conversão
    const EVENTS_API_URL = "https://api.rd.services/platform/events";
    
    const eventPayload = {
      event_type: "CONVERSION",
      event_family: "CDP",
      payload: {
        conversion_identifier: "Formulario Terra Ventos",
        name: body.name,
        email: body.email,
        mobile_phone: body.mobile_phone,
        // Incluir origem também no evento
        traffic_source: trafficSource,
        source: trafficSource,
        custom_fields: {
          // Campo personalizado "Origem do Lead" (seleção múltipla)
          origem_do_lead: trafficSource, // Valor deve corresponder a uma das opções configuradas
          investment_range: body.investment_range,
          main_interest: body.main_interest,
        },
      },
    };

    const eventResponse = await fetch(EVENTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${rdToken}`,
      },
      body: JSON.stringify(eventPayload),
    });

    let eventResult;
    try {
      const eventText = await eventResponse.text();
      eventResult = eventText ? JSON.parse(eventText) : {};
    } catch (parseError) {
      console.error("Erro ao parsear resposta do evento:", parseError);
      eventResult = { error: "Erro ao processar resposta" };
    }

    if (!eventResponse.ok) {
      console.error("Erro RD - Evento:", {
        status: eventResponse.status,
        statusText: eventResponse.statusText,
        result: eventResult,
      });
      // Mesmo que o evento falhe, o contato foi criado, então retornamos sucesso parcial
      return NextResponse.json(
        { 
          success: true,
          warning: "Contato criado, mas evento falhou",
          contact: contactResult,
          event_error: eventResult,
          event_status: eventResponse.status
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      contact: contactResult,
      event: eventResult 
    });
  } catch (error: any) {
    console.error("Erro geral na API RD Station:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        message: error?.message || "Erro desconhecido",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
