export function abrirRelatorioParaImpressao({
  inicio,
  fim,
  status,
  clienteId,
  clientes = [],
  orcamentos = [],
  ordens = [],
  valorOrcado,
  valorAprovado,
  aprovados,
  concluidas,
  novosClientes,
  empresa = {}
}) {
  const janela = window.open('', '_blank')

  if (!janela) {
    alert('O navegador bloqueou a abertura do relatório.')
    return
  }

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

  const clienteSelecionado =
    clienteId === 'todos'
      ? null
      : clientes.find(
          (cliente) =>
            String(cliente.id) === String(clienteId)
        )

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

  const linhasOrcamentos = orcamentos
    .map(
      (orcamento) => `
        <tr>
          <td>
            <strong>
              ${escaparHtml(orcamento.numero)}
            </strong>
          </td>

          <td>
            ${escaparHtml(
              orcamento.clientes?.nome ||
              'Cliente'
            )}
          </td>

          <td>
            ${formatarData(
              orcamento.data_orcamento
            )}
          </td>

          <td>
            <span class="status-inline">
              ${escaparHtml(
                nomeStatus(
                  orcamento.status
                )
              )}
            </span>
          </td>

          <td class="right strong">
            ${formatarMoeda(
              orcamento.total
            )}
          </td>
        </tr>
      `
    )
    .join('')

  const linhasOrdens = ordens
    .map(
      (ordem) => `
        <tr>
          <td>
            <strong>
              ${escaparHtml(ordem.numero)}
            </strong>
          </td>

          <td>
            ${escaparHtml(
              ordem.clientes?.nome ||
              'Cliente'
            )}
          </td>

          <td>
            ${formatarData(
              ordem.data_abertura
            )}
          </td>

          <td>
            <span class="status-inline blue">
              ${escaparHtml(
                nomeStatusOS(
                  ordem.status
                )
              )}
            </span>
          </td>

          <td>
            ${escaparHtml(
              ordem.tecnico ||
              'Não definido'
            )}
          </td>
        </tr>
      `
    )
    .join('')

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
        Relatório ${escaparHtml(nomeFantasia)}
      </title>

      <style>

        :root {
          --dark: #171b20;
          --text: #2d333a;
          --muted: #7b838e;
          --line: #e5e8ec;
          --soft: #f8f9fa;
          --yellow: #d8ad10;
          --yellow-soft: #fff8dd;
          --green-soft: #eaf7ef;
          --green: #2d7950;
          --blue-soft: #edf4ff;
          --blue: #466f9c;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #eef0f2;
          color: var(--text);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 18px auto;
          padding: 15mm;
          background: #ffffff;

          box-shadow:
            0 8px 28px
            rgba(16, 22, 29, .08);
        }

        .top-accent {
          height: 5px;

          margin:
            -15mm
            -15mm
            14mm;

          background:
            linear-gradient(
              90deg,
              var(--yellow) 0 24%,
              var(--dark) 24% 100%
            );
        }

        .header {
          display: flex;

          justify-content:
            space-between;

          gap: 28px;

          padding-bottom: 16px;

          border-bottom:
            1px solid var(--line);
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

          place-items:
            center;

          border-radius:
            12px;

          background:
            var(--yellow);

          color:
            var(--dark);

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

          color:
            var(--muted);

          font-size: 9px;
        }

        .document {
          min-width: 210px;

          text-align:
            right;
        }

        .document-badge {
          display:
            inline-block;

          margin-bottom:
            8px;

          padding:
            5px 8px;

          border-radius:
            999px;

          background:
            var(--yellow-soft);

          color:
            #8b6b07;

          font-size:
            8px;

          font-weight:
            700;

          text-transform:
            uppercase;
        }

        .document-title {
          color:
            var(--dark);

          font-size:
            19px;

          font-weight:
            800;
        }

        .document-period {
          margin-top:
            9px;

          color:
            var(--muted);

          font-size:
            9px;
        }

        .document-period strong {
          color:
            var(--text);
        }

        .section {
          margin-top:
            19px;
        }

        .section-title {
          display: flex;

          align-items:
            center;

          gap: 8px;

          margin-bottom:
            8px;

          color:
            var(--dark);

          font-size:
            9px;

          font-weight:
            800;

          letter-spacing:
            .055em;

          text-transform:
            uppercase;
        }

        .section-title::before {
          content: "";

          width: 4px;
          height: 14px;

          border-radius:
            4px;

          background:
            var(--yellow);
        }

        .filters {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 9px;
        }

        .filter {
          padding:
            10px 12px;

          border:
            1px solid var(--line);

          border-radius:
            8px;

          background:
            var(--soft);
        }

        .filter span {
          display: block;

          margin-bottom:
            4px;

          color:
            #9299a2;

          font-size:
            7.5px;

          text-transform:
            uppercase;
        }

        .filter strong {
          color:
            #3a4048;

          font-size:
            9px;
        }

        .cards {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 9px;
        }

        .card {
          min-height:
            80px;

          padding:
            12px;

          border:
            1px solid var(--line);

          border-radius:
            9px;

          background:
            #ffffff;
        }

        .card.highlight {
          background:
            var(--dark);

          border-color:
            var(--dark);
        }

        .card span {
          display: block;

          color:
            #9299a2;

          font-size:
            7.5px;

          text-transform:
            uppercase;
        }

        .card strong {
          display: block;

          margin-top:
            8px;

          color:
            var(--dark);

          font-size:
            17px;

          font-weight:
            800;
        }

        .card small {
          display: block;

          margin-top:
            5px;

          color:
            #999fa8;

          font-size:
            7.5px;
        }

        .card.highlight span,
        .card.highlight small {
          color:
            #9299a4;
        }

        .card.highlight strong {
          color:
            #ffffff;
        }

        table {
          width: 100%;

          overflow:
            hidden;

          border-collapse:
            separate;

          border-spacing:
            0;

          border:
            1px solid var(--line);

          border-radius:
            8px;
        }

        th {
          padding:
            9px 8px;

          border-bottom:
            1px solid var(--line);

          background:
            var(--dark);

          color:
            #ffffff;

          font-size:
            7.5px;

          text-align:
            left;

          text-transform:
            uppercase;

          letter-spacing:
            .04em;
        }

        td {
          padding:
            9px 8px;

          border-bottom:
            1px solid #edf0f2;

          color:
            #4a515a;

          font-size:
            8.5px;

          vertical-align:
            middle;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        tbody tr:nth-child(even) td {
          background:
            #fbfbfc;
        }

        .right {
          text-align:
            right;
        }

        .strong {
          color:
            #30363d;

          font-weight:
            700;
        }

        .status-inline {
          display:
            inline-block;

          padding:
            3px 7px;

          border-radius:
            999px;

          background:
            var(--green-soft);

          color:
            var(--green);

          font-size:
            7.5px;

          font-weight:
            700;
        }

        .status-inline.blue {
          background:
            var(--blue-soft);

          color:
            var(--blue);
        }

        .empty {
          padding:
            20px;

          border:
            1px dashed #d8dce1;

          border-radius:
            8px;

          background:
            #fbfbfc;

          color:
            #969da6;

          font-size:
            8.5px;

          text-align:
            center;
        }

        .footer {
          display: flex;

          justify-content:
            space-between;

          gap: 15px;

          margin-top:
            26px;

          padding-top:
            9px;

          border-top:
            1px solid var(--line);

          color:
            #9ba1aa;

          font-size:
            7.5px;
        }

        .footer-brand {
          color:
            #81700f;

          font-weight:
            700;
        }

        .actions {
          position:
            fixed;

          top: 14px;
          right: 14px;

          display:
            flex;

          gap:
            8px;
        }

        .actions button {
          padding:
            10px 14px;

          border-radius:
            8px;

          font-size:
            10px;

          cursor:
            pointer;
        }

        .close {
          border:
            1px solid #d5d9de;

          background:
            #ffffff;

          color:
            #4f5660;
        }

        .print {
          border: 0;

          background:
            var(--dark);

          color:
            #ffffff;
        }

        @media print {

          body {
            background:
              #ffffff;
          }

          .page {
            width: auto;

            min-height: auto;

            margin: 0;

            padding: 11mm;

            box-shadow:
              none;
          }

          .top-accent {
            margin:
              -11mm
              -11mm
              10mm;
          }

          .actions {
            display:
              none;
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
                ${escaparHtml(
                  nomeEmpresa
                )}
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
              Relatório
            </div>

            <div class="document-title">
              Relatório gerencial
            </div>

            <div class="document-period">

              Período:

              <strong>
                ${formatarData(inicio)}
                a
                ${formatarData(fim)}
              </strong>

            </div>

          </div>

        </header>

        <section class="section">

          <div class="section-title">
            Filtros utilizados
          </div>

          <div class="filters">

            <div class="filter">

              <span>Período</span>

              <strong>
                ${formatarData(inicio)}
                a
                ${formatarData(fim)}
              </strong>

            </div>

            <div class="filter">

              <span>Status</span>

              <strong>
                ${
                  status === 'todos'
                    ? 'Todos'
                    : escaparHtml(
                        nomeStatus(status)
                      )
                }
              </strong>

            </div>

            <div class="filter">

              <span>Cliente</span>

              <strong>
                ${
                  clienteSelecionado
                    ? escaparHtml(
                        clienteSelecionado.nome
                      )
                    : 'Todos os clientes'
                }
              </strong>

            </div>

          </div>

        </section>

        <section class="section">

          <div class="section-title">
            Resumo do período
          </div>

          <div class="cards">

            <div class="card highlight">

              <span>
                Valor orçado
              </span>

              <strong>
                ${formatarMoeda(
                  valorOrcado
                )}
              </strong>

              <small>
                ${orcamentos.length}
                orçamento(s)
              </small>

            </div>

            <div class="card">

              <span>
                Valor aprovado
              </span>

              <strong>
                ${formatarMoeda(
                  valorAprovado
                )}
              </strong>

              <small>
                ${aprovados}
                aprovado(s)
              </small>

            </div>

            <div class="card">

              <span>
                OS concluídas
              </span>

              <strong>
                ${concluidas}
              </strong>

              <small>
                ${ordens.length}
                OS no período
              </small>

            </div>

            <div class="card">

              <span>
                Novos clientes
              </span>

              <strong>
                ${novosClientes}
              </strong>

              <small>
                Cadastros no período
              </small>

            </div>

          </div>

        </section>

        <section class="section">

          <div class="section-title">
            Orçamentos
          </div>

          ${
            orcamentos.length
              ? `
                <table>

                  <thead>

                    <tr>
                      <th>
                        Orçamento
                      </th>

                      <th>
                        Cliente
                      </th>

                      <th>
                        Data
                      </th>

                      <th>
                        Status
                      </th>

                      <th class="right">
                        Total
                      </th>
                    </tr>

                  </thead>

                  <tbody>
                    ${linhasOrcamentos}
                  </tbody>

                </table>
              `
              : `
                <div class="empty">
                  Nenhum orçamento encontrado no período.
                </div>
              `
          }

        </section>

        <section class="section">

          <div class="section-title">
            Ordens de Serviço
          </div>

          ${
            ordens.length
              ? `
                <table>

                  <thead>

                    <tr>

                      <th>
                        OS
                      </th>

                      <th>
                        Cliente
                      </th>

                      <th>
                        Abertura
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Técnico
                      </th>

                    </tr>

                  </thead>

                  <tbody>
                    ${linhasOrdens}
                  </tbody>

                </table>
              `
              : `
                <div class="empty">
                  Nenhuma Ordem de Serviço encontrada no período.
                </div>
              `
          }

        </section>

        <footer class="footer">

          <span>
            Relatório gerado pelo Sistema de Gestão
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
    rascunho:
      'Rascunho',

    enviado:
      'Enviado',

    aguardando_aprovacao:
      'Aguardando aprovação',

    aprovado:
      'Aprovado',

    em_execucao:
      'Em execução',

    concluido:
      'Concluído',

    recusado:
      'Recusado',

    cancelado:
      'Cancelado',

    vencido:
      'Vencido'
  }

  return nomes[status] || status
}

function nomeStatusOS(status) {
  const nomes = {
    aberta:
      'Aberta',

    agendada:
      'Agendada',

    em_execucao:
      'Em execução',

    aguardando_peca:
      'Aguardando peça',

    concluida:
      'Concluída',

    cancelada:
      'Cancelada'
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