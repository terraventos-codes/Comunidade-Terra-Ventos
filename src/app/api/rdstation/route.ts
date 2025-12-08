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
    
    const contactPayload: any = {
      name: body.name,
      email: body.email,
      personal_phone: body.mobile_phone,
      // Campos customizados
      custom_fields: {
        investment_range: body.investment_range,
        main_interest: body.main_interest,
      },
    };

    // Adicionar origem do lead no campo personalizado (tentar diferentes nomes)
    if (trafficSource) {
      contactPayload.custom_fields.origem_do_lead = trafficSource;
    }

    let contactResult: any = null;
    let contactError: any = null;

    try {
      // Criar ou atualizar contato
      const contactResponse = await fetch(CONTACTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rdToken}`,
        },
        body: JSON.stringify(contactPayload),
      });

      contactResult = await contactResponse.json();
      
      // Log para debug
      if (!contactResponse.ok) {
        console.error("Erro ao criar contato:", contactResult);
        contactError = contactResult;
      } else {
        console.log("Contato criado/atualizado:", contactResult);
      }
    } catch (error) {
      console.error("Erro ao chamar API de contatos:", error);
      contactError = error;
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
        // Incluir origem no evento
        traffic_source: trafficSource,
        traffic_medium: "website",
        custom_fields: {
          // Campo personalizado "Origem do Lead" (seleção múltipla)
          origem_do_lead: trafficSource,
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

    let eventResult: any = null;
    let eventError: any = null;

    try {
      eventResult = await eventResponse.json();
      
      // Log para debug
      if (!eventResponse.ok) {
        console.error("Erro ao enviar evento:", eventResult);
        eventError = eventResult;
      } else {
        console.log("Evento enviado:", eventResult);
      }
    } catch (error) {
      console.error("Erro ao processar resposta do evento:", error);
      eventError = error;
    }

    // Se ambos falharam, retornar erro
    if (contactError && eventError) {
      return NextResponse.json(
        { 
          error: "Erro ao enviar ao RD", 
          contact_details: contactError,
          event_details: eventError 
        },
        { status: 500 }
      );
    }

    // Se pelo menos um funcionou, retornar sucesso
    return NextResponse.json({ 
      success: true, 
      contact: contactResult,
      event: eventResult,
      warnings: {
        contact_error: contactError || null,
        event_error: eventError || null,
      }
    });
  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
