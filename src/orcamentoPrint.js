export function abrirOrcamentoParaImpressao({
  orcamento,
  cliente,
  itens = [],
  empresa = {}
}) {
  const janela = window.open('', '_blank')

  if (!janela) {
    alert('O navegador bloqueou a abertura do orçamento.')
    return
  }

  const subtotal = itens.reduce((total, item) => {
    return (
      total +
      Number(item.quantidade || 0) *
        Number(item.valor_unitario || 0)
    )
  }, 0)

  const desconto = Number(orcamento.desconto || 0)
  const total = Number(orcamento.total || 0)

  const nomeEmpresa =
    empresa.razao_social ||
    empresa.nome_fantasia ||
    'INFRATEC'

  const nomeFantasia =
    empresa.nome_fantasia ||
    'INFRATEC'

  const enderecoEmpresa = [
    empresa.endereco,
    empresa.numero,
    empresa.bairro
  ]
    .filter(Boolean)
    .join(', ')

  const cidadeEmpresa = [
    empresa.cidade,
    empresa.estado
  ]
    .filter(Boolean)
    .join(' / ')

  const enderecoCliente = [
    cliente?.endereco,
    cliente?.numero,
    cliente?.bairro
  ]
    .filter(Boolean)
    .join(', ')

  const cidadeCliente = [
    cliente?.cidade,
    cliente?.estado
  ]
    .filter(Boolean)
    .join(' / ')

  const logo = empresa.logo_url
    ? `
      <img
        src="${escaparHtml(empresa.logo_url)}"
        alt="Logo da empresa"
        class="company-logo"
      />
    `
    : `
      <div class="company-fallback">
        ${escaparHtml(
          String(nomeFantasia)
            .slice(0, 1)
            .toUpperCase()
        )}
      </div>
    `

  const linhasItens = itens.length
    ? itens
        .map(
          (item, indice) => `
            <tr>
              <td class="index">
                ${indice + 1}
              </td>

              <td>
                <div class="item-name">
                  ${escaparHtml(item.nome)}
                </div>

                ${
                  item.tipo
                    ? `
                      <div class="item-type">
                        ${
                          item.tipo === 'servico'
                            ? 'Serviço'
                            : 'Produto'
                        }
                      </div>
                    `
                    : ''
                }
              </td>

              <td class="center">
                ${formatarQuantidade(item.quantidade)}
              </td>

              <td class="right">
                ${formatarMoeda(item.valor_unitario)}
              </td>

              <td class="right strong">
                ${formatarMoeda(
                  Number(item.quantidade || 0) *
                    Number(item.valor_unitario || 0)
                )}
              </td>
            </tr>
          `
        )
        .join('')
    : `
      <tr>
        <td colspan="5" class="empty-row">
          Nenhum item adicionado ao orçamento.
        </td>
      </tr>
    `

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">

    <head>
      <meta charset="UTF-8" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />

      <title>
        ${escaparHtml(orcamento.numero)}
      </title>

      <style>
        :root {
          --dark: #171b20;
          --text: #2c3239;
          --muted: #7b838e;
          --line: #e5e8ec;
          --soft: #f8f9fa;
          --yellow: #d8ad10;
          --yellow-soft: #fff8dd;
          --green-soft: #eaf7ef;
          --green: #2d7950;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #eef0f2;
          color: var(--text);
          font-family: Arial, Helvetica, sans-serif;
        }

        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 18px auto;
          padding: 15mm 15mm 13mm;
          background: #ffffff;
          box-shadow:
            0 8px 28px rgba(16, 22, 29, .08);
        }

        .top-accent {
          height: 5px;
          margin: -15mm -15mm 14mm;
          background:
            linear-gradient(
              90deg,
              var(--yellow) 0 24%,
              var(--dark) 24% 100%
            );
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--line);
        }

       .company {
  display: flex;
  gap: 16px;
  align-items: center;
  min-width: 0;
  flex: 1;
}

       .company-logo {
  width: 105px;
  height: 78px;
  object-fit: contain;
  object-position: left center;
  flex-shrink: 0;
}

        .company-fallback {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: var(--yellow);
          color: var(--dark);
          font-size: 20px;
          font-weight: 800;
        }

       .company h1 {
  margin: 0 0 5px;
  color: var(--dark);
  font-size: 13px;
  line-height: 1.25;
  font-weight: 700;
  max-width: 270px;
}

        .company p {
          margin: 3px 0;
          color: var(--muted);
          font-size: 9px;
          line-height: 1.35;
        }

        .document {
          min-width: 205px;
          text-align: right;
        }

        .document-badge {
          display: inline-block;
          margin-bottom: 8px;
          padding: 5px 8px;
          border-radius: 999px;
          background: var(--yellow-soft);
          color: #8b6b07;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .document-number {
          color: var(--dark);
          font-size: 20px;
          font-weight: 800;
        }

        .document-meta {
          margin-top: 10px;
          color: var(--muted);
          font-size: 9px;
          line-height: 1.6;
        }

        .document-meta strong {
          color: var(--text);
        }

        .section {
          margin-top: 19px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: var(--dark);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .055em;
          text-transform: uppercase;
        }

        .section-title::before {
          content: "";
          width: 4px;
          height: 14px;
          border-radius: 4px;
          background: var(--yellow);
        }

        .info-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 28px;
          padding: 13px 14px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--soft);
        }

        .field span {
          display: block;
          margin-bottom: 3px;
          color: #9299a2;
          font-size: 7.5px;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .field strong {
          color: #3a4048;
          font-size: 9.5px;
          line-height: 1.4;
        }

        table {
          width: 100%;
          overflow: hidden;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid var(--line);
          border-radius: 8px;
        }

        th {
          padding: 9px 8px;
          border-bottom: 1px solid var(--line);
          background: var(--dark);
          color: #ffffff;
          font-size: 7.5px;
          font-weight: 700;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        td {
          padding: 10px 8px;
          border-bottom: 1px solid #edf0f2;
          color: #4a515a;
          font-size: 9px;
          vertical-align: middle;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        tbody tr:nth-child(even) td {
          background: #fbfbfc;
        }

        .index {
          width: 34px;
          color: #9097a0;
          text-align: center;
        }

        .item-name {
          color: #32383f;
          font-weight: 700;
        }

        .item-type {
          margin-top: 3px;
          color: #9aa1aa;
          font-size: 7.5px;
        }

        .center {
          text-align: center;
        }

        .right {
          text-align: right;
        }

        .strong {
          color: #2c3138;
          font-weight: 700;
        }

        .empty-row {
          padding: 20px;
          color: #969da6;
          text-align: center;
        }

        .summary {
          width: 320px;
          margin: 15px 0 0 auto;
          padding: 12px 14px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fbfbfc;
        }

        .summary-row,
        .summary-total {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .summary-row {
          padding: 5px 0;
          color: var(--muted);
          font-size: 9px;
        }

        .summary-total {
          margin-top: 6px;
          padding-top: 10px;
          border-top: 1px solid var(--line);
          color: var(--dark);
          font-size: 14px;
          font-weight: 800;
        }

        .conditions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .condition {
          padding: 11px 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #ffffff;
        }

        .condition span {
          display: block;
          margin-bottom: 4px;
          color: #9299a2;
          font-size: 7.5px;
          text-transform: uppercase;
        }

        .condition strong {
          color: #3b4149;
          font-size: 9px;
        }

        .status-pill {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          background: var(--green-soft);
          color: var(--green);
          font-size: 8px;
          font-weight: 700;
        }

        .notes {
          padding: 12px 14px;
          border-left: 4px solid var(--yellow);
          border-radius: 0 8px 8px 0;
          background: var(--yellow-soft);
          color: #5f5842;
          font-size: 9px;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-top: 55px;
        }

        .signature {
          padding-top: 8px;
          border-top: 1px solid #8c929a;
          color: #69717c;
          font-size: 8.5px;
          text-align: center;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 26px;
          padding-top: 9px;
          border-top: 1px solid var(--line);
          color: #9ba1aa;
          font-size: 7.5px;
        }

        .footer-brand {
          color: #81700f;
          font-weight: 700;
        }

        .actions {
          position: fixed;
          top: 14px;
          right: 14px;
          display: flex;
          gap: 8px;
        }

        .actions button {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 10px;
          cursor: pointer;
        }

        .close {
          border: 1px solid #d5d9de;
          background: #ffffff;
          color: #4f5660;
        }

        .print {
          border: 0;
          background: var(--dark);
          color: #ffffff;
        }

        @media print {
          body {
            background: #ffffff;
          }

          .page {
            width: auto;
            min-height: auto;
            margin: 0;
            padding: 11mm;
            box-shadow: none;
          }

          .top-accent {
            margin: -11mm -11mm 10mm;
          }

          .actions {
            display: none;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      </style>
    </head>

    <body>
      <div class="actions">
        <button
          class="close"
          onclick="window.close()"
        >
          Fechar
        </button>

        <button
          class="print"
          onclick="window.print()"
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      <main class="page">

        <div class="top-accent"></div>

        <header class="header">

          <div class="company">

            ${logo}

            <div>

              <h1>
                ${escaparHtml(nomeEmpresa)}
              </h1>

              ${
                empresa.cnpj
                  ? `
                    <p>
                      CNPJ
                      ${escaparHtml(
                        empresa.cnpj
                      )}
                    </p>
                  `
                  : ''
              }

              ${
                enderecoEmpresa
                  ? `
                    <p>
                      ${escaparHtml(
                        enderecoEmpresa
                      )}
                    </p>
                  `
                  : ''
              }

              ${
                cidadeEmpresa
                  ? `
                    <p>
                      ${escaparHtml(
                        cidadeEmpresa
                      )}
                    </p>
                  `
                  : ''
              }

              ${
                empresa.telefone
                  ? `
                    <p>
                      ${escaparHtml(
                        empresa.telefone
                      )}
                    </p>
                  `
                  : ''
              }

              ${
                empresa.email
                  ? `
                    <p>
                      ${escaparHtml(
                        empresa.email
                      )}
                    </p>
                  `
                  : ''
              }

            </div>

          </div>

          <div class="document">

            <div class="document-badge">
              Orçamento
            </div>

            <div class="document-number">
              ${escaparHtml(
                orcamento.numero
              )}
            </div>

            <div class="document-meta">

              Data:
              <strong>
                ${formatarData(
                  orcamento.data_orcamento
                )}
              </strong>

              <br />

              Validade:
              <strong>
                ${formatarData(
                  orcamento.validade
                )}
              </strong>

            </div>

          </div>

        </header>

        <section class="section">

          <div class="section-title">
            Dados do cliente
          </div>

          <div class="info-card">

            <div class="field">
              <span>Cliente</span>

              <strong>
                ${escaparHtml(
                  cliente?.nome ||
                  'Não informado'
                )}
              </strong>
            </div>

            <div class="field">
              <span>CPF / CNPJ</span>

              <strong>
                ${escaparHtml(
                  cliente?.cpf_cnpj ||
                  'Não informado'
                )}
              </strong>
            </div>

            <div class="field">
              <span>Telefone</span>

              <strong>
                ${escaparHtml(
                  cliente?.whatsapp ||
                  cliente?.telefone ||
                  'Não informado'
                )}
              </strong>
            </div>

            <div class="field">
              <span>E-mail</span>

              <strong>
                ${escaparHtml(
                  cliente?.email ||
                  'Não informado'
                )}
              </strong>
            </div>

            <div class="field">
              <span>Endereço</span>

              <strong>
                ${escaparHtml(
                  enderecoCliente ||
                  'Não informado'
                )}
              </strong>
            </div>

            <div class="field">
              <span>Cidade</span>

              <strong>
                ${escaparHtml(
                  cidadeCliente ||
                  'Não informado'
                )}
              </strong>
            </div>

          </div>

        </section>

        <section class="section">

          <div class="section-title">
            Itens do orçamento
          </div>

          <table>

            <thead>

              <tr>
                <th class="center">#</th>
                <th>Descrição</th>
                <th class="center">Qtd.</th>
                <th class="right">Valor unit.</th>
                <th class="right">Subtotal</th>
              </tr>

            </thead>

            <tbody>
              ${linhasItens}
            </tbody>

          </table>

          <div class="summary">

            <div class="summary-row">
              <span>Subtotal</span>

              <strong>
                ${formatarMoeda(subtotal)}
              </strong>
            </div>

            ${
              desconto > 0
                ? `
                  <div class="summary-row">
                    <span>Desconto</span>

                    <strong>
                      - ${formatarMoeda(
                        desconto
                      )}
                    </strong>
                  </div>
                `
                : ''
            }

            <div class="summary-total">
              <span>Total</span>

              <span>
                ${formatarMoeda(total)}
              </span>
            </div>

          </div>

        </section>

        ${
          orcamento.forma_pagamento ||
          orcamento.prazo_execucao ||
          orcamento.garantia ||
          orcamento.status
            ? `
              <section class="section">

                <div class="section-title">
                  Condições
                </div>

                <div class="conditions">

                  <div class="condition">
                    <span>Forma de pagamento</span>

                    <strong>
                      ${escaparHtml(
                        orcamento.forma_pagamento ||
                        'Não informado'
                      )}
                    </strong>
                  </div>

                  <div class="condition">
                    <span>Prazo de execução</span>

                    <strong>
                      ${escaparHtml(
                        orcamento.prazo_execucao ||
                        'Não informado'
                      )}
                    </strong>
                  </div>

                  <div class="condition">
                    <span>Garantia</span>

                    <strong>
                      ${escaparHtml(
                        orcamento.garantia ||
                        'Não informado'
                      )}
                    </strong>
                  </div>

                  <div class="condition">
                    <span>Status</span>

                    <strong class="status-pill">
                      ${escaparHtml(
                        nomeStatus(
                          orcamento.status
                        )
                      )}
                    </strong>
                  </div>

                </div>

              </section>
            `
            : ''
        }

        ${
          orcamento.observacoes
            ? `
              <section class="section">

                <div class="section-title">
                  Observações
                </div>

                <div class="notes">
                  ${escaparHtml(
                    orcamento.observacoes
                  )}
                </div>

              </section>
            `
            : ''
        }

        <div class="signatures">

          <div class="signature">
            ${escaparHtml(nomeEmpresa)}
          </div>

          <div class="signature">
            ${escaparHtml(
              cliente?.nome ||
              'Cliente'
            )}
          </div>

        </div>

        <footer class="footer">

          <span>
            Documento gerado pelo Sistema de Gestão
          </span>

          <span class="footer-brand">
            ${escaparHtml(
              nomeFantasia
            )}
          </span>

        </footer>

      </main>

    </body>

    </html>
  `

  janela.document.open()
  janela.document.write(html)
  janela.document.close()
}

function formatarMoeda(valor) {
  return Number(
    valor || 0
  ).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )
}

function formatarQuantidade(valor) {
  return Number(
    valor || 0
  ).toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 2
    }
  )
}

function formatarData(data) {
  if (!data) {
    return 'Não informado'
  }

  return new Date(
    `${String(data).slice(0, 10)}T12:00:00`
  ).toLocaleDateString(
    'pt-BR'
  )
}

function nomeStatus(status) {
  const nomes = {
    rascunho: 'Rascunho',
    enviado: 'Enviado',
    aguardando_aprovacao:
      'Aguardando aprovação',
    aprovado: 'Aprovado',
    em_execucao:
      'Em execução',
    concluido: 'Concluído',
    recusado: 'Recusado',
    cancelado: 'Cancelado',
    vencido: 'Vencido'
  }

  return nomes[status] || status
}

function escaparHtml(valor) {
  return String(
    valor || ''
  )
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    )
    .replaceAll(
      "'",
      '&#039;'
    )
}