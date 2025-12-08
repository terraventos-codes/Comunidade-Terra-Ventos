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
      // Definir a origem do lead - campos de tráfego completos
      traffic_source: trafficSource,
      traffic_medium: "website",
      traffic_campaign: "Formulario Terra Ventos",
      // Tentar também com funnel.origin
      funnel: {
        origin: trafficSource,
      },
      // Campos customizados
      custom_fields: {
        // Campo personalizado "Origem do Lead" (seleção múltipla)
        // Tentar diferentes variações do nome do campo
        origem_do_lead: trafficSource,
        "Origem do Lead": trafficSource, // Nome exato como aparece no RD
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

    const contactResult = await contactResponse.json();
    
    // Log para debug
    if (!contactResponse.ok) {
      console.error("Erro ao criar contato:", contactResult);
    } else {
      console.log("Contato criado/atualizado:", contactResult);
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
        // Incluir origem também no evento - campos de tráfego completos
        traffic_source: trafficSource,
        traffic_medium: "website",
        traffic_campaign: "Formulario Terra Ventos",
        source: trafficSource,
        custom_fields: {
          // Campo personalizado "Origem do Lead" (seleção múltipla)
          // Tentar diferentes variações do nome do campo
          origem_do_lead: trafficSource,
          "Origem do Lead": trafficSource, // Nome exato como aparece no RD
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

    const eventResult = await eventResponse.json();
    
    // Log para debug
    if (!eventResponse.ok) {
      console.error("Erro ao enviar evento:", eventResult);
    } else {
      console.log("Evento enviado:", eventResult);
    }

    if (!contactResponse.ok && !eventResponse.ok) {
      console.error("Erro RD - Contato:", contactResult);
      console.error("Erro RD - Evento:", eventResult);
      return NextResponse.json(
        { 
          error: "Erro ao enviar ao RD", 
          contact_details: contactResult,
          event_details: eventResult 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      contact: contactResult,
      event: eventResult 
    });
  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
