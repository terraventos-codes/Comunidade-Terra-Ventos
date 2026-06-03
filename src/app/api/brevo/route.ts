import { NextResponse } from "next/server";

/**
 * Normaliza um número de telefone para o formato E.164 exigido pela Brevo.
 *
 * Aceita qualquer variação que o usuário possa digitar:
 *   "+55 (85) 9 9999-9999"  → "+5585999999999"
 *   "(85) 99999-9999"       → "+5585999999999"
 *   "85999999999"           → "+5585999999999"
 *   "+1 (305) 555-1234"     → "+13055551234"
 *   "+351 912 345 678"      → "+351912345678"
 *
 * Retorna null se o número tiver menos de 7 dígitos (inválido).
 */
function formatPhone(raw: string): string | null {
  if (!raw || !raw.trim()) return null;

  const trimmed = raw.trim();

  // Detecta se o número já vem com "+" no início (DDI explícito)
  const hasExplicitDDI = trimmed.startsWith("+");

  // Remove tudo que não for dígito
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 7) return null; // muito curto para ser válido
  if (digits.length > 15) return null; // excede limite E.164

  // Se o número já vinha com "+", confiamos que os dígitos incluem o DDI
  if (hasExplicitDDI) {
    return `+${digits}`;
  }

  // Número brasileiro sem DDI: 10 (fixo) ou 11 dígitos (celular com 9)
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  // Número que começa com DDI 55 (Brasil) + DDD + número
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`;
  }

  // Qualquer outro número internacional: assume que os dígitos já incluem DDI
  return `+${digits}`;
}

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

    const formattedPhone = formatPhone(body.mobile_phone || "");
    console.log("[brevo] formatted phone:", formattedPhone);

    // Separa o nome completo em primeiro e sobrenome
    const fullName = (body.name || "").trim();
    const spaceIdx = fullName.indexOf(" ");
    const firstName = spaceIdx > -1 ? fullName.slice(0, spaceIdx) : fullName;
    const lastName = spaceIdx > -1 ? fullName.slice(spaceIdx + 1) : "";

    const attributes: Record<string, string> = {
      NOME: firstName,       // campo nativo da conta Brevo (field_key: firstname)
      SOBRENOME: lastName,   // campo nativo da conta Brevo (field_key: lastname)
      PAIS_ESTADO: body.paisEstado || "",
      INVESTMENT_RANGE: body.investment_range || "",
      MAIN_INTEREST: body.main_interest || "",
      REGION_INTEREST: body.region_interest || "",
      CALENDAR_DATE: body.calendar_date || "",
    };

    // Só inclui SMS se o número for válido (evita erro 400 da Brevo)
    if (formattedPhone) {
      attributes.SMS = formattedPhone;
    }

    const payload: Record<string, unknown> = {
      email: body.email,
      listIds: [Number(BREVO_LIST_ID)],
      updateEnabled: true, // atualiza o contato se o email já existir
      attributes,
    };

    console.log("[brevo] payload:", JSON.stringify(payload));

    // ── Verificar se o telefone já existe na Brevo ──────────────────────────
    let phoneAlreadyExists = false;
    if (formattedPhone) {
      try {
        const phoneCheckRes = await fetch(
          `https://api.brevo.com/v3/contacts/${encodeURIComponent(formattedPhone)}?identifierType=SMS_NUMBER`,
          {
            method: "GET",
            headers: { "api-key": BREVO_API_KEY },
          },
        );
        if (phoneCheckRes.ok) {
          phoneAlreadyExists = true;
          console.log("[brevo] phone already registered:", formattedPhone);
        }
      } catch {
        // ignora erro de lookup — não bloqueia o cadastro
      }
    }

    // ── Criar / atualizar contato na Brevo ───────────────────────────────────
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

    // 201 = novo contato criado | 204 = contato existente atualizado
    const emailAlreadyExists = brevoRes.status === 204;
    console.log("[brevo] contact saved. emailAlreadyExists:", emailAlreadyExists, "phoneAlreadyExists:", phoneAlreadyExists);

    return NextResponse.json({
      success: true,
      emailAlreadyExists,
      phoneAlreadyExists,
      brevo_response: responseJson,
    });
  } catch (err: any) {
    console.error("[brevo] internal error:", err);
    return NextResponse.json(
      { error: "Erro interno", message: err?.message },
      { status: 500 },
    );
  }
}
