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
    // URL correta da API Platform do RD Station
    const CONTACTS_API_URL = "https://api.rd.services/platform/contacts";
    
    // Payload formatado conforme documentação do RD Station
    const contactPayload: any = {
      name: body.name,
      email: body.email,
      // Formato correto para telefone na API Platform
      personal_phones: body.mobile_phone ? [
        {
          phone: body.mobile_phone,
          type: "MOBILE"
        }
      ] : [],
      // Campos de origem
      traffic_source: trafficSource,
      source: trafficSource,
    };

    // Adicionar campos customizados apenas se existirem
    if (body.investment_range || body.main_interest || trafficSource) {
      contactPayload.custom_fields = {};
      
      if (trafficSource) {
        contactPayload.custom_fields.origem_do_lead = trafficSource;
      }
      if (body.investment_range) {
        contactPayload.custom_fields.investment_range = body.investment_range;
      }
      if (body.main_interest) {
        contactPayload.custom_fields.main_interest = body.main_interest;
      }
    }

    console.log("Enviando contato para RD Station:", {
      url: CONTACTS_API_URL,
      payload: JSON.stringify(contactPayload, null, 2)
    });

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
        url: CONTACTS_API_URL,
        payload: contactPayload,
        result: contactResult,
        responseHeaders: Object.fromEntries(contactResponse.headers.entries()),
      });
      return NextResponse.json(
        { 
          error: "Erro ao criar/atualizar contato no RD Station", 
          details: contactResult,
          status: contactResponse.status,
          url: CONTACTS_API_URL
        },
        { status: 500 }
      );
    }

    // 2. Depois, enviar o evento de conversão
    const EVENTS_API_URL = "https://api.rd.services/platform/events";
    
    // Payload do evento formatado conforme documentação do RD Station
    const eventPayload: any = {
      event_type: "CONVERSION",
      event_family: "CDP",
      payload: {
        conversion_identifier: "Formulario Terra Ventos",
        name: body.name,
        email: body.email,
        personal_phones: body.mobile_phone ? [
          {
            phone: body.mobile_phone,
            type: "MOBILE"
          }
        ] : [],
        // Campos de origem
        traffic_source: trafficSource,
        source: trafficSource,
      },
    };

    // Adicionar campos customizados ao evento apenas se existirem
    if (body.investment_range || body.main_interest || trafficSource) {
      eventPayload.payload.custom_fields = {};
      
      if (trafficSource) {
        eventPayload.payload.custom_fields.origem_do_lead = trafficSource;
      }
      if (body.investment_range) {
        eventPayload.payload.custom_fields.investment_range = body.investment_range;
      }
      if (body.main_interest) {
        eventPayload.payload.custom_fields.main_interest = body.main_interest;
      }
    }

    console.log("Enviando evento para RD Station:", {
      url: EVENTS_API_URL,
      payload: JSON.stringify(eventPayload, null, 2)
    });

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
        url: EVENTS_API_URL,
        payload: eventPayload,
        result: eventResult,
        responseHeaders: Object.fromEntries(eventResponse.headers.entries()),
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
