export async function lerXmlNfe(arquivo) {
  const textoXml = await arquivo.text()

  const parser = new DOMParser()

  const xml = parser.parseFromString(
    textoXml,
    'application/xml'
  )

  const erroParser = xml.querySelector(
    'parsererror'
  )

  if (erroParser) {
    throw new Error(
      'O arquivo selecionado não é um XML válido.'
    )
  }

  const infNFe = buscarTag(
    xml,
    'infNFe'
  )

  if (!infNFe) {
    throw new Error(
      'Não foi possível identificar uma NF-e válida neste XML.'
    )
  }

  const emit = buscarTag(
    xml,
    'emit'
  )

  const ide = buscarTag(
    xml,
    'ide'
  )

  const total = buscarTag(
    xml,
    'ICMSTot'
  )

  const chaveAcesso =
    obterChaveAcesso(infNFe)

  const fornecedor = {
    cnpj: textoTag(
      emit,
      'CNPJ'
    ),

    cpf: textoTag(
      emit,
      'CPF'
    ),

    razao_social: textoTag(
      emit,
      'xNome'
    ),

    nome_fantasia: textoTag(
      emit,
      'xFant'
    ),

    inscricao_estadual: textoTag(
      emit,
      'IE'
    ),

    telefone: textoTag(
      emit,
      'fone'
    ),

    endereco: textoTag(
      emit,
      'xLgr'
    ),

    numero: textoTag(
      emit,
      'nro'
    ),

    bairro: textoTag(
      emit,
      'xBairro'
    ),

    cidade: textoTag(
      emit,
      'xMun'
    ),

    estado: textoTag(
      emit,
      'UF'
    ),

    cep: textoTag(
      emit,
      'CEP'
    )
  }

  const nota = {
    numero_nota: textoTag(
      ide,
      'nNF'
    ),

    serie: textoTag(
      ide,
      'serie'
    ),

    data_emissao:
      textoTag(
        ide,
        'dhEmi'
      ) ||
      textoTag(
        ide,
        'dEmi'
      ),

    chave_acesso: chaveAcesso,

    valor_produtos: numeroTag(
      total,
      'vProd'
    ),

    valor_frete: numeroTag(
      total,
      'vFrete'
    ),

    valor_desconto: numeroTag(
      total,
      'vDesc'
    ),

    valor_total: numeroTag(
      total,
      'vNF'
    )
  }

  const detalhes =
    buscarTodasTags(
      xml,
      'det'
    )

  const itens = detalhes.map(
    (detalhe, indice) => {
      const produto = buscarTag(
        detalhe,
        'prod'
      )

      const quantidade =
        numeroTag(
          produto,
          'qCom'
        )

      const valorUnitario =
        numeroTag(
          produto,
          'vUnCom'
        )

      const valorTotal =
        numeroTag(
          produto,
          'vProd'
        )

      const desconto =
        numeroTag(
          produto,
          'vDesc'
        )

      const frete =
        numeroTag(
          produto,
          'vFrete'
        )

      return {
        numero_item:
          Number(
            detalhe.getAttribute(
              'nItem'
            )
          ) ||
          indice + 1,

        codigo_fornecedor:
          textoTag(
            produto,
            'cProd'
          ),

        ean_gtin:
          normalizarGtin(
            textoTag(
              produto,
              'cEAN'
            )
          ),

        nome_produto:
          textoTag(
            produto,
            'xProd'
          ),

        ncm:
          textoTag(
            produto,
            'NCM'
          ),

        cfop:
          textoTag(
            produto,
            'CFOP'
          ),

        unidade:
          textoTag(
            produto,
            'uCom'
          ),

        quantidade,

        valor_unitario:
          valorUnitario,

        valor_total:
          valorTotal,

        desconto,

        frete,

        custo_unitario_final:
          calcularCustoInicial({
            quantidade,
            valorTotal,
            desconto,
            frete
          }),

        produto_id: null,

        produto_encontrado: false
      }
    }
  )

  if (!itens.length) {
    throw new Error(
      'A NF-e não possui produtos para importar.'
    )
  }

  return {
    arquivo: arquivo.name,

    fornecedor,

    nota,

    itens
  }
}

function buscarTag(elemento, nome) {
  if (!elemento) {
    return null
  }

  const elementos =
    elemento.getElementsByTagName('*')

  for (const item of elementos) {
    if (
      nomeLocal(item) === nome
    ) {
      return item
    }
  }

  return null
}

function buscarTodasTags(
  elemento,
  nome
) {
  if (!elemento) {
    return []
  }

  return Array.from(
    elemento.getElementsByTagName('*')
  ).filter(
    (item) =>
      nomeLocal(item) === nome
  )
}

function nomeLocal(elemento) {
  return (
    elemento.localName ||
    elemento.nodeName
      ?.split(':')
      .pop()
  )
}

function textoTag(
  elemento,
  nome
) {
  const tag = buscarTag(
    elemento,
    nome
  )

  if (!tag) {
    return ''
  }

  return String(
    tag.textContent || ''
  ).trim()
}

function numeroTag(
  elemento,
  nome
) {
  const valor =
    textoTag(
      elemento,
      nome
    )

  if (!valor) {
    return 0
  }

  const numero =
    Number(
      valor.replace(',', '.')
    )

  return Number.isFinite(numero)
    ? numero
    : 0
}

function obterChaveAcesso(
  infNFe
) {
  const id =
    infNFe?.getAttribute(
      'Id'
    ) || ''

  return id
    .replace(/^NFe/i, '')
    .trim()
}

function normalizarGtin(
  valor
) {
  if (!valor) {
    return ''
  }

  const normalizado =
    String(valor).trim()

  if (
    normalizado === 'SEM GTIN' ||
    normalizado === 'SEMGTIN'
  ) {
    return ''
  }

  return normalizado
}

function calcularCustoInicial({
  quantidade,
  valorTotal,
  desconto,
  frete
}) {
  const qtd =
    Number(quantidade || 0)

  if (qtd <= 0) {
    return 0
  }

  const total =
    Number(valorTotal || 0)

  const desc =
    Number(desconto || 0)

  const freteItem =
    Number(frete || 0)

  return (
    total -
    desc +
    freteItem
  ) / qtd
}