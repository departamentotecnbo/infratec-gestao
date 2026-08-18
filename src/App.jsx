import { useEffect, useState } from 'react'
import './App.css'
import './produtos-lucro.css'
import './visual-final.css'
import './login-profissional.css'
import './ajustes-finais.css'
import './dashboard-config-final.css'
import './compras-final.css'
import { lerXmlNfe } from './nfeXml'
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Package,
  BarChart3,
  Settings,
  Plus,
  UserRound,
  LogOut,
  LockKeyhole,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Boxes,
  Eye,
  CircleDollarSign,
  CheckCircle2,
  CalendarClock,
} from 'lucide-react'
import { supabase } from './supabase'
import { abrirOrcamentoParaImpressao } from './orcamentoPrint'
import { abrirRelatorioParaImpressao } from './relatorioPrint'
import { abrirOrdemServicoParaImpressao } from './osPrint'

const clienteVazio = {
  tipo_pessoa: 'fisica',
  nome: '',
  cpf_cnpj: '',
  telefone: '',
  whatsapp: '',
  email: '',
  cep: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  observacoes: ''
}

const produtoVazio = {
  tipo: 'produto',
  nome: '',
  codigo: '',
  categoria: '',
  custo: '',
  percentual_lucro: '20',
  preco_sugerido: '',
  valor_venda: '',
  estoque: '',
  unidade: 'un',
  descricao: ''
}

const orcamentoVazio = {
  cliente_id: '',
  validade: '',
  desconto: '',
  forma_pagamento: '',
  prazo_execucao: '',
  garantia: '',
  observacoes: '',
  status: 'rascunho'
}

const configuracaoVazia = {
  id: null,
  nome_fantasia: 'INFRATEC',
  razao_social: '',
  cnpj: '',
  telefone: '',
  whatsapp: '',
  email: '',
  cep: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  logo_url: '',
  observacoes: ''
}

function App() {

  const [modalImportarXml, setModalImportarXml] = useState(false)

const [xmlCarregando, setXmlCarregando] = useState(false)

const [xmlImportado, setXmlImportado] = useState(null)

const [salvandoCompra, setSalvandoCompra] = useState(false)

  const [compras, setCompras] = useState([])
  const [carregandoCompras, setCarregandoCompras] = useState(false)
  const [buscaCompra, setBuscaCompra] = useState('')

  const [modalCompraDetalhe, setModalCompraDetalhe] = useState(false)
  const [compraDetalhe, setCompraDetalhe] = useState(null)
  const [itensCompraDetalhe, setItensCompraDetalhe] = useState([])
  const [carregandoCompraDetalhe, setCarregandoCompraDetalhe] = useState(false)
  const [pagina, setPagina] = useState('dashboard')

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [entrando, setEntrando] = useState(false)

  const [clientes, setClientes] = useState([])
  const [carregandoClientes, setCarregandoClientes] = useState(false)
  const [buscaCliente, setBuscaCliente] = useState('')

  const [modalCliente, setModalCliente] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [formCliente, setFormCliente] = useState(clienteVazio)
  const [salvandoCliente, setSalvandoCliente] = useState(false)

  const [modalHistoricoCliente, setModalHistoricoCliente] = useState(false)
  const [clienteHistorico, setClienteHistorico] = useState(null)

  const [produtos, setProdutos] = useState([])
  const [carregandoProdutos, setCarregandoProdutos] = useState(false)
  const [buscaProduto, setBuscaProduto] = useState('')
  const [filtroTipoProduto, setFiltroTipoProduto] = useState('todos')

  const [modalProduto, setModalProduto] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [formProduto, setFormProduto] = useState(produtoVazio)
  const [salvandoProduto, setSalvandoProduto] = useState(false)

  const [orcamentos, setOrcamentos] = useState([])
  const [carregandoOrcamentos, setCarregandoOrcamentos] = useState(false)
  const [buscaOrcamento, setBuscaOrcamento] = useState('')
  const [filtroStatusOrcamento, setFiltroStatusOrcamento] = useState('todos')

  const [modalOrcamento, setModalOrcamento] = useState(false)
  const [orcamentoEditando, setOrcamentoEditando] = useState(null)
  const [formOrcamento, setFormOrcamento] = useState(orcamentoVazio)
  const [itensOrcamento, setItensOrcamento] = useState([])
  const [salvandoOrcamento, setSalvandoOrcamento] = useState(false)

  const [recebimentos, setRecebimentos] = useState([])
  const [modalRecebimento, setModalRecebimento] = useState(false)
  const [orcamentoRecebimento, setOrcamentoRecebimento] = useState(null)
  const [historicoRecebimentos, setHistoricoRecebimentos] = useState([])
  const [carregandoRecebimentos, setCarregandoRecebimentos] = useState(false)
  const [salvandoRecebimento, setSalvandoRecebimento] = useState(false)
  const [formRecebimento, setFormRecebimento] = useState({
    valor: '',
    forma_pagamento: 'PIX',
    observacoes: ''
  })
  const [ordens, setOrdens] = useState([])
const [carregandoOrdens, setCarregandoOrdens] = useState(false)
const [buscaOrdem, setBuscaOrdem] = useState('')

const [modalOrdem, setModalOrdem] = useState(false)
const [ordemEditando, setOrdemEditando] = useState(null)

const [formOrdem, setFormOrdem] = useState({
  status: 'aberta',
  tecnico: '',
  data_agendamento: '',
  problema_relatado: '',
  servico_executado: '',
  observacoes: ''
})

const [salvandoOrdem, setSalvandoOrdem] = useState(false)

  const [relatorioInicio, setRelatorioInicio] = useState(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    return `${ano}-${mes}-01`
  })

  const [relatorioFim, setRelatorioFim] = useState(() => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  })

  const [relatorioStatus, setRelatorioStatus] = useState('todos')
  const [relatorioCliente, setRelatorioCliente] = useState('todos')

  const [configuracao, setConfiguracao] = useState(configuracaoVazia)
  const [carregandoConfiguracao, setCarregandoConfiguracao] = useState(false)
  const [salvandoConfiguracao, setSalvandoConfiguracao] = useState(false)

  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('sucesso')

  useEffect(() => {
    verificarSessao()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, novaSessao) => {
      setSession(novaSessao)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
   if (session) {
  carregarClientes()
  carregarProdutos()
  carregarOrcamentos()
  carregarOrdens()
  carregarRecebimentos()
  carregarCompras()
  carregarConfiguracao()
}
  }, [session])

  async function verificarSessao() {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    setSession(session)
    setLoading(false)
  }

  async function fazerLogin(evento) {
    evento.preventDefault()

    setErro('')
    setEntrando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    if (error) {
      setErro('E-mail ou senha incorretos.')
      setEntrando(false)
      return
    }

    setEntrando(false)
  }

  async function sair() {
    await supabase.auth.signOut()

    setPagina('dashboard')
    setClientes([])
    setProdutos([])
    setOrcamentos([])
  }

  function mostrarMensagem(texto, tipo = 'sucesso') {
    setMensagem(texto)
    setTipoMensagem(tipo)

    setTimeout(() => {
      setMensagem('')
    }, 3500)
  }

  function selecionarPagina(novaPagina) {
    setPagina(novaPagina)

    if (novaPagina === 'clientes') {
      carregarClientes()
    }

    if (novaPagina === 'produtos') {
      carregarProdutos()
    }

    if (novaPagina === 'compras') {
      carregarCompras()
      carregarProdutos()
    }

    if (novaPagina === 'dashboard') {
      carregarOrcamentos()
      carregarOrdens()
      carregarRecebimentos()
    }

    if (novaPagina === 'orcamentos') {
      carregarOrcamentos()
      carregarRecebimentos()
    }
    if (novaPagina === 'ordens') {
  carregarOrdens()
}

    if (novaPagina === 'relatorios') {
      carregarClientes()
      carregarOrcamentos()
      carregarOrdens()
      carregarRecebimentos()
    }

    if (novaPagina === 'configuracoes') {
      carregarConfiguracao()
    }
  }

  /* COMPRAS */

  async function carregarCompras() {
    setCarregandoCompras(true)

    const { data, error } = await supabase
      .from('compras')
      .select(`
        *,
        fornecedores (
          id,
          razao_social,
          nome_fantasia,
          cnpj
        ),
        compra_itens (
          id
        )
      `)
      .order('data_emissao', {
        ascending: false,
        nullsFirst: false
      })
      .order('created_at', {
        ascending: false
      })

    if (error) {
      console.error(error)

      mostrarMensagem(
        'Não foi possível carregar as compras.',
        'erro'
      )

      setCarregandoCompras(false)
      return []
    }

    const lista = data || []

    setCompras(lista)
    setCarregandoCompras(false)

    return lista
  }

  async function abrirDetalheCompra(compra) {
    setCompraDetalhe(compra)
    setItensCompraDetalhe([])
    setModalCompraDetalhe(true)
    setCarregandoCompraDetalhe(true)

    const { data, error } = await supabase
      .from('compra_itens')
      .select(`
        *,
        produtos (
          id,
          nome,
          valor_venda,
          preco_sugerido,
          percentual_lucro
        )
      `)
      .eq('compra_id', compra.id)
      .order('id', { ascending: true })

    if (error) {
      console.error(error)

      mostrarMensagem(
        'Não foi possível carregar os itens da compra.',
        'erro'
      )

      setItensCompraDetalhe([])
    } else {
      setItensCompraDetalhe(data || [])
    }

    setCarregandoCompraDetalhe(false)
  }

  function fecharDetalheCompra() {
    setModalCompraDetalhe(false)
    setCompraDetalhe(null)
    setItensCompraDetalhe([])
  }

  /* IMPORTAÇÃO DE XML / COMPRAS */

  function abrirImportacaoXml() {
    setXmlImportado(null)
    setModalImportarXml(true)
  }

  function fecharImportacaoXml() {
    if (salvandoCompra) return

    setModalImportarXml(false)
    setXmlImportado(null)
    setXmlCarregando(false)
  }

  async function selecionarXmlNfe(evento) {
    const arquivo = evento.target.files?.[0]

    if (!arquivo) return

    try {
      setXmlCarregando(true)

      const dados = await lerXmlNfe(arquivo)

      const itensComProduto = dados.itens.map((item) => {
        let produtoEncontrado = null

        if (item.ean_gtin) {
          produtoEncontrado = produtos.find(
            (produto) =>
              String(produto.ean_gtin || '') ===
              String(item.ean_gtin)
          )
        }

        if (!produtoEncontrado && item.codigo_fornecedor) {
          produtoEncontrado = produtos.find(
            (produto) =>
              String(produto.codigo_fornecedor || '') ===
              String(item.codigo_fornecedor)
          )
        }

        const percentualLucro = Number(
          produtoEncontrado?.percentual_lucro || 20
        )

        return {
          ...item,
          produto_id: produtoEncontrado?.id || null,
          produto_encontrado: Boolean(produtoEncontrado),
          percentual_lucro: percentualLucro,
          preco_sugerido: calcularPrecoSugerido(
            item.custo_unitario_final,
            percentualLucro
          ),
          valor_venda_atual: Number(
            produtoEncontrado?.valor_venda || 0
          )
        }
      })

      setXmlImportado({
        ...dados,
        itens: itensComProduto
      })
    } catch (error) {
      console.error(error)

      mostrarMensagem(
        error.message || 'Não foi possível ler o XML.',
        'erro'
      )

      setXmlImportado(null)
    } finally {
      setXmlCarregando(false)
      evento.target.value = ''
    }
  }

  function calcularPrecoSugerido(custo, percentual) {
    const valorCusto = Number(custo || 0)
    const lucro = Number(percentual || 0)

    return valorCusto * (1 + lucro / 100)
  }

  function alterarLucroItemXml(indice, novoPercentual) {
    setXmlImportado((anterior) => {
      if (!anterior) return anterior

      const itens = [...anterior.itens]
      const item = itens[indice]
      const percentual = Number(novoPercentual || 0)

      itens[indice] = {
        ...item,
        percentual_lucro: percentual,
        preco_sugerido: calcularPrecoSugerido(
          item.custo_unitario_final,
          percentual
        )
      }

      return {
        ...anterior,
        itens
      }
    })
  }

  async function confirmarEntradaXml() {
    if (!xmlImportado) return

    try {
      setSalvandoCompra(true)

      const fornecedorXml = xmlImportado.fornecedor
      let fornecedorId = null

      if (fornecedorXml.cnpj) {
        const { data, error } = await supabase
          .from('fornecedores')
          .select('id')
          .eq('cnpj', fornecedorXml.cnpj)
          .maybeSingle()

        if (error) throw error

        fornecedorId = data?.id || null
      }

      if (!fornecedorId) {
        const { data, error } = await supabase
          .from('fornecedores')
          .insert([
            {
              razao_social:
                fornecedorXml.razao_social || 'Fornecedor',
              nome_fantasia:
                fornecedorXml.nome_fantasia || null,
              cnpj: fornecedorXml.cnpj || null,
              inscricao_estadual:
                fornecedorXml.inscricao_estadual || null,
              telefone:
                fornecedorXml.telefone || null,
              endereco:
                fornecedorXml.endereco || null,
              numero:
                fornecedorXml.numero || null,
              bairro:
                fornecedorXml.bairro || null,
              cidade:
                fornecedorXml.cidade || null,
              estado:
                fornecedorXml.estado || null,
              cep:
                fornecedorXml.cep || null
            }
          ])
          .select()
          .single()

        if (error) throw error

        fornecedorId = data.id
      }

      const { data: compra, error: erroCompra } = await supabase
        .from('compras')
        .insert([
          {
            fornecedor_id: fornecedorId,
            numero_nota: xmlImportado.nota.numero_nota,
            serie: xmlImportado.nota.serie,
            chave_acesso: xmlImportado.nota.chave_acesso,
            data_emissao:
              xmlImportado.nota.data_emissao || null,
            valor_produtos:
              xmlImportado.nota.valor_produtos,
            valor_frete:
              xmlImportado.nota.valor_frete,
            valor_desconto:
              xmlImportado.nota.valor_desconto,
            valor_total:
              xmlImportado.nota.valor_total,
            origem: 'xml',
            nome_arquivo_xml:
              xmlImportado.arquivo,
            xml_importado: true
          }
        ])
        .select()
        .single()

      if (erroCompra) throw erroCompra

      for (const item of xmlImportado.itens) {
        let produtoId = item.produto_id

        if (!produtoId) {
          const { data, error } = await supabase
            .from('produtos')
            .insert([
              {
                tipo: 'produto',
                nome: item.nome_produto,
                codigo:
                  item.codigo_fornecedor || null,
                codigo_fornecedor:
                  item.codigo_fornecedor || null,
                ean_gtin:
                  item.ean_gtin || null,
                ncm: item.ncm || null,
                unidade: item.unidade || 'UN',
                custo:
                  item.custo_unitario_final,
                custo_ultima_compra:
                  item.custo_unitario_final,
                percentual_lucro:
                  item.percentual_lucro,
                preco_sugerido:
                  item.preco_sugerido,
                valor_venda:
                  item.preco_sugerido,
                ultima_compra_em:
                  new Date().toISOString(),
                ativo: true
              }
            ])
            .select()
            .single()

          if (error) throw error

          produtoId = data.id
        } else {
          const { error } = await supabase
            .from('produtos')
            .update({
              custo:
                item.custo_unitario_final,
              custo_ultima_compra:
                item.custo_unitario_final,
              percentual_lucro:
                item.percentual_lucro,
              preco_sugerido:
                item.preco_sugerido,
              codigo_fornecedor:
                item.codigo_fornecedor || null,
              ean_gtin:
                item.ean_gtin || null,
              ncm:
                item.ncm || null,
              ultima_compra_em:
                new Date().toISOString(),
              updated_at:
                new Date().toISOString()
            })
            .eq('id', produtoId)

          if (error) throw error
        }

        const { error: erroItem } = await supabase
          .from('compra_itens')
          .insert([
            {
              compra_id: compra.id,
              produto_id: produtoId,
              codigo_fornecedor:
                item.codigo_fornecedor || null,
              ean_gtin:
                item.ean_gtin || null,
              nome_produto:
                item.nome_produto,
              ncm:
                item.ncm || null,
              cfop:
                item.cfop || null,
              unidade:
                item.unidade || null,
              quantidade:
                item.quantidade,
              valor_unitario:
                item.valor_unitario,
              valor_total:
                item.valor_total,
              desconto:
                item.desconto,
              frete:
                item.frete,
              custo_unitario_final:
                item.custo_unitario_final
            }
          ])

        if (erroItem) throw erroItem
      }

      await Promise.all([
        carregarProdutos(),
        carregarCompras()
      ])

      setXmlImportado(null)
      setModalImportarXml(false)

      mostrarMensagem('Compra importada com sucesso.')
    } catch (error) {
      console.error(error)

      const mensagemErro = String(error?.message || '')

      if (
        mensagemErro.includes('compras_chave_acesso_unique') ||
        mensagemErro.toLowerCase().includes('duplicate key')
      ) {
        mostrarMensagem(
          'Esta NF-e já foi importada anteriormente.',
          'erro'
        )
      } else {
        mostrarMensagem(
          'Não foi possível concluir a importação.',
          'erro'
        )
      }
    } finally {
      setSalvandoCompra(false)
    }
  }

  /* CONFIGURAÇÕES DA EMPRESA */

  async function carregarConfiguracao() {
    setCarregandoConfiguracao(true)

    const { data, error } = await supabase
      .from('configuracoes_empresa')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error(error)

      mostrarMensagem(
        'Não foi possível carregar as configurações da empresa.',
        'erro'
      )

      setCarregandoConfiguracao(false)
      return
    }

    if (data) {
      setConfiguracao({
        id: data.id,
        nome_fantasia: data.nome_fantasia || 'INFRATEC',
        razao_social: data.razao_social || '',
        cnpj: data.cnpj || '',
        telefone: data.telefone || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        cep: data.cep || '',
        endereco: data.endereco || '',
        numero: data.numero || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        estado: data.estado || '',
        logo_url: data.logo_url || '',
        observacoes: data.observacoes || ''
      })
    } else {
      setConfiguracao(configuracaoVazia)
    }

    setCarregandoConfiguracao(false)
  }

  function alterarCampoConfiguracao(evento) {
    const { name, value } = evento.target

    let novoValor = value

    if (name === 'estado') {
      novoValor = value.toUpperCase().slice(0, 2)
    }

    setConfiguracao((anterior) => ({
      ...anterior,
      [name]: novoValor
    }))
  }

  async function salvarConfiguracao(evento) {
    evento.preventDefault()

    if (!String(configuracao.nome_fantasia || '').trim()) {
      mostrarMensagem(
        'Informe o nome fantasia da empresa.',
        'erro'
      )
      return
    }

    setSalvandoConfiguracao(true)

    const dados = {
      nome_fantasia: String(configuracao.nome_fantasia || '').trim(),
      razao_social: String(configuracao.razao_social || '').trim() || null,
      cnpj: String(configuracao.cnpj || '').trim() || null,
      telefone: String(configuracao.telefone || '').trim() || null,
      whatsapp: String(configuracao.whatsapp || '').trim() || null,
      email: String(configuracao.email || '').trim() || null,
      cep: String(configuracao.cep || '').trim() || null,
      endereco: String(configuracao.endereco || '').trim() || null,
      numero: String(configuracao.numero || '').trim() || null,
      bairro: String(configuracao.bairro || '').trim() || null,
      cidade: String(configuracao.cidade || '').trim() || null,
      estado: String(configuracao.estado || '').trim() || null,
      logo_url: String(configuracao.logo_url || '').trim() || null,
      observacoes: String(configuracao.observacoes || '').trim() || null,
      updated_at: new Date().toISOString()
    }

    let resultado

    if (configuracao.id) {
      resultado = await supabase
        .from('configuracoes_empresa')
        .update(dados)
        .eq('id', configuracao.id)
        .select()
        .single()
    } else {
      resultado = await supabase
        .from('configuracoes_empresa')
        .insert([dados])
        .select()
        .single()
    }

    if (resultado.error) {
      console.error(resultado.error)

      mostrarMensagem(
        'Não foi possível salvar as configurações.',
        'erro'
      )

      setSalvandoConfiguracao(false)
      return
    }

    setConfiguracao({
      ...configuracaoVazia,
      ...resultado.data
    })

    setSalvandoConfiguracao(false)

    mostrarMensagem(
      'Configurações da empresa salvas com sucesso.'
    )
  }

  /* CLIENTES */

  async function carregarClientes() {
    setCarregandoClientes(true)

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })

    if (error) {
      console.error(error)
      mostrarMensagem('Não foi possível carregar os clientes.', 'erro')
      setCarregandoClientes(false)
      return []
    }

    const lista = data || []
    setClientes(lista)
    setCarregandoClientes(false)

    return lista
  }

  function abrirNovoCliente() {
    setClienteEditando(null)
    setFormCliente(clienteVazio)
    setModalCliente(true)
  }

  function abrirHistoricoCliente(cliente) {
    setClienteHistorico(cliente)
    setModalHistoricoCliente(true)
  }

  function fecharHistoricoCliente() {
    setModalHistoricoCliente(false)
    setClienteHistorico(null)
  }

  function abrirEdicaoCliente(cliente) {
    setClienteEditando(cliente)

    setFormCliente({
      tipo_pessoa: cliente.tipo_pessoa || 'fisica',
      nome: cliente.nome || '',
      cpf_cnpj: cliente.cpf_cnpj || '',
      telefone: cliente.telefone || '',
      whatsapp: cliente.whatsapp || '',
      email: cliente.email || '',
      cep: cliente.cep || '',
      endereco: cliente.endereco || '',
      numero: cliente.numero || '',
      bairro: cliente.bairro || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || '',
      observacoes: cliente.observacoes || ''
    })

    setModalCliente(true)
  }

  function fecharModalCliente() {
    if (salvandoCliente) return

    setModalCliente(false)
    setClienteEditando(null)
    setFormCliente(clienteVazio)
  }

  function alterarCampoCliente(evento) {
    const { name, value } = evento.target

    let novoValor = value

    if (name === 'estado') {
      novoValor = value.toUpperCase().slice(0, 2)
    }

    setFormCliente((anterior) => ({
      ...anterior,
      [name]: novoValor
    }))
  }

  async function salvarCliente(evento) {
    evento.preventDefault()

    if (!formCliente.nome.trim()) {
      mostrarMensagem('Informe o nome do cliente.', 'erro')
      return
    }

    setSalvandoCliente(true)

    const dadosCliente = {
      tipo_pessoa: formCliente.tipo_pessoa,
      nome: formCliente.nome.trim(),
      cpf_cnpj: formCliente.cpf_cnpj.trim() || null,
      telefone: formCliente.telefone.trim() || null,
      whatsapp: formCliente.whatsapp.trim() || null,
      email: formCliente.email.trim() || null,
      cep: formCliente.cep.trim() || null,
      endereco: formCliente.endereco.trim() || null,
      numero: formCliente.numero.trim() || null,
      bairro: formCliente.bairro.trim() || null,
      cidade: formCliente.cidade.trim() || null,
      estado: formCliente.estado.trim() || null,
      observacoes: formCliente.observacoes.trim() || null,
      updated_at: new Date().toISOString()
    }

    let resultado

    if (clienteEditando) {
      resultado = await supabase
        .from('clientes')
        .update(dadosCliente)
        .eq('id', clienteEditando.id)
    } else {
      resultado = await supabase
        .from('clientes')
        .insert([dadosCliente])
    }

    if (resultado.error) {
      console.error(resultado.error)
      mostrarMensagem('Erro ao salvar cliente.', 'erro')
      setSalvandoCliente(false)
      return
    }

    await carregarClientes()

    setModalCliente(false)
    setClienteEditando(null)
    setFormCliente(clienteVazio)
    setSalvandoCliente(false)

    mostrarMensagem(
      clienteEditando
        ? 'Cliente atualizado com sucesso.'
        : 'Cliente cadastrado com sucesso.'
    )
  }

  async function excluirCliente(cliente) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o cliente "${cliente.nome}"?`
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('clientes')
      .update({
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', cliente.id)

    if (error) {
      console.error(error)
      mostrarMensagem('Não foi possível excluir o cliente.', 'erro')
      return
    }

    await carregarClientes()
    mostrarMensagem('Cliente excluído com sucesso.')
  }

  /* PRODUTOS */

  async function carregarProdutos() {
    setCarregandoProdutos(true)

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true })

    if (error) {
      console.error(error)
      mostrarMensagem(
        'Não foi possível carregar os produtos e serviços.',
        'erro'
      )
      setCarregandoProdutos(false)
      return []
    }

    const lista = data || []
    setProdutos(lista)
    setCarregandoProdutos(false)

    return lista
  }

  function abrirNovoProduto(tipo = 'produto') {
    setProdutoEditando(null)

    setFormProduto({
      ...produtoVazio,
      tipo
    })

    setModalProduto(true)
  }

  function abrirEdicaoProduto(produto) {
    setProdutoEditando(produto)

    const custoAtual = Number(
      produto.custo_ultima_compra ||
      produto.custo ||
      0
    )

    const percentualAtual = Number(
      produto.percentual_lucro || 20
    )

    const sugeridoAtual =
      Number(produto.preco_sugerido) > 0
        ? Number(produto.preco_sugerido)
        : custoAtual * (1 + percentualAtual / 100)

    setFormProduto({
      tipo: produto.tipo || 'produto',
      nome: produto.nome || '',
      codigo: produto.codigo || '',
      categoria: produto.categoria || '',
      custo:
        produto.custo !== null
          ? String(produto.custo)
          : '',
      percentual_lucro:
        String(percentualAtual),
      preco_sugerido:
        String(
          Number(sugeridoAtual.toFixed(2))
        ),
      valor_venda:
        produto.valor_venda !== null
          ? String(produto.valor_venda)
          : '',
      estoque:
        produto.estoque !== null
          ? String(produto.estoque)
          : '',
      unidade: produto.unidade || 'un',
      descricao: produto.descricao || ''
    })

    setModalProduto(true)
  }

  function fecharModalProduto() {
    if (salvandoProduto) return

    setModalProduto(false)
    setProdutoEditando(null)
    setFormProduto(produtoVazio)
  }

  function alterarCampoProduto(evento) {
    const { name, value } = evento.target

    setFormProduto((anterior) => {
      const novosDados = {
        ...anterior,
        [name]: value
      }

      if (name === 'tipo' && value === 'servico') {
        novosDados.estoque = '0'
        novosDados.unidade = 'serv'
        novosDados.percentual_lucro = ''
        novosDados.preco_sugerido = ''
      }

      if (
        name === 'tipo' &&
        value === 'produto' &&
        anterior.unidade === 'serv'
      ) {
        novosDados.unidade = 'un'
        novosDados.percentual_lucro =
          anterior.percentual_lucro || '20'
      }

      if (
        novosDados.tipo === 'produto' &&
        (
          name === 'custo' ||
          name === 'percentual_lucro' ||
          name === 'tipo'
        )
      ) {
        const custo = Number(
          String(novosDados.custo || '0')
            .replace(',', '.')
        )

        const percentual = Number(
          String(
            novosDados.percentual_lucro || '0'
          ).replace(',', '.')
        )

        if (
          Number.isFinite(custo) &&
          Number.isFinite(percentual)
        ) {
          novosDados.preco_sugerido =
            String(
              Number(
                (
                  custo *
                  (1 + percentual / 100)
                ).toFixed(2)
              )
            )
        }
      }

      return novosDados
    })
  }

  async function salvarProduto(evento) {
    evento.preventDefault()

    if (!formProduto.nome.trim()) {
      mostrarMensagem('Informe o nome do produto ou serviço.', 'erro')
      return
    }

    const valorVenda = Number(formProduto.valor_venda || 0)
    const custo = Number(formProduto.custo || 0)
    const percentualLucro =
      formProduto.tipo === 'produto'
        ? Number(formProduto.percentual_lucro || 0)
        : 0

    const precoSugerido =
      formProduto.tipo === 'produto'
        ? Number(formProduto.preco_sugerido || 0)
        : 0

    const estoque = Number(formProduto.estoque || 0)

    setSalvandoProduto(true)

    const dadosProduto = {
      tipo: formProduto.tipo,
      nome: formProduto.nome.trim(),
      codigo: formProduto.codigo.trim() || null,
      categoria: formProduto.categoria.trim() || null,
      custo,
      custo_ultima_compra:
        formProduto.tipo === 'produto'
          ? custo
          : 0,
      percentual_lucro:
        percentualLucro,
      preco_sugerido:
        precoSugerido,
      tipo_calculo_preco:
        formProduto.tipo === 'produto'
          ? 'sobre_custo'
          : 'sobre_custo',
      valor_venda: valorVenda,
      estoque: formProduto.tipo === 'servico' ? 0 : estoque,
      unidade:
        formProduto.tipo === 'servico'
          ? 'serv'
          : formProduto.unidade,
      descricao: formProduto.descricao.trim() || null,
      updated_at: new Date().toISOString()
    }

    let resultado

    if (produtoEditando) {
      resultado = await supabase
        .from('produtos')
        .update(dadosProduto)
        .eq('id', produtoEditando.id)
    } else {
      resultado = await supabase
        .from('produtos')
        .insert([dadosProduto])
    }

    if (resultado.error) {
      console.error(resultado.error)
      mostrarMensagem('Erro ao salvar produto ou serviço.', 'erro')
      setSalvandoProduto(false)
      return
    }

    await carregarProdutos()

    setModalProduto(false)
    setProdutoEditando(null)
    setFormProduto(produtoVazio)
    setSalvandoProduto(false)

    mostrarMensagem(
      produtoEditando
        ? 'Cadastro atualizado com sucesso.'
        : 'Cadastro realizado com sucesso.'
    )
  }

  async function excluirProduto(produto) {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${produto.nome}"?`
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('produtos')
      .update({
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', produto.id)

    if (error) {
      console.error(error)
      mostrarMensagem('Não foi possível excluir o cadastro.', 'erro')
      return
    }

    await carregarProdutos()
    mostrarMensagem('Cadastro excluído com sucesso.')
  }

  /* RECEBIMENTOS */

  async function carregarRecebimentos() {
    const { data, error } = await supabase
      .from('recebimentos')
      .select('*')
      .order('data_recebimento', { ascending: false })

    if (error) {
      console.error(error)
      return []
    }

    const lista = data || []
    setRecebimentos(lista)

    return lista
  }

  async function abrirRecebimentos(orcamento) {
    setOrcamentoRecebimento(orcamento)
    setModalRecebimento(true)
    setCarregandoRecebimentos(true)

    setFormRecebimento({
      valor: '',
      forma_pagamento:
        orcamento.forma_pagamento || 'PIX',
      observacoes: ''
    })

    const { data, error } = await supabase
      .from('recebimentos')
      .select('*')
      .eq('orcamento_id', orcamento.id)
      .order('data_recebimento', { ascending: false })

    if (error) {
      console.error(error)
      mostrarMensagem(
        'Não foi possível carregar os recebimentos.',
        'erro'
      )
      setHistoricoRecebimentos([])
    } else {
      setHistoricoRecebimentos(data || [])
    }

    setCarregandoRecebimentos(false)
  }

  function fecharModalRecebimento() {
    if (salvandoRecebimento) return

    setModalRecebimento(false)
    setOrcamentoRecebimento(null)
    setHistoricoRecebimentos([])
    setFormRecebimento({
      valor: '',
      forma_pagamento: 'PIX',
      observacoes: ''
    })
  }

  function alterarCampoRecebimento(evento) {
    const { name, value } = evento.target

    setFormRecebimento((anterior) => ({
      ...anterior,
      [name]: value
    }))
  }

  async function atualizarResumoPagamento(
    orcamento,
    lista
  ) {
    const totalPago = lista.reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    )

    const totalOrcamento = Number(
      orcamento.total || 0
    )

    let statusPagamento = 'pendente'

    if (
      totalPago > 0 &&
      totalPago < totalOrcamento
    ) {
      statusPagamento = 'parcial'
    }

    if (
      totalOrcamento > 0 &&
      totalPago >= totalOrcamento
    ) {
      statusPagamento = 'pago'
    }

    const { error } = await supabase
      .from('orcamentos')
      .update({
        valor_pago: totalPago,
        status_pagamento: statusPagamento,
        data_pagamento:
          statusPagamento === 'pago'
            ? new Date().toISOString()
            : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orcamento.id)

    if (error) throw error
  }

  async function registrarRecebimento(evento) {
    evento.preventDefault()

    if (!orcamentoRecebimento) return

    const valor = Number(
      String(formRecebimento.valor || '')
        .replace(',', '.')
    )

    if (!valor || valor <= 0) {
      mostrarMensagem(
        'Informe um valor de recebimento válido.',
        'erro'
      )
      return
    }

    const totalOrcamento = Number(
      orcamentoRecebimento.total || 0
    )

    const jaRecebido =
      historicoRecebimentos.reduce(
        (total, item) =>
          total + Number(item.valor || 0),
        0
      )

    const saldo = Math.max(
      0,
      totalOrcamento - jaRecebido
    )

    if (valor > saldo + 0.009) {
      mostrarMensagem(
        `O valor é maior que o saldo de ${formatarMoeda(saldo)}.`,
        'erro'
      )
      return
    }

    setSalvandoRecebimento(true)

    const { data, error } = await supabase
      .from('recebimentos')
      .insert([
        {
          orcamento_id: orcamentoRecebimento.id,
          valor,
          forma_pagamento:
            formRecebimento.forma_pagamento || null,
          observacoes:
            formRecebimento.observacoes.trim() || null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error(error)
      mostrarMensagem(
        'Não foi possível registrar o recebimento.',
        'erro'
      )
      setSalvandoRecebimento(false)
      return
    }

    const novaLista = [
      data,
      ...historicoRecebimentos
    ]

    try {
      await atualizarResumoPagamento(
        orcamentoRecebimento,
        novaLista
      )
    } catch (error) {
      console.error(error)
      mostrarMensagem(
        'Recebimento salvo, mas houve erro ao atualizar o resumo.',
        'erro'
      )
      setSalvandoRecebimento(false)
      return
    }

    setHistoricoRecebimentos(novaLista)
    setFormRecebimento({
      valor: '',
      forma_pagamento:
        formRecebimento.forma_pagamento || 'PIX',
      observacoes: ''
    })

    await Promise.all([
      carregarOrcamentos(),
      carregarRecebimentos()
    ])

    setSalvandoRecebimento(false)
    mostrarMensagem(
      'Recebimento registrado com sucesso.'
    )
  }

  async function excluirRecebimento(recebimento) {
    if (!orcamentoRecebimento) return

    const confirmar = window.confirm(
      `Excluir o recebimento de ${formatarMoeda(recebimento.valor)}?`
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('recebimentos')
      .delete()
      .eq('id', recebimento.id)

    if (error) {
      console.error(error)
      mostrarMensagem(
        'Não foi possível excluir o recebimento.',
        'erro'
      )
      return
    }

    const novaLista =
      historicoRecebimentos.filter(
        (item) => item.id !== recebimento.id
      )

    try {
      await atualizarResumoPagamento(
        orcamentoRecebimento,
        novaLista
      )
    } catch (error) {
      console.error(error)
    }

    setHistoricoRecebimentos(novaLista)

    await Promise.all([
      carregarOrcamentos(),
      carregarRecebimentos()
    ])

    mostrarMensagem(
      'Recebimento excluído com sucesso.'
    )
  }

  /* ORÇAMENTOS */

  async function carregarOrcamentos() {
    setCarregandoOrcamentos(true)

    const { data, error } = await supabase
      .from('orcamentos')
      .select(`
        *,
        clientes (
          id,
          nome,
          cpf_cnpj,
          telefone,
          whatsapp
        )
      `)
      .eq('ativo', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      mostrarMensagem('Não foi possível carregar os orçamentos.', 'erro')
    } else {
      setOrcamentos(data || [])
    }

    setCarregandoOrcamentos(false)
  }

  async function abrirNovoOrcamento() {
    const validade = new Date()
    validade.setDate(validade.getDate() + 7)

    await Promise.all([
      carregarClientes(),
      carregarProdutos()
    ])

    setOrcamentoEditando(null)

    setFormOrcamento({
      ...orcamentoVazio,
      validade: validade.toISOString().split('T')[0]
    })

    setItensOrcamento([])
    setModalOrcamento(true)
  }
async function visualizarOrcamento(orcamento) {
  const { data: itens, error } = await supabase
    .from('orcamento_itens')
    .select('*')
    .eq('orcamento_id', orcamento.id)
    .order('id', { ascending: true })

  if (error) {
    console.error(error)

    mostrarMensagem(
      'Não foi possível abrir o orçamento.',
      'erro'
    )

    return
  }

  const cliente = clientes.find(
    (item) =>
      String(item.id) === String(orcamento.cliente_id)
  )

  abrirOrcamentoParaImpressao({
    orcamento,
    cliente,
    itens: itens || [],
    empresa: configuracao
  })
}
  async function abrirEdicaoOrcamento(orcamento) {
    const { data: itens, error } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('orcamento_id', orcamento.id)
      .order('id', { ascending: true })

    if (error) {
      console.error(error)
      mostrarMensagem('Não foi possível abrir o orçamento.', 'erro')
      return
    }

    setOrcamentoEditando(orcamento)

    setFormOrcamento({
      cliente_id: String(orcamento.cliente_id),
      validade: orcamento.validade || '',
      desconto: String(orcamento.desconto || ''),
      forma_pagamento: orcamento.forma_pagamento || '',
      prazo_execucao: orcamento.prazo_execucao || '',
      garantia: orcamento.garantia || '',
      observacoes: orcamento.observacoes || '',
      status: orcamento.status || 'rascunho'
    })

    setItensOrcamento(
      (itens || []).map((item) => ({
        produto_id: item.produto_id,
        nome: item.nome,
        tipo: item.tipo,
        quantidade: Number(item.quantidade),
        valor_unitario: Number(item.valor_unitario)
      }))
    )

    setModalOrcamento(true)
  }

  function fecharModalOrcamento() {
    if (salvandoOrcamento) return

    setModalOrcamento(false)
    setOrcamentoEditando(null)
    setFormOrcamento(orcamentoVazio)
    setItensOrcamento([])
  }

  function alterarCampoOrcamento(evento) {
    const { name, value } = evento.target

    setFormOrcamento((anterior) => ({
      ...anterior,
      [name]: value
    }))
  }

  function adicionarItemOrcamento(produtoId) {
    if (!produtoId) return

    const produto = produtos.find(
      (item) => String(item.id) === String(produtoId)
    )

    if (!produto) return

    const existente = itensOrcamento.find(
      (item) => String(item.produto_id) === String(produto.id)
    )

    if (existente) {
      setItensOrcamento((anteriores) =>
        anteriores.map((item) =>
          String(item.produto_id) === String(produto.id)
            ? {
                ...item,
                quantidade: Number(item.quantidade) + 1
              }
            : item
        )
      )

      return
    }

    setItensOrcamento((anteriores) => [
      ...anteriores,
      {
        produto_id: produto.id,
        nome: produto.nome,
        tipo: produto.tipo,
        quantidade: 1,
        valor_unitario: Number(produto.valor_venda || 0)
      }
    ])
  }

  function alterarItemOrcamento(indice, campo, valor) {
    setItensOrcamento((anteriores) =>
      anteriores.map((item, itemIndice) => {
        if (itemIndice !== indice) return item

        return {
          ...item,
          [campo]: valor
        }
      })
    )
  }

  function removerItemOrcamento(indice) {
    setItensOrcamento((anteriores) =>
      anteriores.filter((_, itemIndice) => itemIndice !== indice)
    )
  }

  function calcularSubtotalOrcamento() {
    return itensOrcamento.reduce((total, item) => {
      const quantidade = Number(item.quantidade || 0)
      const valor = Number(item.valor_unitario || 0)

      return total + quantidade * valor
    }, 0)
  }

  function calcularTotalOrcamento() {
    const subtotal = calcularSubtotalOrcamento()
    const desconto = Number(formOrcamento.desconto || 0)

    return Math.max(0, subtotal - desconto)
  }

  async function gerarNumeroOrcamento() {
  const { data, error } = await supabase.rpc(
    'proximo_numero_orcamento'
  )

  if (error) {
    console.error(error)
    throw new Error('Erro ao gerar número do orçamento.')
  }

  return data
}

  async function salvarOrcamento(evento) {
    evento.preventDefault()

    if (!formOrcamento.cliente_id) {
      mostrarMensagem('Selecione o cliente.', 'erro')
      return
    }

    if (itensOrcamento.length === 0) {
      mostrarMensagem(
        'Adicione pelo menos um produto ou serviço.',
        'erro'
      )
      return
    }

    const itemInvalido = itensOrcamento.some(
      (item) =>
        Number(item.quantidade) <= 0 ||
        Number(item.valor_unitario) < 0
    )

    if (itemInvalido) {
      mostrarMensagem(
        'Confira a quantidade e o valor dos itens.',
        'erro'
      )
      return
    }

    setSalvandoOrcamento(true)

    const total = calcularTotalOrcamento()

    const dados = {
      cliente_id: Number(formOrcamento.cliente_id),
      validade: formOrcamento.validade || null,
      desconto: Number(formOrcamento.desconto || 0),
      total,
      forma_pagamento:
        formOrcamento.forma_pagamento.trim() || null,
      prazo_execucao:
        formOrcamento.prazo_execucao.trim() || null,
      garantia: formOrcamento.garantia.trim() || null,
      observacoes:
        formOrcamento.observacoes.trim() || null,
      status: formOrcamento.status,
      updated_at: new Date().toISOString()
    }

    let orcamentoId

    if (orcamentoEditando) {
      const { error } = await supabase
        .from('orcamentos')
        .update(dados)
        .eq('id', orcamentoEditando.id)

      if (error) {
        console.error(error)
        mostrarMensagem('Erro ao atualizar orçamento.', 'erro')
        setSalvandoOrcamento(false)
        return
      }

      orcamentoId = orcamentoEditando.id

      const { error: erroExcluirItens } = await supabase
        .from('orcamento_itens')
        .delete()
        .eq('orcamento_id', orcamentoId)

      if (erroExcluirItens) {
        console.error(erroExcluirItens)
        mostrarMensagem(
          'Erro ao atualizar os itens do orçamento.',
          'erro'
        )
        setSalvandoOrcamento(false)
        return
      }
    } else {
      const numero = await gerarNumeroOrcamento()

      const { data, error } = await supabase
        .from('orcamentos')
        .insert([
          {
            ...dados,
            numero
          }
        ])
        .select('id')
        .single()

      if (error) {
        console.error(error)
        mostrarMensagem('Erro ao criar orçamento.', 'erro')
        setSalvandoOrcamento(false)
        return
      }

      orcamentoId = data.id
    }

    const itensParaSalvar = itensOrcamento.map((item) => ({
      orcamento_id: orcamentoId,
      produto_id: item.produto_id,
      nome: item.nome,
      tipo: item.tipo,
      quantidade: Number(item.quantidade),
      valor_unitario: Number(item.valor_unitario),
      subtotal:
        Number(item.quantidade) * Number(item.valor_unitario)
    }))

    const { error: erroItens } = await supabase
      .from('orcamento_itens')
      .insert(itensParaSalvar)

    if (erroItens) {
      console.error(erroItens)
      mostrarMensagem(
        'O orçamento foi criado, mas ocorreu erro ao salvar os itens.',
        'erro'
      )
      setSalvandoOrcamento(false)
      return
    }

    await carregarOrcamentos()

    setModalOrcamento(false)
    setOrcamentoEditando(null)
    setFormOrcamento(orcamentoVazio)
    setItensOrcamento([])
    setSalvandoOrcamento(false)

    mostrarMensagem(
      orcamentoEditando
        ? 'Orçamento atualizado com sucesso.'
        : 'Orçamento criado com sucesso.'
    )
  }

  async function alterarStatusOrcamento(orcamento, novoStatus) {
    const atualizacao = {
      status: novoStatus,
      updated_at: new Date().toISOString()
    }

    if (novoStatus === 'aprovado') {
      atualizacao.data_aprovacao = new Date().toISOString()
    }

    if (novoStatus === 'em_execucao') {
      atualizacao.data_inicio_execucao = new Date().toISOString()
    }

    if (novoStatus === 'concluido') {
      atualizacao.data_conclusao = new Date().toISOString()
    }

    const { error } = await supabase
      .from('orcamentos')
      .update(atualizacao)
      .eq('id', orcamento.id)

    if (error) {
      console.error(error)
      mostrarMensagem(
        'Não foi possível alterar o status.',
        'erro'
      )
      return
    }

    await carregarOrcamentos()

    mostrarMensagem(
      `Status alterado para ${nomeStatus(novoStatus)}.`
    )
  }

  async function excluirOrcamento(orcamento) {
    const confirmar = window.confirm(
      `Deseja excluir o orçamento ${orcamento.numero}?`
    )

    if (!confirmar) return

    const { error } = await supabase
      .from('orcamentos')
      .update({
        ativo: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', orcamento.id)

    if (error) {
      console.error(error)
      mostrarMensagem(
        'Não foi possível excluir o orçamento.',
        'erro'
      )
      return
    }

    await carregarOrcamentos()
    mostrarMensagem('Orçamento excluído com sucesso.')
  }
/* ORDENS DE SERVIÇO */

async function carregarOrdens() {
  setCarregandoOrdens(true)

  const { data, error } = await supabase
    .from('ordens_servico')
    .select(`
      *,
      clientes (
        id,
        nome,
        cpf_cnpj,
        telefone,
        whatsapp
      ),
      orcamentos (
        id,
        numero,
        total
      )
    `)
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)

    mostrarMensagem(
      'Não foi possível carregar as ordens de serviço.',
      'erro'
    )
  } else {
    setOrdens(data || [])
  }

  setCarregandoOrdens(false)
}

async function gerarOrdemServico(orcamento) {
  if (orcamento.status !== 'aprovado') {
    mostrarMensagem(
      'O orçamento precisa estar aprovado antes de gerar a OS.',
      'erro'
    )

    return
  }

  const confirmar = window.confirm(
    `Gerar Ordem de Serviço para o orçamento ${orcamento.numero}?`
  )

  if (!confirmar) {
    return
  }

  const { data: osExistente } = await supabase
    .from('ordens_servico')
    .select('id, numero')
    .eq('orcamento_id', orcamento.id)
    .maybeSingle()

  if (osExistente) {
    mostrarMensagem(
      `Este orçamento já possui a ${osExistente.numero}.`,
      'erro'
    )

    return
  }

  const { data: numeroOS, error: erroNumero } =
    await supabase.rpc('proximo_numero_os')

  if (erroNumero) {
    console.error(erroNumero)

    mostrarMensagem(
      'Não foi possível gerar o número da OS.',
      'erro'
    )

    return
  }

  const { data: novaOS, error } = await supabase
    .from('ordens_servico')
    .insert([
      {
        numero: numeroOS,
        orcamento_id: orcamento.id,
        cliente_id: orcamento.cliente_id,
        status: 'aberta'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error(error)

    mostrarMensagem(
      'Não foi possível gerar a Ordem de Serviço.',
      'erro'
    )

    return
  }

  const { error: erroOrcamento } = await supabase
    .from('orcamentos')
    .update({
      status: 'em_execucao',
      data_inicio_execucao: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', orcamento.id)

  if (erroOrcamento) {
    console.error(erroOrcamento)
  }

  await carregarOrdens()
  await carregarOrcamentos()

  mostrarMensagem(
    `${novaOS.numero} gerada com sucesso.`
  )

  setPagina('ordens')
}

async function visualizarOrdemServico(ordem) {
  let itens = []

  if (ordem.orcamento_id) {
    const { data, error } = await supabase
      .from('orcamento_itens')
      .select('*')
      .eq('orcamento_id', ordem.orcamento_id)
      .order('id', { ascending: true })

    if (error) {
      console.error(error)

      mostrarMensagem(
        'Não foi possível carregar os itens da Ordem de Serviço.',
        'erro'
      )

      return
    }

    itens = data || []
  }

  abrirOrdemServicoParaImpressao({
    ordem,
    itens,
    empresa: configuracao
  })
}

function abrirEdicaoOrdem(ordem) {
  setOrdemEditando(ordem)

  let dataAgendamento = ''

  if (ordem.data_agendamento) {
    const data = new Date(ordem.data_agendamento)

    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    const hora = String(data.getHours()).padStart(2, '0')
    const minuto = String(data.getMinutes()).padStart(2, '0')

    dataAgendamento =
      `${ano}-${mes}-${dia}T${hora}:${minuto}`
  }

  setFormOrdem({
    status: ordem.status || 'aberta',
    tecnico: ordem.tecnico || '',
    data_agendamento: dataAgendamento,
    problema_relatado: ordem.problema_relatado || '',
    servico_executado: ordem.servico_executado || '',
    observacoes: ordem.observacoes || ''
  })

  setModalOrdem(true)
}

function fecharModalOrdem() {
  if (salvandoOrdem) {
    return
  }

  setModalOrdem(false)
  setOrdemEditando(null)

  setFormOrdem({
    status: 'aberta',
    tecnico: '',
    data_agendamento: '',
    problema_relatado: '',
    servico_executado: '',
    observacoes: ''
  })
}

function alterarCampoOrdem(evento) {
  const { name, value } = evento.target

  setFormOrdem((anterior) => ({
    ...anterior,
    [name]: value
  }))
}

async function salvarOrdem(evento) {
  evento.preventDefault()

  if (!ordemEditando) {
    return
  }

  setSalvandoOrdem(true)

  const agora = new Date().toISOString()

  const dados = {
    status: formOrdem.status,
    tecnico: formOrdem.tecnico.trim() || null,

    data_agendamento:
      formOrdem.data_agendamento
        ? new Date(
            formOrdem.data_agendamento
          ).toISOString()
        : null,

    problema_relatado:
      formOrdem.problema_relatado.trim() || null,

    servico_executado:
      formOrdem.servico_executado.trim() || null,

    observacoes:
      formOrdem.observacoes.trim() || null,

    updated_at: agora
  }

  if (
    formOrdem.status === 'em_execucao' &&
    !ordemEditando.data_inicio
  ) {
    dados.data_inicio = agora
  }

  if (
    formOrdem.status === 'concluida' &&
    !ordemEditando.data_conclusao
  ) {
    dados.data_conclusao = agora
  }

  const { error } = await supabase
    .from('ordens_servico')
    .update(dados)
    .eq('id', ordemEditando.id)

  if (error) {
    console.error(error)

    mostrarMensagem(
      'Não foi possível salvar a Ordem de Serviço.',
      'erro'
    )

    setSalvandoOrdem(false)
    return
  }

  if (formOrdem.status === 'concluida') {
    await supabase
      .from('orcamentos')
      .update({
        status: 'concluido',
        data_conclusao: agora,
        updated_at: agora
      })
      .eq('id', ordemEditando.orcamento_id)
  }

  await carregarOrdens()
  await carregarOrcamentos()

  setSalvandoOrdem(false)
  setModalOrdem(false)
  setOrdemEditando(null)

  mostrarMensagem(
    'Ordem de Serviço salva com sucesso.'
  )
}

async function excluirOrdem(ordem) {
  const confirmar = window.confirm(
    `Deseja excluir a ${ordem.numero}?`
  )

  if (!confirmar) {
    return
  }

  const { error } = await supabase
    .from('ordens_servico')
    .update({
      ativo: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', ordem.id)

  if (error) {
    console.error(error)

    mostrarMensagem(
      'Não foi possível excluir a OS.',
      'erro'
    )

    return
  }

  await carregarOrdens()

  mostrarMensagem(
    'Ordem de Serviço excluída com sucesso.'
  )
}
  /* FILTROS */

  const clientesFiltrados = clientes.filter((cliente) => {
    const busca = buscaCliente.toLowerCase().trim()

    if (!busca) return true

    return (
      cliente.nome?.toLowerCase().includes(busca) ||
      cliente.cpf_cnpj?.toLowerCase().includes(busca) ||
      cliente.telefone?.toLowerCase().includes(busca) ||
      cliente.whatsapp?.toLowerCase().includes(busca) ||
      cliente.email?.toLowerCase().includes(busca)
    )
  })

  const produtosFiltrados = produtos.filter((produto) => {
    const busca = buscaProduto.toLowerCase().trim()

    const correspondeBusca =
      !busca ||
      produto.nome?.toLowerCase().includes(busca) ||
      produto.codigo?.toLowerCase().includes(busca) ||
      produto.categoria?.toLowerCase().includes(busca)

    const correspondeTipo =
      filtroTipoProduto === 'todos' ||
      produto.tipo === filtroTipoProduto

    return correspondeBusca && correspondeTipo
  })

  const comprasFiltradas = compras.filter((compra) => {
    const busca = buscaCompra.toLowerCase().trim()

    if (!busca) {
      return true
    }

    const fornecedor =
      compra.fornecedores?.nome_fantasia ||
      compra.fornecedores?.razao_social ||
      ''

    return (
      String(compra.numero_nota || '')
        .toLowerCase()
        .includes(busca) ||
      String(compra.serie || '')
        .toLowerCase()
        .includes(busca) ||
      String(compra.chave_acesso || '')
        .toLowerCase()
        .includes(busca) ||
      String(fornecedor)
        .toLowerCase()
        .includes(busca)
    )
  })

  const orcamentosFiltrados = orcamentos.filter((orcamento) => {
    const busca = buscaOrcamento.toLowerCase().trim()

    const correspondeBusca =
      !busca ||
      orcamento.numero?.toLowerCase().includes(busca) ||
      orcamento.clientes?.nome?.toLowerCase().includes(busca)

    const correspondeStatus =
      filtroStatusOrcamento === 'todos' ||
      orcamento.status === filtroStatusOrcamento

    return correspondeBusca && correspondeStatus
  })

  const ordensFiltradas = ordens.filter((ordem) => {
  const busca = buscaOrdem.toLowerCase().trim()

  if (!busca) {
    return true
  }

  return (
    ordem.numero?.toLowerCase().includes(busca) ||
    ordem.clientes?.nome?.toLowerCase().includes(busca) ||
    ordem.orcamentos?.numero?.toLowerCase().includes(busca) ||
    ordem.tecnico?.toLowerCase().includes(busca)
  )
})

  const orcamentosRelatorio = orcamentos.filter((orcamento) => {
    const dentroPeriodo = dataDentroPeriodo(
      orcamento.data_orcamento,
      relatorioInicio,
      relatorioFim
    )

    const correspondeStatus =
      relatorioStatus === 'todos' ||
      orcamento.status === relatorioStatus

    const correspondeCliente =
      relatorioCliente === 'todos' ||
      String(orcamento.cliente_id) === String(relatorioCliente)

    return (
      dentroPeriodo &&
      correspondeStatus &&
      correspondeCliente
    )
  })

  const ordensRelatorio = ordens.filter((ordem) => {
    const dentroPeriodo = dataDentroPeriodo(
      ordem.data_abertura,
      relatorioInicio,
      relatorioFim
    )

    const correspondeCliente =
      relatorioCliente === 'todos' ||
      String(ordem.cliente_id) === String(relatorioCliente)

    return dentroPeriodo && correspondeCliente
  })

  const clientesRelatorio = clientes.filter((cliente) =>
    dataDentroPeriodo(
      cliente.created_at,
      relatorioInicio,
      relatorioFim
    )
  )

  const valorOrcadoRelatorio = orcamentosRelatorio.reduce(
    (total, orcamento) =>
      total + Number(orcamento.total || 0),
    0
  )

  const orcamentosAprovadosRelatorio =
    orcamentosRelatorio.filter((orcamento) =>
      [
        'aprovado',
        'em_execucao',
        'concluido'
      ].includes(orcamento.status)
    )

  const valorAprovadoRelatorio =
    orcamentosAprovadosRelatorio.reduce(
      (total, orcamento) =>
        total + Number(orcamento.total || 0),
      0
    )

  const ordensConcluidasRelatorio =
    ordensRelatorio.filter(
      (ordem) => ordem.status === 'concluida'
    )

  const totalProdutos = produtos.filter(
    (item) => item.tipo === 'produto'
  ).length

  const totalServicos = produtos.filter(
    (item) => item.tipo === 'servico'
  ).length

  const orcamentosAbertos = orcamentos.filter((item) =>
    [
      'rascunho',
      'enviado',
      'aguardando_aprovacao',
      'aprovado'
    ].includes(item.status)
  ).length

  const orcamentosEmExecucao = orcamentos.filter(
    (item) => item.status === 'em_execucao'
  ).length

  const hojeDashboard = new Date()
  const anoDashboard = hojeDashboard.getFullYear()
  const mesDashboard = hojeDashboard.getMonth()

  const orcamentosMes = orcamentos.filter((item) => {
    if (!item.data_orcamento) return false

    const data = new Date(
      `${String(item.data_orcamento).slice(0, 10)}T12:00:00`
    )

    return (
      data.getFullYear() === anoDashboard &&
      data.getMonth() === mesDashboard
    )
  })

  const valorOrcadoMes = orcamentosMes.reduce(
    (total, item) =>
      total + Number(item.total || 0),
    0
  )

  const valorAprovadoMes = orcamentosMes
    .filter((item) =>
      [
        'aprovado',
        'em_execucao',
        'concluido'
      ].includes(item.status)
    )
    .reduce(
      (total, item) =>
        total + Number(item.total || 0),
      0
    )

  const recebimentosMes = recebimentos.filter(
    (item) => {
      if (!item.data_recebimento) return false

      const data = new Date(
        item.data_recebimento
      )

      return (
        data.getFullYear() === anoDashboard &&
        data.getMonth() === mesDashboard
      )
    }
  )

  const valorRecebidoMes =
    recebimentosMes.reduce(
      (total, item) =>
        total + Number(item.valor || 0),
      0
    )

  const valorAReceber = orcamentos
    .filter((item) =>
      [
        'aprovado',
        'em_execucao',
        'concluido'
      ].includes(item.status)
    )
    .reduce((total, item) => {
      const saldo =
        Number(item.total || 0) -
        Number(item.valor_pago || 0)

      return total + Math.max(0, saldo)
    }, 0)

  const concluidosMes = orcamentosMes.filter(
    (item) => item.status === 'concluido'
  ).length

  const aguardandoAprovacao = orcamentos.filter(
    (item) =>
      item.status === 'aguardando_aprovacao'
  ).length

  const ultimosOrcamentos = orcamentos.slice(0, 5)
  const ultimasOrdens = ordens.slice(0, 5)

  function imprimirRelatorio() {
    abrirRelatorioParaImpressao({
      inicio: relatorioInicio,
      fim: relatorioFim,
      status: relatorioStatus,
      clienteId: relatorioCliente,
      clientes,
      orcamentos: orcamentosRelatorio,
      ordens: ordensRelatorio,
      valorOrcado: valorOrcadoRelatorio,
      valorAprovado: valorAprovadoRelatorio,
      aprovados: orcamentosAprovadosRelatorio.length,
      concluidas: ordensConcluidasRelatorio.length,
      novosClientes: clientesRelatorio.length,
      empresa: configuracao
    })
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="spinner" size={22} />
        Carregando...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="login-page login-page-pro">

        <div className="login-shell">

          <section className="login-visual">

            <div className="login-visual-top">

              <div className="login-brand-pro">
               <img
  src="https://rtonfaxsfynsvpftodpu.supabase.co/storage/v1/object/public/logos/ChatGPT%20Image%2014%20de%20ago.%20de%202026,%2022_31_26%20(2).png"
  alt="Logo INFRATEC"
  className="login-logo-empresa"
/>
                <div>
                  <h1></h1>
                  <span></span>
                </div>
              </div>

            </div>

            <div className="login-visual-content">

              <div className="login-visual-badge">
                Gestão simples e organizada
              </div>

              <h2>
                Tudo da sua empresa
                <br />
                em um só lugar.
              </h2>

              <p>
                Clientes, orçamentos, ordens de serviço,
                recebimentos e relatórios com acesso rápido
                e seguro.
              </p>

              <div className="login-visual-features">

                <div>
                  <span className="login-feature-dot" />
                  Orçamentos e serviços
                </div>

                <div>
                  <span className="login-feature-dot" />
                  Clientes e histórico
                </div>

                <div>
                  <span className="login-feature-dot" />
                  Relatórios e recebimentos
                </div>

              </div>

            </div>

            <div className="login-visual-footer">
              INFRATEC • Gestão inteligente para o dia a dia
            </div>

          </section>

          <section className="login-form-panel">

            <div className="login-form-wrap">

              <div className="login-mobile-brand">
                <div className="brand-logo">
                  I
                </div>

                <div>
                  <strong>INFRATEC</strong>
                  <span>Sistema de Gestão</span>
                </div>
              </div>

              <div className="login-heading">

                <div className="login-icon-pro">
                  <LockKeyhole size={20} />
                </div>

                <h2>Bem-vindo de volta</h2>

                <p>
                  Entre com seus dados para acessar o sistema.
                </p>

              </div>

              <form
                className="login-form-pro"
                onSubmit={fazerLogin}
              >

                <div className="login-field">

                  <label>E-mail</label>

                  <div className="login-input-wrap">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="seu@email.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                </div>

                <div className="login-field">

                  <label>Senha</label>

                  <div className="login-input-wrap">
                    <input
                      type="password"
                      value={senha}
                      onChange={(e) =>
                        setSenha(e.target.value)
                      }
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                </div>

                {erro && (
                  <div className="login-error-pro">
                    {erro}
                  </div>
                )}

                <button
                  className="login-submit-pro"
                  type="submit"
                  disabled={entrando}
                >
                  {entrando
                    ? 'Entrando...'
                    : 'Entrar no sistema'}
                </button>

              </form>

              <div className="login-access-note">
                <LockKeyhole size={13} />
                <span>Acesso restrito a usuários autorizados</span>
              </div>

            </div>

          </section>

        </div>

      </div>
    )
  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            I
          </div>

          <div>
            <h1>INFRATEC</h1>
            <span>Gestão</span>
          </div>

        </div>

        <nav className="menu">

          <MenuButton
            ativo={pagina === 'dashboard'}
            onClick={() => selecionarPagina('dashboard')}
            icone={<LayoutDashboard size={18} />}
            texto="Dashboard"
          />

          <MenuButton
            ativo={pagina === 'clientes'}
            onClick={() => selecionarPagina('clientes')}
            icone={<Users size={18} />}
            texto="Clientes"
          />

          <MenuButton
            ativo={pagina === 'orcamentos'}
            onClick={() => selecionarPagina('orcamentos')}
            icone={<FileText size={18} />}
            texto="Orçamentos"
          />

          <MenuButton
            ativo={pagina === 'ordens'}
            onClick={() => selecionarPagina('ordens')}
            icone={<Wrench size={18} />}
            texto="Ordens de Serviço"
          />

          <MenuButton
            ativo={pagina === 'produtos'}
            onClick={() => selecionarPagina('produtos')}
            icone={<Package size={18} />}
            texto="Produtos e Serviços"
          />

          <MenuButton
            ativo={pagina === 'compras'}
            onClick={() => selecionarPagina('compras')}
            icone={<Boxes size={18} />}
            texto="Compras"
          />

          <MenuButton
            ativo={pagina === 'relatorios'}
            onClick={() => selecionarPagina('relatorios')}
            icone={<BarChart3 size={18} />}
            texto="Relatórios"
          />

          <MenuButton
            ativo={pagina === 'configuracoes'}
            onClick={() => selecionarPagina('configuracoes')}
            icone={<Settings size={18} />}
            texto="Configurações"
          />

        </nav>

        <button
          className="logout-button"
          onClick={sair}
        >
          <LogOut size={17} />
          <span>Sair</span>
        </button>

      </aside>

      <main className="content">

        {mensagem && (
          <div
            className={`toast ${
              tipoMensagem === 'erro'
                ? 'toast-error'
                : 'toast-success'
            }`}
          >
            {mensagem}
          </div>
        )}

        {pagina === 'dashboard' && (
          <PaginaDashboard
            session={session}
            totalClientes={clientes.length}
            totalProdutos={totalProdutos}
            orcamentosAbertos={orcamentosAbertos}
            emExecucao={orcamentosEmExecucao}
            aguardandoAprovacao={aguardandoAprovacao}
            concluidosMes={concluidosMes}
            valorOrcadoMes={valorOrcadoMes}
            valorAprovadoMes={valorAprovadoMes}
            valorRecebidoMes={valorRecebidoMes}
            valorAReceber={valorAReceber}
            ultimosOrcamentos={ultimosOrcamentos}
            ultimasOrdens={ultimasOrdens}
            abrirNovoOrcamento={abrirNovoOrcamento}
            abrirOrcamentos={() => selecionarPagina('orcamentos')}
            abrirOrdens={() => selecionarPagina('ordens')}
            visualizarOrcamento={visualizarOrcamento}
            visualizarOrdem={visualizarOrdemServico}
          />
        )}

        {pagina === 'clientes' && (
          <PaginaClientes
            clientes={clientesFiltrados}
            totalClientes={clientes.length}
            carregando={carregandoClientes}
            busca={buscaCliente}
            setBusca={setBuscaCliente}
            abrirNovo={abrirNovoCliente}
            historico={abrirHistoricoCliente}
            editar={abrirEdicaoCliente}
            excluir={excluirCliente}
          />
        )}

        {pagina === 'produtos' && (
          <PaginaProdutos
            produtos={produtosFiltrados}
            totalProdutos={totalProdutos}
            totalServicos={totalServicos}
            carregando={carregandoProdutos}
            busca={buscaProduto}
            setBusca={setBuscaProduto}
            filtroTipo={filtroTipoProduto}
            setFiltroTipo={setFiltroTipoProduto}
            abrirNovoProduto={() => abrirNovoProduto('produto')}
            abrirNovoServico={() => abrirNovoProduto('servico')}
            abrirImportacaoXml={abrirImportacaoXml}
            editar={abrirEdicaoProduto}
            excluir={excluirProduto}
          />
        )}

        {pagina === 'compras' && (
          <PaginaCompras
            compras={comprasFiltradas}
            totalCompras={compras.length}
            carregando={carregandoCompras}
            busca={buscaCompra}
            setBusca={setBuscaCompra}
            importarXml={abrirImportacaoXml}
            visualizar={abrirDetalheCompra}
          />
        )}

        {pagina === 'orcamentos' && (
          <PaginaOrcamentos
            orcamentos={orcamentosFiltrados}
            total={orcamentos.length}
            carregando={carregandoOrcamentos}
            busca={buscaOrcamento}
            setBusca={setBuscaOrcamento}
            filtroStatus={filtroStatusOrcamento}
            setFiltroStatus={setFiltroStatusOrcamento}
            abrirNovo={abrirNovoOrcamento}
            visualizar={visualizarOrcamento}
            editar={abrirEdicaoOrcamento}
            excluir={excluirOrcamento}
            mudarStatus={alterarStatusOrcamento}
            gerarOS={gerarOrdemServico} 
                      abrirRecebimentos={abrirRecebimentos}
          />
        )}

        
       {pagina === 'ordens' && (
  <PaginaOrdens
    ordens={ordensFiltradas}
    carregando={carregandoOrdens}
    busca={buscaOrdem}
    setBusca={setBuscaOrdem}
    visualizar={visualizarOrdemServico}
    editar={abrirEdicaoOrdem}
    excluir={excluirOrdem}
  />
)}

        {pagina === 'relatorios' && (
          <PaginaRelatorios
            inicio={relatorioInicio}
            fim={relatorioFim}
            setInicio={setRelatorioInicio}
            setFim={setRelatorioFim}
            status={relatorioStatus}
            setStatus={setRelatorioStatus}
            cliente={relatorioCliente}
            setCliente={setRelatorioCliente}
            clientes={clientes}
            orcamentos={orcamentosRelatorio}
            ordens={ordensRelatorio}
            novosClientes={clientesRelatorio.length}
            valorOrcado={valorOrcadoRelatorio}
            valorAprovado={valorAprovadoRelatorio}
            aprovados={orcamentosAprovadosRelatorio.length}
            concluidas={ordensConcluidasRelatorio.length}
            imprimir={imprimirRelatorio}
          />
        )}

        {pagina === 'configuracoes' && (
          <PaginaConfiguracoes
            dados={configuracao}
            alterarCampo={alterarCampoConfiguracao}
            salvar={salvarConfiguracao}
            carregando={carregandoConfiguracao}
            salvando={salvandoConfiguracao}
          />
        )}

      </main>

      {modalImportarXml && (
        <ModalImportarXml
          dados={xmlImportado}
          carregando={xmlCarregando}
          salvando={salvandoCompra}
          selecionarXml={selecionarXmlNfe}
          alterarLucro={alterarLucroItemXml}
          confirmar={confirmarEntradaXml}
          fechar={fecharImportacaoXml}
        />
      )}

      {modalCompraDetalhe && compraDetalhe && (
        <ModalDetalheCompra
          compra={compraDetalhe}
          itens={itensCompraDetalhe}
          carregando={carregandoCompraDetalhe}
          fechar={fecharDetalheCompra}
        />
      )}

      {modalHistoricoCliente && clienteHistorico && (
        <ModalHistoricoCliente
          cliente={clienteHistorico}
          orcamentos={orcamentos.filter(
            (item) =>
              String(item.cliente_id) ===
              String(clienteHistorico.id)
          )}
          ordens={ordens.filter(
            (item) =>
              String(item.cliente_id) ===
              String(clienteHistorico.id)
          )}
          fechar={fecharHistoricoCliente}
          visualizarOrcamento={visualizarOrcamento}
          visualizarOrdem={visualizarOrdemServico}
        />
      )}

      {modalCliente && (
        <ModalCliente
          dados={formCliente}
          alterarCampo={alterarCampoCliente}
          salvar={salvarCliente}
          fechar={fecharModalCliente}
          salvando={salvandoCliente}
          editando={Boolean(clienteEditando)}
        />
      )}

      {modalProduto && (
        <ModalProduto
          dados={formProduto}
          alterarCampo={alterarCampoProduto}
          salvar={salvarProduto}
          fechar={fecharModalProduto}
          salvando={salvandoProduto}
          editando={Boolean(produtoEditando)}
        />
      )}

      {modalRecebimento && orcamentoRecebimento && (
        <ModalRecebimentos
          orcamento={orcamentoRecebimento}
          historico={historicoRecebimentos}
          carregando={carregandoRecebimentos}
          dados={formRecebimento}
          alterarCampo={alterarCampoRecebimento}
          registrar={registrarRecebimento}
          excluir={excluirRecebimento}
          fechar={fecharModalRecebimento}
          salvando={salvandoRecebimento}
        />
      )}

      {modalOrcamento && (
        <ModalOrcamento
          dados={formOrcamento}
          alterarCampo={alterarCampoOrcamento}
          clientes={clientes}
          produtos={produtos}
          itens={itensOrcamento}
          adicionarItem={adicionarItemOrcamento}
          alterarItem={alterarItemOrcamento}
          removerItem={removerItemOrcamento}
          subtotal={calcularSubtotalOrcamento()}
          total={calcularTotalOrcamento()}
          salvar={salvarOrcamento}
          fechar={fecharModalOrcamento}
          salvando={salvandoOrcamento}
          editando={Boolean(orcamentoEditando)}
          numero={orcamentoEditando?.numero}
        />
      )}

      {modalOrdem && ordemEditando && (
  <ModalOrdem
    ordem={ordemEditando}
    dados={formOrdem}
    alterarCampo={alterarCampoOrdem}
    salvar={salvarOrdem}
    fechar={fecharModalOrdem}
    salvando={salvandoOrdem}
  />
)}

    </div>
  )
}

function MenuButton({
  ativo,
  onClick,
  icone,
  texto
}) {
  return (
    <button
      className={`menu-item ${ativo ? 'active' : ''}`}
      onClick={onClick}
    >
      {icone}
      <span>{texto}</span>
    </button>
  )
}

function PaginaDashboard({
  session,
  totalClientes,
  totalProdutos,
  orcamentosAbertos,
  emExecucao,
  aguardandoAprovacao,
  concluidosMes,
  valorOrcadoMes,
  valorAprovadoMes,
  valorRecebidoMes,
  valorAReceber,
  ultimosOrcamentos,
  ultimasOrdens,
  abrirNovoOrcamento,
  abrirOrcamentos,
  abrirOrdens,
  visualizarOrcamento,
  visualizarOrdem
}) {
  const percentualRecebido =
    valorAprovadoMes > 0
      ? Math.min(
          100,
          Math.round(
            (valorRecebidoMes /
              valorAprovadoMes) *
              100
          )
        )
      : 0

  return (
    <>
      <header className="topbar dashboard-topbar-final">

        <div>
          <div className="dashboard-eyebrow">
            PAINEL GERAL
          </div>

          <h2>Dashboard</h2>

          <p>
            Visão geral dos atendimentos e resultados
          </p>
        </div>

        <div className="dashboard-top-actions">

          <button
            className="primary-button"
            onClick={abrirNovoOrcamento}
          >
            <Plus size={16} />
            Novo orçamento
          </button>

          <div className="user-box">

            <div className="avatar">
              <UserRound size={18} />
            </div>

            <div>
              <strong>Administrador</strong>
              <span>{session.user.email}</span>
            </div>

          </div>

        </div>

      </header>

      <section className="dashboard-highlight-grid">

        <div className="dashboard-highlight-card dashboard-highlight-main">

          <div className="dashboard-highlight-top">

            <div>
              <span>Recebido no mês</span>

              <strong>
                {formatarMoeda(valorRecebidoMes)}
              </strong>
            </div>

            <div className="dashboard-highlight-icon">
              <CircleDollarSign size={21} />
            </div>

          </div>

          <div className="dashboard-progress">

            <div className="dashboard-progress-head">
              <span>
                {percentualRecebido}% do valor vendido
              </span>

              <strong>
                {formatarMoeda(valorAprovadoMes)}
              </strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-bar"
                style={{
                  width: `${percentualRecebido}%`
                }}
              />
            </div>

          </div>

        </div>

        <div className="dashboard-highlight-card">

          <div className="dashboard-highlight-top">
            <div>
              <span>A receber</span>

              <strong>
                {formatarMoeda(valorAReceber)}
              </strong>
            </div>

            <div className="dashboard-highlight-icon subtle">
              <CalendarClock size={20} />
            </div>
          </div>

          <small>
            Saldo das vendas aprovadas
          </small>

        </div>

        <div className="dashboard-highlight-card">

          <div className="dashboard-highlight-top">
            <div>
              <span>Orçado no mês</span>

              <strong>
                {formatarMoeda(valorOrcadoMes)}
              </strong>
            </div>

            <div className="dashboard-highlight-icon subtle">
              <FileText size={20} />
            </div>
          </div>

          <small>
            Total das propostas emitidas
          </small>

        </div>

      </section>

      <section className="dashboard-kpis dashboard-kpis-final">

        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon">
            <FileText size={18} />
          </div>

          <div>
            <span>Orçamentos em aberto</span>
            <strong>{orcamentosAbertos}</strong>

            <small>
              {aguardandoAprovacao} aguardando aprovação
            </small>
          </div>

        </div>

        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon">
            <Wrench size={18} />
          </div>

          <div>
            <span>Em execução</span>
            <strong>{emExecucao}</strong>

            <small>
              Serviços atualmente em andamento
            </small>
          </div>

        </div>

        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <span>Concluídos no mês</span>
            <strong>{concluidosMes}</strong>

            <small>
              Orçamentos concluídos neste mês
            </small>
          </div>

        </div>

        <div className="dashboard-kpi">

          <div className="dashboard-kpi-icon">
            <Users size={18} />
          </div>

          <div>
            <span>Clientes cadastrados</span>
            <strong>{totalClientes}</strong>

            <small>
              {totalProdutos} produtos cadastrados
            </small>
          </div>

        </div>

      </section>

      <section className="dashboard-grid dashboard-grid-final">

        <div className="panel dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>Últimos orçamentos</h3>

              <p>
                Orçamentos emitidos recentemente
              </p>
            </div>

            <button
              type="button"
              className="dashboard-link-button"
              onClick={abrirOrcamentos}
            >
              Ver todos
            </button>

          </div>

          {ultimosOrcamentos.length === 0 ? (
            <div className="dashboard-empty">
              Nenhum orçamento cadastrado.
            </div>
          ) : (
            <div className="dashboard-list">

              {ultimosOrcamentos.map((orcamento) => (
                <button
                  type="button"
                  className="dashboard-list-item"
                  key={orcamento.id}
                  onClick={() =>
                    visualizarOrcamento(orcamento)
                  }
                >

                  <div className="dashboard-list-main">

                    <div className="dashboard-list-title">
                      {orcamento.numero}
                    </div>

                    <div className="dashboard-list-subtitle">
                      {orcamento.clientes?.nome ||
                        'Cliente'}
                    </div>

                  </div>

                  <div className="dashboard-list-date">
                    {formatarData(
                      orcamento.data_orcamento
                    )}
                  </div>

                  <StatusOrcamento
                    status={orcamento.status}
                  />

                  <div className="dashboard-list-value">
                    {formatarMoeda(
                      orcamento.total
                    )}
                  </div>

                </button>
              ))}

            </div>
          )}

        </div>

        <div className="panel dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>Ordens de Serviço recentes</h3>

              <p>
                Atendimentos mais recentes
              </p>
            </div>

            <button
              type="button"
              className="dashboard-link-button"
              onClick={abrirOrdens}
            >
              Ver todas
            </button>

          </div>

          {ultimasOrdens.length === 0 ? (
            <div className="dashboard-empty">
              Nenhuma Ordem de Serviço cadastrada.
            </div>
          ) : (
            <div className="dashboard-list">

              {ultimasOrdens.map((ordem) => (
                <button
                  type="button"
                  className="dashboard-list-item dashboard-list-os"
                  key={ordem.id}
                  onClick={() =>
                    visualizarOrdem(ordem)
                  }
                >

                  <div className="dashboard-list-main">

                    <div className="dashboard-list-title">
                      {ordem.numero}
                    </div>

                    <div className="dashboard-list-subtitle">
                      {ordem.clientes?.nome ||
                        'Cliente'}
                    </div>

                  </div>

                  <div className="dashboard-list-date">
                    {formatarData(
                      ordem.data_abertura
                    )}
                  </div>

                  <StatusOS
                    status={ordem.status}
                  />

                </button>
              ))}

            </div>
          )}

        </div>

      </section>

      <section className="dashboard-shortcuts dashboard-shortcuts-final">

        <button
          type="button"
          className="dashboard-shortcut"
          onClick={abrirNovoOrcamento}
        >
          <Plus size={17} />

          <div>
            <strong>Novo orçamento</strong>
            <span>Criar uma nova proposta</span>
          </div>
        </button>

        <button
          type="button"
          className="dashboard-shortcut"
          onClick={abrirOrcamentos}
        >
          <FileText size={17} />

          <div>
            <strong>Ver orçamentos</strong>
            <span>Acompanhar propostas</span>
          </div>
        </button>

        <button
          type="button"
          className="dashboard-shortcut"
          onClick={abrirOrdens}
        >
          <CalendarClock size={17} />

          <div>
            <strong>Ordens de Serviço</strong>
            <span>Acompanhar atendimentos</span>
          </div>
        </button>

      </section>
    </>
  )
}

function PaginaClientes({
  clientes,
  totalClientes,
  carregando,
  busca,
  setBusca,
  abrirNovo,
  historico,
  editar,
  excluir
}) {
  return (
    <>
      <header className="topbar">

        <div>
          <h2>Clientes</h2>
          <p>{totalClientes} clientes cadastrados</p>
        </div>

        <button
          className="primary-button"
          onClick={abrirNovo}
        >
          <Plus size={17} />
          Novo cliente
        </button>

      </header>

      <section className="panel">

        <div className="clients-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, documento ou contato..."
            />

          </div>

        </div>

        {carregando ? (
          <Carregando texto="Carregando clientes..." />
        ) : clientes.length === 0 ? (
          <Vazio
            icone={<Users size={19} />}
            titulo="Nenhum cliente encontrado"
            texto="Cadastre ou faça outra pesquisa."
          />
        ) : (
          <div className="table-wrapper">

            <table className="clients-table">

              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>CPF / CNPJ</th>
                  <th>Contato</th>
                  <th>Cidade</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>

              <tbody>

                {clientes.map((cliente) => (
                  <tr key={cliente.id}>

                    <td>
                      <div className="client-name">
                        {cliente.nome}
                      </div>
                    </td>

                    <td>
                      {cliente.cpf_cnpj || 'Não informado'}
                    </td>

                    <td>
                      {cliente.whatsapp ||
                        cliente.telefone ||
                        'Não informado'}
                    </td>

                    <td>
                      {cliente.cidade || 'Não informado'}
                    </td>

                    <td className="actions-column">

                      <button
                        className="icon-button"
                        title="Histórico do cliente"
                        onClick={() => historico(cliente)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="icon-button"
                        title="Editar cliente"
                        onClick={() => editar(cliente)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        onClick={() => excluir(cliente)}
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>
    </>
  )
}

function PaginaProdutos({
  produtos,
  totalProdutos,
  totalServicos,
  carregando,
  busca,
  setBusca,
  filtroTipo,
  setFiltroTipo,
  abrirNovoProduto,
  abrirNovoServico,
  abrirImportacaoXml,
  editar,
  excluir
}) {
  return (
    <>
      <header className="topbar">

        <div>
          <h2>Produtos e Serviços</h2>
          <p>Cadastre itens, preços e estoque.</p>
        </div>

        <div className="topbar-actions">

          <button
            className="secondary-button"
            onClick={abrirImportacaoXml}
          >
            <FileText size={16} />
            Importar XML
          </button>

          <button
            className="secondary-button"
            onClick={abrirNovoServico}
          >
            <Plus size={16} />
            Novo serviço
          </button>

          <button
            className="primary-button"
            onClick={abrirNovoProduto}
          >
            <Plus size={16} />
            Novo produto
          </button>

        </div>

      </header>

      <section className="product-summary">

        <MiniCard
          icone={<Boxes size={18} />}
          titulo="Produtos"
          valor={totalProdutos}
        />

        <MiniCard
          icone={<Wrench size={18} />}
          titulo="Serviços"
          valor={totalServicos}
        />

        <MiniCard
          icone={<Package size={18} />}
          titulo="Produtos e serviços"
          valor={totalProdutos + totalServicos}
        />

      </section>

      <section className="panel">

        <div className="products-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, código ou categoria..."
            />

          </div>

          <select
            className="filter-select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="produto">Produtos</option>
            <option value="servico">Serviços</option>
          </select>

        </div>

        {carregando ? (
          <Carregando texto="Carregando..." />
        ) : produtos.length === 0 ? (
          <Vazio
            icone={<Package size={19} />}
            titulo="Nenhum item encontrado"
            texto="Cadastre um produto ou serviço."
          />
        ) : (
          <div className="table-wrapper">

            <table className="clients-table">

              <thead>
                <tr>
                  <th>Item</th>
                  <th>Tipo</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>

              <tbody>

                {produtos.map((produto) => (
                  <tr key={produto.id}>

                    <td>
                      <div className="client-name">
                        {produto.nome}
                      </div>

                      <div className="client-secondary">
                        {produto.codigo || 'Sem código'}
                      </div>
                    </td>

                    <td>
                      {produto.tipo === 'servico'
                        ? 'Serviço'
                        : 'Produto'}
                    </td>

                    <td>
                      {formatarMoeda(produto.valor_venda)}
                    </td>

                    <td>
                      {produto.tipo === 'servico'
                        ? 'Não se aplica'
                        : `${formatarQuantidade(produto.estoque)} ${produto.unidade}`}
                    </td>

                    <td className="actions-column">

                      <button
                        className="icon-button"
                        onClick={() => editar(produto)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        onClick={() => excluir(produto)}
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>
    </>
  )
}

function PaginaCompras({
  compras,
  totalCompras,
  carregando,
  busca,
  setBusca,
  importarXml,
  visualizar
}) {
  const totalValor = compras.reduce(
    (total, compra) =>
      total + Number(compra.valor_total || 0),
    0
  )

  const fornecedoresUnicos = new Set(
    compras
      .map((compra) => compra.fornecedor_id)
      .filter(Boolean)
  ).size

  const totalItens = compras.reduce(
    (total, compra) =>
      total + Number(compra.compra_itens?.length || 0),
    0
  )

  return (
    <>
      <header className="topbar">

        <div>
          <div className="dashboard-eyebrow">
            ENTRADAS
          </div>

          <h2>Compras</h2>

          <p>
            Consulte as NF-e importadas e os custos dos produtos
          </p>
        </div>

        <button
          className="primary-button"
          onClick={importarXml}
        >
          <FileText size={16} />
          Importar XML
        </button>

      </header>

      <section className="purchase-summary">

        <div className="purchase-summary-card">
          <span>Notas importadas</span>
          <strong>{totalCompras}</strong>
          <small>Compras registradas</small>
        </div>

        <div className="purchase-summary-card">
          <span>Valor em compras</span>
          <strong>
            {formatarMoeda(totalValor)}
          </strong>
          <small>Resultado da busca atual</small>
        </div>

        <div className="purchase-summary-card">
          <span>Fornecedores</span>
          <strong>{fornecedoresUnicos}</strong>
          <small>Fornecedores na listagem</small>
        </div>

        <div className="purchase-summary-card">
          <span>Itens importados</span>
          <strong>{totalItens}</strong>
          <small>Produtos nas notas</small>
        </div>

      </section>

      <section className="panel">

        <div className="products-toolbar">

          <div className="search-box">
            <Search size={17} />

            <input
              value={busca}
              onChange={(e) =>
                setBusca(e.target.value)
              }
              placeholder="Buscar por NF-e, fornecedor ou chave de acesso..."
            />
          </div>

        </div>

        {carregando ? (
          <Carregando texto="Carregando compras..." />
        ) : compras.length === 0 ? (
          <Vazio
            icone={<Boxes size={19} />}
            titulo="Nenhuma compra encontrada"
            texto="Importe o XML de uma NF-e para registrar a primeira entrada."
          />
        ) : (
          <div className="table-wrapper">

            <table className="clients-table purchase-table">

              <thead>
                <tr>
                  <th>NF-e</th>
                  <th>Fornecedor</th>
                  <th>Emissão</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Origem</th>
                  <th className="actions-column">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {compras.map((compra) => {
                  const fornecedor =
                    compra.fornecedores?.nome_fantasia ||
                    compra.fornecedores?.razao_social ||
                    'Fornecedor'

                  return (
                    <tr key={compra.id}>

                      <td>
                        <div className="client-name">
                          NF-e {compra.numero_nota || '-'}
                        </div>

                        <div className="client-secondary">
                          Série {compra.serie || '-'}
                        </div>
                      </td>

                      <td>
                        <div className="client-name">
                          {fornecedor}
                        </div>

                        <div className="client-secondary">
                          {compra.fornecedores?.cnpj ||
                            'CNPJ não informado'}
                        </div>
                      </td>

                      <td>
                        {formatarDataHora(
                          compra.data_emissao
                        )}
                      </td>

                      <td>
                        {compra.compra_itens?.length || 0}
                      </td>

                      <td>
                        <strong>
                          {formatarMoeda(
                            compra.valor_total
                          )}
                        </strong>
                      </td>

                      <td>
                        <span className="purchase-origin">
                          {compra.origem === 'xml'
                            ? 'XML'
                            : 'Manual'}
                        </span>
                      </td>

                      <td className="actions-column">
                        <button
                          className="icon-button"
                          title="Visualizar compra"
                          onClick={() =>
                            visualizar(compra)
                          }
                        >
                          <Eye size={16} />
                        </button>
                      </td>

                    </tr>
                  )
                })}
              </tbody>

            </table>

          </div>
        )}

      </section>
    </>
  )
}

function ModalDetalheCompra({
  compra,
  itens,
  carregando,
  fechar
}) {
  const fornecedor =
    compra.fornecedores?.nome_fantasia ||
    compra.fornecedores?.razao_social ||
    'Fornecedor'

  const custoTotalItens = itens.reduce(
    (total, item) =>
      total + Number(item.valor_total || 0),
    0
  )

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          fechar()
        }
      }}
    >
      <div className="modal-box purchase-detail-modal">

        <div className="modal-header">

          <div>
            <h3>
              NF-e {compra.numero_nota || '-'}
            </h3>

            <p>
              {fornecedor}
              {' • '}
              Série {compra.serie || '-'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={fechar}
          >
            <X size={18} />
          </button>

        </div>

        <div className="modal-body">

          <div className="purchase-detail-header">

            <div>
              <span>Fornecedor</span>
              <strong>{fornecedor}</strong>
              <small>
                {compra.fornecedores?.cnpj ||
                  'CNPJ não informado'}
              </small>
            </div>

            <div>
              <span>Emissão</span>
              <strong>
                {formatarDataHora(
                  compra.data_emissao
                )}
              </strong>
            </div>

            <div>
              <span>Valor dos produtos</span>
              <strong>
                {formatarMoeda(
                  compra.valor_produtos
                )}
              </strong>
            </div>

            <div className="purchase-total-box">
              <span>Total da NF-e</span>
              <strong>
                {formatarMoeda(
                  compra.valor_total
                )}
              </strong>
            </div>

          </div>

          <div className="purchase-key-box">
            <span>Chave de acesso</span>
            <strong>
              {compra.chave_acesso ||
                'Não informada'}
            </strong>
          </div>

          <div className="form-section-title">
            Produtos da compra
          </div>

          {carregando ? (
            <Carregando texto="Carregando itens..." />
          ) : itens.length === 0 ? (
            <div className="history-empty">
              Nenhum item encontrado nesta compra.
            </div>
          ) : (
            <div className="purchase-items">

              {itens.map((item) => {
                const custo = Number(
                  item.custo_unitario_final || 0
                )

                const percentual = Number(
                  item.produtos?.percentual_lucro || 0
                )

                const sugerido = Number(
                  item.produtos?.preco_sugerido || 0
                )

                const lucro =
                  sugerido > 0
                    ? sugerido - custo
                    : custo * (percentual / 100)

                return (
                  <div
                    className="purchase-item-card"
                    key={item.id}
                  >

                    <div className="purchase-item-title">
                      <div>
                        <strong>
                          {item.nome_produto}
                        </strong>

                        <span>
                          Código: {item.codigo_fornecedor || '-'}
                          {' • '}
                          NCM: {item.ncm || '-'}
                        </span>
                      </div>

                      <span className="purchase-product-link">
                        {item.produto_id
                          ? 'Vinculado ao cadastro'
                          : 'Sem vínculo'}
                      </span>
                    </div>

                    <div className="purchase-item-values">

                      <div>
                        <span>Quantidade</span>
                        <strong>
                          {formatarQuantidade(
                            item.quantidade
                          )}{' '}
                          {item.unidade || ''}
                        </strong>
                      </div>

                      <div>
                        <span>Valor no XML</span>
                        <strong>
                          {formatarMoeda(
                            item.valor_unitario
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Custo final</span>
                        <strong>
                          {formatarMoeda(custo)}
                        </strong>
                      </div>

                      <div>
                        <span>Lucro cadastrado</span>
                        <strong className="profit-value">
                          {formatarPercentual(
                            percentual
                          )}%
                          {' • '}
                          {formatarMoeda(lucro)}
                        </strong>
                      </div>

                      <div>
                        <span>Preço sugerido</span>
                        <strong className="suggested-price">
                          {formatarMoeda(sugerido)}
                        </strong>
                      </div>

                    </div>

                  </div>
                )
              })}

            </div>
          )}

          <div className="purchase-detail-footer-summary">

            <div>
              <span>Subtotal dos itens</span>
              <strong>
                {formatarMoeda(custoTotalItens)}
              </strong>
            </div>

            <div>
              <span>Frete</span>
              <strong>
                {formatarMoeda(
                  compra.valor_frete
                )}
              </strong>
            </div>

            <div>
              <span>Desconto</span>
              <strong>
                {formatarMoeda(
                  compra.valor_desconto
                )}
              </strong>
            </div>

            <div>
              <span>Total da NF-e</span>
              <strong>
                {formatarMoeda(
                  compra.valor_total
                )}
              </strong>
            </div>

          </div>

        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={fechar}
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  )
}

function PaginaOrcamentos({
  orcamentos,
  total,
  carregando,
  busca,
  setBusca,
  filtroStatus,
  setFiltroStatus,
  abrirNovo,
visualizar,
editar,
excluir,
mudarStatus,
gerarOS,
abrirRecebimentos,
}) {
  return (
    <>
      <header className="topbar">

        <div>
          <h2>Orçamentos</h2>
          <p>{total} orçamentos cadastrados</p>
        </div>

        <button
          className="primary-button"
          onClick={abrirNovo}
        >
          <Plus size={17} />
          Novo orçamento
        </button>

      </header>

      <section className="panel">

        <div className="products-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por número ou cliente..."
            />

          </div>

          <select
            className="filter-select"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="enviado">Enviado</option>
            <option value="aguardando_aprovacao">
              Aguardando aprovação
            </option>
            <option value="aprovado">Aprovado</option>
            <option value="em_execucao">Em execução</option>
            <option value="concluido">Concluído</option>
            <option value="recusado">Recusado</option>
            <option value="cancelado">Cancelado</option>
          </select>

        </div>

        {carregando ? (
          <Carregando texto="Carregando orçamentos..." />
        ) : orcamentos.length === 0 ? (
          <Vazio
            icone={<FileText size={19} />}
            titulo="Nenhum orçamento encontrado"
            texto="Clique em Novo orçamento para começar."
          />
        ) : (
          <div className="table-wrapper">

            <table className="clients-table budget-table">

              <thead>
                <tr>
                  <th>Orçamento</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>

              <tbody>

                {orcamentos.map((orcamento) => (
                  <tr key={orcamento.id}>

                    <td>
                      <div className="client-name">
                        {orcamento.numero}
                      </div>
                    </td>

                    <td>
                      {orcamento.clientes?.nome || 'Cliente'}
                    </td>

                    <td>
                      {formatarData(orcamento.data_orcamento)}
                    </td>

                    <td>
                      <strong>
                        {formatarMoeda(orcamento.total)}
                      </strong>
                    </td>

                    <td>
                      <StatusPagamento
                        status={orcamento.status_pagamento}
                        pago={orcamento.valor_pago}
                        total={orcamento.total}
                      />
                    </td>

                    <td>
                      <StatusOrcamento
                        status={orcamento.status}
                      />
                    </td>

                    <td className="actions-column budget-actions">

                      <select
                        className="status-select-small"
                        value={orcamento.status}
                        onChange={(e) =>
                          mudarStatus(
                            orcamento,
                            e.target.value
                          )
                        }
                      >
                        <option value="rascunho">
                          Rascunho
                        </option>

                        <option value="enviado">
                          Enviado
                        </option>

                        <option value="aguardando_aprovacao">
                          Aguardando
                        </option>

                        <option value="aprovado">
                          Aprovado
                        </option>

                        <option value="em_execucao">
                          Em execução
                        </option>

                        <option value="concluido">
                          Concluído
                        </option>

                        <option value="recusado">
                          Recusado
                        </option>

                        <option value="cancelado">
                          Cancelado
                        </option>
                      </select>

                      <button
  className="icon-button finance-button"
  title="Gerenciar recebimentos"
  onClick={() =>
    abrirRecebimentos(orcamento)
  }
>
  <CircleDollarSign size={16} />
</button>

{orcamento.status === 'aprovado' && (
  <button
    className="icon-button os-button"
    title="Gerar Ordem de Serviço"
    onClick={() => gerarOS(orcamento)}
  >
    <Wrench size={16} />
  </button>
)}
<button
  className="icon-button"
  title="Visualizar / PDF"
  onClick={() => visualizar(orcamento)}
>
  <Eye size={16} />
</button>
                      <button
                        className="icon-button"
                        title="Editar"
                        onClick={() => editar(orcamento)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        title="Excluir"
                        onClick={() => excluir(orcamento)}
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>
    </>
  )
}

function ModalRecebimentos({
  orcamento,
  historico,
  carregando,
  dados,
  alterarCampo,
  registrar,
  excluir,
  fechar,
  salvando
}) {
  const total = Number(orcamento.total || 0)

  const recebido = historico.reduce(
    (soma, item) =>
      soma + Number(item.valor || 0),
    0
  )

  const saldo = Math.max(
    0,
    total - recebido
  )

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          fechar()
        }
      }}
    >
      <div className="modal-box payment-modal">

        <div className="modal-header">
          <div>
            <h3>Recebimentos do orçamento</h3>
            <p>
              {orcamento.numero} •{' '}
              {orcamento.clientes?.nome || 'Cliente'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={fechar}
            disabled={salvando}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">

          <div className="payment-summary">

            <div className="payment-summary-card">
              <span>Total da venda</span>
              <strong>{formatarMoeda(total)}</strong>
            </div>

            <div className="payment-summary-card">
              <span>Recebido</span>
              <strong>{formatarMoeda(recebido)}</strong>
            </div>

            <div className="payment-summary-card">
              <span>A receber</span>
              <strong>{formatarMoeda(saldo)}</strong>
            </div>

          </div>

          {saldo > 0 && (
            <form
              className="payment-form"
              onSubmit={registrar}
            >
              <div className="form-section-title first-section">
                Registrar recebimento
              </div>

              <div className="payment-form-grid">

                <div className="form-group">
                  <label>Valor recebido *</label>

                  <input
                    type="number"
                    min="0.01"
                    max={saldo}
                    step="0.01"
                    name="valor"
                    value={dados.valor}
                    onChange={alterarCampo}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Forma de pagamento</label>

                  <select
                    name="forma_pagamento"
                    value={dados.forma_pagamento}
                    onChange={alterarCampo}
                  >
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão de débito">Cartão de débito</option>
                    <option value="Cartão de crédito">Cartão de crédito</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

              </div>

              <div className="form-group">
                <label>Observações</label>

                <input
                  name="observacoes"
                  value={dados.observacoes}
                  onChange={alterarCampo}
                  placeholder="Ex: entrada, parcela 1..."
                />
              </div>

              <div className="payment-form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={salvando}
                >
                  {salvando ? (
                    <>
                      <Loader2
                        className="spinner"
                        size={16}
                      />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CircleDollarSign size={16} />
                      Registrar recebimento
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          <div className="form-section-title">
            Histórico de recebimentos
          </div>

          {carregando ? (
            <Carregando texto="Carregando recebimentos..." />
          ) : historico.length === 0 ? (
            <div className="history-empty">
              Nenhum recebimento registrado para este orçamento.
            </div>
          ) : (
            <div className="payment-history">

              {historico.map((item) => (
                <div
                  className="payment-history-item"
                  key={item.id}
                >
                  <div className="payment-history-main">
                    <strong>
                      {formatarMoeda(item.valor)}
                    </strong>

                    <span>
                      {item.forma_pagamento ||
                        'Não informado'}
                    </span>

                    {item.observacoes && (
                      <small>
                        {item.observacoes}
                      </small>
                    )}
                  </div>

                  <div className="payment-history-side">
                    <span>
                      {formatarDataHora(
                        item.data_recebimento
                      )}
                    </span>

                    <button
                      type="button"
                      className="icon-button danger"
                      title="Excluir recebimento"
                      onClick={() => excluir(item)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={fechar}
            disabled={salvando}
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  )
}

function StatusPagamento({
  status,
  pago,
  total
}) {
  const valorPago = Number(pago || 0)
  const valorTotal = Number(total || 0)

  let situacao = status || 'pendente'

  if (
    situacao === 'pendente' &&
    valorPago > 0
  ) {
    situacao = 'parcial'
  }

  const nomes = {
    pendente: 'Pendente',
    parcial: 'Parcial',
    pago: 'Pago',
    cancelado: 'Cancelado'
  }

  return (
    <div className="payment-status-wrap">
      <span
        className={`payment-status payment-${situacao}`}
      >
        {nomes[situacao] || situacao}
      </span>

      <small>
        {formatarMoeda(valorPago)}
        {' / '}
        {formatarMoeda(valorTotal)}
      </small>
    </div>
  )
}

function ModalOrcamento({
  dados,
  alterarCampo,
  clientes,
  produtos,
  itens,
  adicionarItem,
  alterarItem,
  removerItem,
  subtotal,
  total,
  salvar,
  fechar,
  salvando,
  editando,
  numero
}) {
  return (
    <div className="modal-overlay">

      <div className="modal-box budget-modal">

        <div className="modal-header">

          <div>
            <h3>
              {editando
                ? `Editar ${numero}`
                : 'Novo orçamento'}
            </h3>

            <p>
              Selecione o cliente e adicione os itens.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={fechar}
            disabled={salvando}
          >
            <X size={18} />
          </button>

        </div>

        <form onSubmit={salvar}>

          <div className="modal-body">

            <div className="form-section-title first-section">
              Cliente e situação
            </div>

            <div className="form-grid">

              <div className="form-group field-large">

                <label>Cliente *</label>

                <select
                  name="cliente_id"
                  value={dados.cliente_id}
                  onChange={alterarCampo}
                  required
                >
                  <option value="">
                    Selecione o cliente
                  </option>

                  {clientes.map((cliente) => (
                    <option
                      key={cliente.id}
                      value={cliente.id}
                    >
                      {cliente.nome}
                    </option>
                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Status</label>

                <select
                  name="status"
                  value={dados.status}
                  onChange={alterarCampo}
                >
                  <option value="rascunho">
                    Rascunho
                  </option>
                  <option value="enviado">
                    Enviado
                  </option>
                  <option value="aguardando_aprovacao">
                    Aguardando aprovação
                  </option>
                  <option value="aprovado">
                    Aprovado
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>Validade</label>

                <input
                  type="date"
                  name="validade"
                  value={dados.validade}
                  onChange={alterarCampo}
                />

              </div>

            </div>

            <div className="form-section-title">
              Produtos e serviços
            </div>

            <div className="add-item-row">

              <select
                defaultValue=""
                onChange={(e) => {
                  adicionarItem(e.target.value)
                  e.target.value = ''
                }}
              >
                <option value="">
                  Adicionar produto ou serviço...
                </option>

                {produtos.map((produto) => (
                  <option
                    key={produto.id}
                    value={produto.id}
                  >
                    {produto.nome} - {formatarMoeda(produto.valor_venda)}
                  </option>
                ))}

              </select>

            </div>

            {itens.length === 0 ? (
              <div className="budget-empty-items">
                Nenhum item adicionado.
              </div>
            ) : (
              <div className="budget-items">

                <div className="budget-item-header">
                  <span>Item</span>
                  <span>Qtd.</span>
                  <span>Valor unit.</span>
                  <span>Subtotal</span>
                  <span></span>
                </div>

                {itens.map((item, indice) => {

                  const subtotalItem =
                    Number(item.quantidade || 0) *
                    Number(item.valor_unitario || 0)

                  return (
                    <div
                      className="budget-item-row"
                      key={`${item.produto_id}-${indice}`}
                    >

                      <div>
                        <strong>{item.nome}</strong>

                        <small>
                          {item.tipo === 'servico'
                            ? 'Serviço'
                            : 'Produto'}
                        </small>
                      </div>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantidade}
                        onChange={(e) =>
                          alterarItem(
                            indice,
                            'quantidade',
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.valor_unitario}
                        onChange={(e) =>
                          alterarItem(
                            indice,
                            'valor_unitario',
                            e.target.value
                          )
                        }
                      />

                      <strong>
                        {formatarMoeda(subtotalItem)}
                      </strong>

                      <button
                        type="button"
                        className="icon-button danger"
                        onClick={() =>
                          removerItem(indice)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  )
                })}

              </div>
            )}

            <div className="form-section-title">
              Condições
            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>Forma de pagamento</label>

                <input
                  name="forma_pagamento"
                  value={dados.forma_pagamento}
                  onChange={alterarCampo}
                  placeholder="Ex: PIX, cartão, 50% entrada..."
                />

              </div>

              <div className="form-group">

                <label>Prazo de execução</label>

                <input
                  name="prazo_execucao"
                  value={dados.prazo_execucao}
                  onChange={alterarCampo}
                  placeholder="Ex: Até 5 dias úteis"
                />

              </div>

              <div className="form-group">

                <label>Garantia</label>

                <input
                  name="garantia"
                  value={dados.garantia}
                  onChange={alterarCampo}
                  placeholder="Ex: 90 dias"
                />

              </div>

              <div className="form-group">

                <label>Desconto em R$</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="desconto"
                  value={dados.desconto}
                  onChange={alterarCampo}
                  placeholder="0,00"
                />

              </div>

            </div>

            <div className="form-group">

              <label>Observações</label>

              <textarea
                name="observacoes"
                value={dados.observacoes}
                onChange={alterarCampo}
                rows="3"
                placeholder="Observações do orçamento..."
              />

            </div>

            <div className="budget-totals">

              <div>
                <span>Subtotal</span>
                <strong>
                  {formatarMoeda(subtotal)}
                </strong>
              </div>

              <div>
                <span>Desconto</span>
                <strong>
                  - {formatarMoeda(dados.desconto || 0)}
                </strong>
              </div>

              <div className="grand-total">
                <span>Total</span>
                <strong>
                  {formatarMoeda(total)}
                </strong>
              </div>

            </div>

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="secondary-button"
              onClick={fechar}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={salvando}
            >

              {salvando ? (
                <>
                  <Loader2
                    className="spinner"
                    size={16}
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editando
                    ? 'Salvar alterações'
                    : 'Criar orçamento'}
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

function ModalHistoricoCliente({
  cliente,
  orcamentos,
  ordens,
  fechar,
  visualizarOrcamento,
  visualizarOrdem
}) {
  const totalOrcado = orcamentos.reduce(
    (total, item) =>
      total + Number(item.total || 0),
    0
  )

  const totalAprovado = orcamentos
    .filter((item) =>
      [
        'aprovado',
        'em_execucao',
        'concluido'
      ].includes(item.status)
    )
    .reduce(
      (total, item) =>
        total + Number(item.total || 0),
      0
    )

  const concluidas = ordens.filter(
    (item) => item.status === 'concluida'
  ).length

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          fechar()
        }
      }}
    >

      <div className="modal-box history-modal">

        <div className="modal-header">

          <div>
            <h3>{cliente.nome}</h3>

            <p>
              Histórico de orçamentos e Ordens de Serviço
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={fechar}
          >
            <X size={18} />
          </button>

        </div>

        <div className="modal-body">

          <div className="history-client-info">

            <div>
              <span>CPF / CNPJ</span>
              <strong>
                {cliente.cpf_cnpj ||
                  'Não informado'}
              </strong>
            </div>

            <div>
              <span>Contato</span>
              <strong>
                {cliente.whatsapp ||
                  cliente.telefone ||
                  'Não informado'}
              </strong>
            </div>

            <div>
              <span>E-mail</span>
              <strong>
                {cliente.email ||
                  'Não informado'}
              </strong>
            </div>

            <div>
              <span>Cidade</span>
              <strong>
                {cliente.cidade
                  ? `${cliente.cidade}${
                      cliente.estado
                        ? `/${cliente.estado}`
                        : ''
                    }`
                  : 'Não informado'}
              </strong>
            </div>

          </div>

          <div className="history-summary">

            <div className="history-card">
              <span>Orçamentos</span>
              <strong>
                {orcamentos.length}
              </strong>
            </div>

            <div className="history-card">
              <span>Total orçado</span>
              <strong>
                {formatarMoeda(totalOrcado)}
              </strong>
            </div>

            <div className="history-card">
              <span>Valor aprovado</span>
              <strong>
                {formatarMoeda(totalAprovado)}
              </strong>
            </div>

            <div className="history-card">
              <span>OS concluídas</span>
              <strong>
                {concluidas}
              </strong>
            </div>

          </div>

          <div className="form-section-title">
            Orçamentos
          </div>

          {orcamentos.length === 0 ? (
            <div className="history-empty">
              Nenhum orçamento para este cliente.
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Orçamento</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th className="actions-column">
                      Ver
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {orcamentos.map((orcamento) => (
                    <tr key={orcamento.id}>

                      <td>
                        <div className="client-name">
                          {orcamento.numero}
                        </div>
                      </td>

                      <td>
                        {formatarData(
                          orcamento.data_orcamento
                        )}
                      </td>

                      <td>
                        <StatusOrcamento
                          status={orcamento.status}
                        />
                      </td>

                      <td>
                        <strong>
                          {formatarMoeda(
                            orcamento.total
                          )}
                        </strong>
                      </td>

                      <td className="actions-column">

                        <button
                          type="button"
                          className="icon-button"
                          title="Visualizar orçamento"
                          onClick={() =>
                            visualizarOrcamento(
                              orcamento
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          <div className="form-section-title">
            Ordens de Serviço
          </div>

          {ordens.length === 0 ? (
            <div className="history-empty">
              Nenhuma Ordem de Serviço para este cliente.
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>OS</th>
                    <th>Abertura</th>
                    <th>Status</th>
                    <th>Técnico</th>
                    <th className="actions-column">
                      Ver
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {ordens.map((ordem) => (
                    <tr key={ordem.id}>

                      <td>
                        <div className="client-name">
                          {ordem.numero}
                        </div>
                      </td>

                      <td>
                        {formatarData(
                          ordem.data_abertura
                        )}
                      </td>

                      <td>
                        <StatusOS
                          status={ordem.status}
                        />
                      </td>

                      <td>
                        {ordem.tecnico ||
                          'Não definido'}
                      </td>

                      <td className="actions-column">

                        <button
                          type="button"
                          className="icon-button"
                          title="Visualizar Ordem de Serviço"
                          onClick={() =>
                            visualizarOrdem(ordem)
                          }
                        >
                          <Eye size={16} />
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {cliente.observacoes && (
            <>
              <div className="form-section-title">
                Observações
              </div>

              <div className="history-notes">
                {cliente.observacoes}
              </div>
            </>
          )}

        </div>

        <div className="modal-footer">

          <button
            type="button"
            className="secondary-button"
            onClick={fechar}
          >
            Fechar
          </button>

        </div>

      </div>

    </div>
  )
}

function ModalCliente({
  dados,
  alterarCampo,
  salvar,
  fechar,
  salvando,
  editando
}) {
  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">

          <div>
            <h3>
              {editando ? 'Editar cliente' : 'Novo cliente'}
            </h3>
            <p>Preencha os dados abaixo.</p>
          </div>

          <button
            className="modal-close"
            onClick={fechar}
          >
            <X size={18} />
          </button>

        </div>

        <form onSubmit={salvar}>

          <div className="modal-body">

            <div className="form-grid">

              <div className="form-group">
                <label>Tipo</label>

                <select
                  name="tipo_pessoa"
                  value={dados.tipo_pessoa}
                  onChange={alterarCampo}
                >
                  <option value="fisica">
                    Pessoa Física
                  </option>
                  <option value="juridica">
                    Pessoa Jurídica
                  </option>
                </select>
              </div>

              <div className="form-group field-large">
                <label>Nome *</label>

                <input
                  name="nome"
                  value={dados.nome}
                  onChange={alterarCampo}
                  required
                />
              </div>

              <CampoCliente
                label="CPF / CNPJ"
                name="cpf_cnpj"
                value={dados.cpf_cnpj}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="Telefone"
                name="telefone"
                value={dados.telefone}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="WhatsApp"
                name="whatsapp"
                value={dados.whatsapp}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="E-mail"
                name="email"
                value={dados.email}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="CEP"
                name="cep"
                value={dados.cep}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="Endereço"
                name="endereco"
                value={dados.endereco}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="Número"
                name="numero"
                value={dados.numero}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="Bairro"
                name="bairro"
                value={dados.bairro}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="Cidade"
                name="cidade"
                value={dados.cidade}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="UF"
                name="estado"
                value={dados.estado}
                onChange={alterarCampo}
              />

            </div>

            <div className="form-group">
              <label>Observações</label>

              <textarea
                name="observacoes"
                value={dados.observacoes}
                onChange={alterarCampo}
                rows="3"
              />
            </div>

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="secondary-button"
              onClick={fechar}
            >
              Cancelar
            </button>

            <button
              className="primary-button"
              disabled={salvando}
            >
              <Save size={16} />
              Salvar
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

function CampoCliente({
  label,
  name,
  value,
  onChange
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
      />

    </div>
  )
}

function ModalProduto({
  dados,
  alterarCampo,
  salvar,
  fechar,
  salvando,
  editando
}) {
  const servico = dados.tipo === 'servico'

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">

          <div>
            <h3>
              {editando
                ? 'Editar cadastro'
                : 'Novo produto ou serviço'}
            </h3>
          </div>

          <button
            className="modal-close"
            onClick={fechar}
          >
            <X size={18} />
          </button>

        </div>

        <form onSubmit={salvar}>

          <div className="modal-body">

            <div className="form-grid">

              <div className="form-group">

                <label>Tipo</label>

                <select
                  name="tipo"
                  value={dados.tipo}
                  onChange={alterarCampo}
                >
                  <option value="produto">Produto</option>
                  <option value="servico">Serviço</option>
                </select>

              </div>

              <div className="form-group field-large">

                <label>Nome *</label>

                <input
                  name="nome"
                  value={dados.nome}
                  onChange={alterarCampo}
                  required
                />

              </div>

              <CampoCliente
                label="Código"
                name="codigo"
                value={dados.codigo}
                onChange={alterarCampo}
              />

              <CampoCliente
                label="Categoria"
                name="categoria"
                value={dados.categoria}
                onChange={alterarCampo}
              />

              <div className="form-group">
                <label>Preço de custo</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="custo"
                  value={dados.custo}
                  onChange={alterarCampo}
                />
              </div>

              {!servico && (
                <>
                  <div className="form-group">
                    <label>Lucro desejado (%)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="percentual_lucro"
                      value={dados.percentual_lucro}
                      onChange={alterarCampo}
                      placeholder="20"
                    />
                  </div>

                  <div className="form-group">
                    <label>Lucro por unidade</label>

                    <div className="calculated-field profit">
                      {formatarMoeda(
                        Math.max(
                          0,
                          Number(
                            dados.preco_sugerido || 0
                          ) -
                          Number(
                            dados.custo || 0
                          )
                        )
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Preço sugerido</label>

                    <div className="calculated-field suggested">
                      {formatarMoeda(
                        dados.preco_sugerido || 0
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Preço de venda</label>

                <input
                  type="number"
                  step="0.01"
                  name="valor_venda"
                  value={dados.valor_venda}
                  onChange={alterarCampo}
                  required
                />
              </div>

              {!servico && (
                <>
                  <div className="form-group">
                    <label>Estoque (opcional)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="estoque"
                      value={dados.estoque}
                      onChange={alterarCampo}
                      placeholder="0"
                    />
                  </div>
                </>
              )}

            </div>

            <div className="form-group">
              <label>Descrição</label>

              <textarea
                name="descricao"
                value={dados.descricao}
                onChange={alterarCampo}
                rows="3"
              />
            </div>

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="secondary-button"
              onClick={fechar}
            >
              Cancelar
            </button>

            <button
              className="primary-button"
              disabled={salvando}
            >
              <Save size={16} />
              Salvar
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

function ModalImportarXml({
  dados,
  carregando,
  salvando,
  selecionarXml,
  alterarLucro,
  confirmar,
  fechar
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          fechar()
        }
      }}
    >
      <div className="modal-box xml-modal">

        <div className="modal-header">
          <div>
            <h3>Importar XML da NF-e</h3>
            <p>
              Selecione o XML enviado pelo fornecedor.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={fechar}
            disabled={salvando}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">

          {!dados && (
            <div className="xml-upload-area">

              <div className="xml-upload-icon">
                <FileText size={28} />
              </div>

              <h4>Selecione o XML da nota fiscal</h4>

              <p>
                O sistema vai identificar fornecedor,
                nota, produtos, valores e custos.
              </p>

              <label className="primary-button xml-file-button">
                Selecionar XML

                <input
                  type="file"
                  accept=".xml,text/xml,application/xml"
                  onChange={selecionarXml}
                  disabled={carregando}
                  hidden
                />
              </label>

              {carregando && (
                <div className="xml-loading">
                  <Loader2
                    size={17}
                    className="spinner"
                  />
                  Lendo XML...
                </div>
              )}

            </div>
          )}

          {dados && (
            <>
              <div className="xml-note-header">

                <div>
                  <span>Fornecedor</span>
                  <strong>
                    {dados.fornecedor.nome_fantasia ||
                      dados.fornecedor.razao_social ||
                      'Fornecedor'}
                  </strong>

                  <small>
                    {dados.fornecedor.cnpj ||
                      'CNPJ não informado'}
                  </small>
                </div>

                <div>
                  <span>NF-e</span>
                  <strong>
                    {dados.nota.numero_nota || '-'}
                  </strong>
                  <small>
                    Série {dados.nota.serie || '-'}
                  </small>
                </div>

                <div>
                  <span>Emissão</span>
                  <strong>
                    {dados.nota.data_emissao
                      ? new Date(
                          dados.nota.data_emissao
                        ).toLocaleDateString('pt-BR')
                      : '-'}
                  </strong>
                </div>

                <div>
                  <span>Total da nota</span>
                  <strong>
                    {formatarMoeda(
                      dados.nota.valor_total
                    )}
                  </strong>
                </div>

              </div>

              <div className="form-section-title">
                Produtos da nota
              </div>

              <div className="xml-items">

                {dados.itens.map((item, indice) => {
                  const custo = Number(
                    item.custo_unitario_final || 0
                  )

                  const preco = Number(
                    item.preco_sugerido || 0
                  )

                  const lucro = preco - custo

                  return (
                    <div
                      className="xml-item-card"
                      key={`${item.numero_item}-${indice}`}
                    >

                      <div className="xml-item-top">
                        <div>
                          <strong>
                            {item.nome_produto}
                          </strong>

                          <span>
                            Código: {item.codigo_fornecedor || '-'}
                          </span>

                          {item.ean_gtin && (
                            <span>
                              GTIN: {item.ean_gtin}
                            </span>
                          )}
                        </div>

                        <div
                          className={
                            item.produto_encontrado
                              ? 'xml-match found'
                              : 'xml-match new'
                          }
                        >
                          {item.produto_encontrado
                            ? 'Produto encontrado'
                            : 'Novo produto'}
                        </div>
                      </div>

                      <div className="xml-item-grid">

                        <div>
                          <span>Quantidade</span>
                          <strong>
                            {formatarQuantidade(
                              item.quantidade
                            )}{' '}
                            {item.unidade || ''}
                          </strong>
                        </div>

                        <div>
                          <span>Custo unitário</span>
                          <strong>
                            {formatarMoeda(custo)}
                          </strong>
                        </div>

                        <div className="xml-profit-field">
                          <span>Lucro desejado</span>

                          <div className="xml-percent-input">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.percentual_lucro}
                              onChange={(e) =>
                                alterarLucro(
                                  indice,
                                  e.target.value
                                )
                              }
                            />
                            <b>%</b>
                          </div>
                        </div>

                        <div>
                          <span>Lucro por unidade</span>
                          <strong className="profit-value">
                            {formatarMoeda(lucro)}
                          </strong>
                        </div>

                        <div>
                          <span>Preço sugerido</span>
                          <strong className="suggested-price">
                            {formatarMoeda(preco)}
                          </strong>
                        </div>

                        {item.produto_encontrado && (
                          <div>
                            <span>Preço atual</span>
                            <strong>
                              {formatarMoeda(
                                item.valor_venda_atual
                              )}
                            </strong>
                          </div>
                        )}

                      </div>

                    </div>
                  )
                })}

              </div>

              <div className="xml-note-summary">

                <div>
                  <span>Produtos</span>
                  <strong>{dados.itens.length}</strong>
                </div>

                <div>
                  <span>Valor dos produtos</span>
                  <strong>
                    {formatarMoeda(
                      dados.nota.valor_produtos
                    )}
                  </strong>
                </div>

                <div>
                  <span>Frete</span>
                  <strong>
                    {formatarMoeda(
                      dados.nota.valor_frete
                    )}
                  </strong>
                </div>

                <div>
                  <span>Total NF-e</span>
                  <strong>
                    {formatarMoeda(
                      dados.nota.valor_total
                    )}
                  </strong>
                </div>

              </div>
            </>
          )}

        </div>

        <div className="modal-footer">

          <button
            type="button"
            className="secondary-button"
            onClick={fechar}
            disabled={salvando}
          >
            Cancelar
          </button>

          {dados && (
            <button
              type="button"
              className="primary-button"
              onClick={confirmar}
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <Loader2
                    size={16}
                    className="spinner"
                  />
                  Importando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirmar entrada
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  )
}

function StatusOrcamento({ status }) {
  return (
    <span className={`budget-status status-${status}`}>
      {nomeStatus(status)}
    </span>
  )
}

function MiniCard({ icone, titulo, valor }) {
  return (
    <div className="mini-card">

      <div className="mini-card-icon">
        {icone}
      </div>

      <div>
        <span>{titulo}</span>
        <strong>{valor}</strong>
      </div>

    </div>
  )
}

function Carregando({ texto }) {
  return (
    <div className="loading-list">
      <Loader2 className="spinner" size={20} />
      {texto}
    </div>
  )
}

function Vazio({ icone, titulo, texto }) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        {icone}
      </div>

      <h4>{titulo}</h4>
      <p>{texto}</p>

    </div>
  )
}

function PaginaOrdens({
  ordens,
  carregando,
  busca,
  setBusca,
  visualizar,
  editar,
  excluir
}) {
  return (
    <>
      <header className="topbar">

        <div>
          <h2>Ordens de Serviço</h2>

          <p>
            {ordens.length} ordens encontradas
          </p>
        </div>

      </header>

      <section className="panel">

        <div className="clients-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              value={busca}
              onChange={(e) =>
                setBusca(e.target.value)
              }
              placeholder="Buscar por ordem, cliente, orçamento ou técnico..."
            />

          </div>

        </div>

        {carregando ? (
          <Carregando
            texto="Carregando ordens de serviço..."
          />
        ) : ordens.length === 0 ? (
          <Vazio
            icone={<Wrench size={19} />}
            titulo="Nenhuma Ordem de Serviço encontrada"
            texto="As Ordens de Serviço são criadas a partir de orçamentos aprovados."
          />
        ) : (
          <div className="table-wrapper">

            <table className="clients-table">

              <thead>
                <tr>
                  <th>OS</th>
                  <th>Cliente</th>
                  <th>Orçamento</th>
                  <th>Técnico</th>
                  <th>Status</th>

                  <th className="actions-column">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>

                {ordens.map((ordem) => (
                  <tr key={ordem.id}>

                    <td>
                      <div className="client-name">
                        {ordem.numero}
                      </div>

                      <div className="client-secondary">
                        Aberta em{' '}
                        {formatarData(
                          ordem.data_abertura
                        )}
                      </div>
                    </td>

                    <td>
                      {ordem.clientes?.nome ||
                        'Cliente não encontrado'}
                    </td>

                    <td>
                      {ordem.orcamentos?.numero ||
                        'Sem orçamento'}
                    </td>

                    <td>
                      {ordem.tecnico ||
                        'Não definido'}
                    </td>

                    <td>
                      <StatusOS
                        status={ordem.status}
                      />
                    </td>

                    <td className="actions-column">

                      <button
                        className="icon-button"
                        title="Visualizar / PDF"
                        onClick={() =>
                          visualizar(ordem)
                        }
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="icon-button"
                        title="Editar Ordem de Serviço"
                        onClick={() =>
                          editar(ordem)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        title="Excluir Ordem de Serviço"
                        onClick={() =>
                          excluir(ordem)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>
    </>
  )
}

function ModalOrdem({
  ordem,
  dados,
  alterarCampo,
  salvar,
  fechar,
  salvando
}) {
  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <div className="modal-header">

          <div>
            <h3>
              {ordem.numero}
            </h3>

            <p>
              Orçamento{' '}
              {ordem.orcamentos?.numero || ''}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={fechar}
            disabled={salvando}
          >
            <X size={18} />
          </button>

        </div>

        <form onSubmit={salvar}>

          <div className="modal-body">

            <div className="form-section-title first-section">
              Execução
            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>Status</label>

                <select
                  name="status"
                  value={dados.status}
                  onChange={alterarCampo}
                >
                  <option value="aberta">
                    Aberta
                  </option>

                  <option value="agendada">
                    Agendada
                  </option>

                  <option value="em_execucao">
                    Em execução
                  </option>

                  <option value="aguardando_peca">
                    Aguardando peça
                  </option>

                  <option value="concluida">
                    Concluída
                  </option>

                  <option value="cancelada">
                    Cancelada
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>Técnico responsável</label>

                <input
                  name="tecnico"
                  value={dados.tecnico}
                  onChange={alterarCampo}
                  placeholder="Nome do técnico"
                />

              </div>

              <div className="form-group">

                <label>Agendamento</label>

                <input
                  type="datetime-local"
                  name="data_agendamento"
                  value={dados.data_agendamento}
                  onChange={alterarCampo}
                />

              </div>

            </div>

            <div className="form-section-title">
              Atendimento
            </div>

            <div className="form-group">

              <label>
                Serviço solicitado
              </label>

              <textarea
                name="problema_relatado"
                value={dados.problema_relatado}
                onChange={alterarCampo}
                rows="3"
                placeholder="Descreva o serviço que deverá ser realizado..."
              />

            </div>

            <div className="form-group">

              <label>Serviço realizado</label>

              <textarea
                name="servico_executado"
                value={dados.servico_executado}
                onChange={alterarCampo}
                rows="4"
                placeholder="Descreva o que foi realizado no atendimento..."
              />

            </div>

            <div className="form-group">

              <label>Observações</label>

              <textarea
                name="observacoes"
                value={dados.observacoes}
                onChange={alterarCampo}
                rows="3"
                placeholder="Observações adicionais..."
              />

            </div>

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="secondary-button"
              onClick={fechar}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={salvando}
            >

              {salvando ? (
                <>
                  <Loader2
                    className="spinner"
                    size={16}
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Salvar OS
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

function StatusOS({ status }) {
  const nomes = {
    aberta: 'Aberta',
    agendada: 'Agendada',
    em_execucao: 'Em execução',
    aguardando_peca: 'Aguardando peça',
    concluida: 'Concluída',
    cancelada: 'Cancelada'
  }

  return (
    <span
      className={`budget-status os-status-${status}`}
    >
      {nomes[status] || status}
    </span>
  )
}

function PaginaRelatorios({
  inicio,
  fim,
  setInicio,
  setFim,
  status,
  setStatus,
  cliente,
  setCliente,
  clientes,
  orcamentos,
  ordens,
  novosClientes,
  valorOrcado,
  valorAprovado,
  aprovados,
  concluidas,
  imprimir
}) {
  function usarMesAtual() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')

    setInicio(`${ano}-${mes}-01`)
    setFim(`${ano}-${mes}-${dia}`)
  }

  function usarUltimos30Dias() {
    const fimPeriodo = new Date()
    const inicioPeriodo = new Date()

    inicioPeriodo.setDate(
      inicioPeriodo.getDate() - 29
    )

    setInicio(formatarDataInput(inicioPeriodo))
    setFim(formatarDataInput(fimPeriodo))
  }

  return (
    <>
      <header className="topbar">

        <div>
          <h2>Relatórios</h2>
          <p>
            Consulte os resultados do período selecionado.
          </p>
        </div>

      </header>

      <section className="report-filters">

        <div className="report-date-field">
          <label>Data inicial</label>

          <input
            type="date"
            value={inicio}
            onChange={(e) =>
              setInicio(e.target.value)
            }
          />
        </div>

        <div className="report-date-field">
          <label>Data final</label>

          <input
            type="date"
            value={fim}
            onChange={(e) =>
              setFim(e.target.value)
            }
          />
        </div>

        <div className="report-select-field">
          <label>Status do orçamento</label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="todos">
              Todos
            </option>
            <option value="rascunho">
              Rascunho
            </option>
            <option value="enviado">
              Enviado
            </option>
            <option value="aguardando_aprovacao">
              Aguardando aprovação
            </option>
            <option value="aprovado">
              Aprovado
            </option>
            <option value="em_execucao">
              Em execução
            </option>
            <option value="concluido">
              Concluído
            </option>
            <option value="recusado">
              Recusado
            </option>
            <option value="cancelado">
              Cancelado
            </option>
          </select>
        </div>

        <div className="report-select-field report-client-field">
          <label>Cliente</label>

          <select
            value={cliente}
            onChange={(e) =>
              setCliente(e.target.value)
            }
          >
            <option value="todos">
              Todos os clientes
            </option>

            {clientes.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="report-shortcuts">
          <button
            type="button"
            className="secondary-button"
            onClick={usarMesAtual}
          >
            Este mês
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={usarUltimos30Dias}
          >
            Últimos 30 dias
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={imprimir}
          >
            <FileText size={15} />
            Imprimir / PDF
          </button>
        </div>

      </section>

      <section className="report-cards">

        <div className="report-card">
          <span>Orçamentos emitidos</span>
          <strong>{orcamentos.length}</strong>
          <small>
            {formatarMoeda(valorOrcado)} orçados
          </small>
        </div>

        <div className="report-card">
          <span>Orçamentos aprovados</span>
          <strong>{aprovados}</strong>
          <small>
            {formatarMoeda(valorAprovado)} aprovados
          </small>
        </div>

        <div className="report-card">
          <span>OS concluídas</span>
          <strong>{concluidas}</strong>
          <small>
            {ordens.length} OS no período
          </small>
        </div>

        <div className="report-card">
          <span>Novos clientes</span>
          <strong>{novosClientes}</strong>
          <small>
            Cadastros no período
          </small>
        </div>

      </section>

      <section className="report-grid">

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Orçamentos no período</h3>
              <p>
                Valores e status dos orçamentos emitidos.
              </p>
            </div>
          </div>

          {orcamentos.length === 0 ? (
            <Vazio
              icone={<FileText size={19} />}
              titulo="Nenhum orçamento no período"
              texto="Altere as datas para consultar outro período."
            />
          ) : (
            <div className="table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>Orçamento</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {orcamentos.map((orcamento) => (
                    <tr key={orcamento.id}>

                      <td>
                        <div className="client-name">
                          {orcamento.numero}
                        </div>
                      </td>

                      <td>
                        {orcamento.clientes?.nome ||
                          'Cliente'}
                      </td>

                      <td>
                        {formatarData(
                          orcamento.data_orcamento
                        )}
                      </td>

                      <td>
                        <StatusOrcamento
                          status={orcamento.status}
                        />
                      </td>

                      <td>
                        <strong>
                          {formatarMoeda(
                            orcamento.total
                          )}
                        </strong>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

        <div className="panel">

          <div className="panel-header">
            <div>
              <h3>Ordens de Serviço no período</h3>
              <p>
                Ordens de Serviço geradas no período.
              </p>
            </div>
          </div>

          {ordens.length === 0 ? (
            <Vazio
              icone={<Wrench size={19} />}
              titulo="Nenhuma Ordem de Serviço no período"
              texto="As Ordens de Serviço do período aparecerão aqui."
            />
          ) : (
            <div className="table-wrapper">

              <table className="clients-table">

                <thead>
                  <tr>
                    <th>OS</th>
                    <th>Cliente</th>
                    <th>Abertura</th>
                    <th>Status</th>
                    <th>Técnico</th>
                  </tr>
                </thead>

                <tbody>
                  {ordens.map((ordem) => (
                    <tr key={ordem.id}>

                      <td>
                        <div className="client-name">
                          {ordem.numero}
                        </div>
                      </td>

                      <td>
                        {ordem.clientes?.nome ||
                          'Cliente'}
                      </td>

                      <td>
                        {formatarData(
                          ordem.data_abertura
                        )}
                      </td>

                      <td>
                        <StatusOS
                          status={ordem.status}
                        />
                      </td>

                      <td>
                        {ordem.tecnico ||
                          'Não definido'}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </section>
    </>
  )
}

function PaginaConfiguracoes({
  dados,
  alterarCampo,
  salvar,
  carregando,
  salvando
}) {
  if (carregando) {
    return (
      <>
        <header className="topbar">
          <div>
            <h2>Configurações</h2>
            <p>
              Dados usados nos documentos e no sistema
            </p>
          </div>
        </header>

        <section className="panel">
          <Carregando
            texto="Carregando configurações..."
          />
        </section>
      </>
    )
  }

  const enderecoResumo = [
    dados.endereco,
    dados.numero,
    dados.bairro
  ]
    .filter(Boolean)
    .join(', ')

  const cidadeResumo = [
    dados.cidade,
    dados.estado
  ]
    .filter(Boolean)
    .join(' / ')

  return (
    <>
      <header className="topbar settings-topbar-final">

        <div>
          <div className="settings-eyebrow">
            PREFERÊNCIAS
          </div>

          <h2>Configurações</h2>

          <p>
            Informações exibidas nos orçamentos,
            Ordens de Serviço e relatórios
          </p>
        </div>

        <button
          type="submit"
          form="form-configuracoes"
          className="primary-button"
          disabled={salvando}
        >
          {salvando ? (
            <>
              <Loader2
                className="spinner"
                size={16}
              />
              Salvando...
            </>
          ) : (
            <>
              <Save size={16} />
              Salvar alterações
            </>
          )}
        </button>

      </header>

      <form
        id="form-configuracoes"
        onSubmit={salvar}
      >

        <section className="settings-layout-final">

          <div className="settings-main-column">

            <div className="panel settings-section-card">

              <div className="settings-section-header">

                <div className="settings-section-icon">
                  <Settings size={17} />
                </div>

                <div>
                  <h3>Dados da empresa</h3>

                  <p>
                    Informações principais da INFRATEC
                  </p>
                </div>

              </div>

              <div className="settings-section-body">

                <div className="form-grid">

                  <div className="form-group">
                    <label>Nome fantasia *</label>

                    <input
                      name="nome_fantasia"
                      value={dados.nome_fantasia}
                      onChange={alterarCampo}
                      required
                    />
                  </div>

                  <div className="form-group field-large">
                    <label>Razão social</label>

                    <input
                      name="razao_social"
                      value={dados.razao_social}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>CNPJ</label>

                    <input
                      name="cnpj"
                      value={dados.cnpj}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone</label>

                    <input
                      name="telefone"
                      value={dados.telefone}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>WhatsApp</label>

                    <input
                      name="whatsapp"
                      value={dados.whatsapp}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail</label>

                    <input
                      type="email"
                      name="email"
                      value={dados.email}
                      onChange={alterarCampo}
                    />
                  </div>

                </div>

              </div>

            </div>

            <div className="panel settings-section-card">

              <div className="settings-section-header">

                <div className="settings-section-icon">
                  <Users size={17} />
                </div>

                <div>
                  <h3>Endereço</h3>

                  <p>
                    Endereço usado nos documentos emitidos
                  </p>
                </div>

              </div>

              <div className="settings-section-body">

                <div className="form-grid">

                  <div className="form-group">
                    <label>CEP</label>

                    <input
                      name="cep"
                      value={dados.cep}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group field-large">
                    <label>Endereço</label>

                    <input
                      name="endereco"
                      value={dados.endereco}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>Número</label>

                    <input
                      name="numero"
                      value={dados.numero}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>Bairro</label>

                    <input
                      name="bairro"
                      value={dados.bairro}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>Cidade</label>

                    <input
                      name="cidade"
                      value={dados.cidade}
                      onChange={alterarCampo}
                    />
                  </div>

                  <div className="form-group">
                    <label>UF</label>

                    <input
                      name="estado"
                      value={dados.estado}
                      onChange={alterarCampo}
                      maxLength="2"
                    />
                  </div>

                </div>

              </div>

            </div>

            <div className="panel settings-section-card">

              <div className="settings-section-header">

                <div className="settings-section-icon">
                  <Package size={17} />
                </div>

                <div>
                  <h3>Identidade visual</h3>

                  <p>
                    Logo usada nos documentos do sistema
                  </p>
                </div>

              </div>

              <div className="settings-section-body">

                <div className="form-group">
                  <label>URL da logo</label>

                  <input
                    name="logo_url"
                    value={dados.logo_url}
                    onChange={alterarCampo}
                    placeholder="https://..."
                  />

                  <div className="settings-help">
                    A logo aparece nos orçamentos,
                    Ordens de Serviço e relatórios.
                  </div>
                </div>

              </div>

            </div>

          </div>

          <aside className="settings-preview-final">

            <div className="settings-preview-card">

              <div className="settings-preview-label">
                PRÉVIA DA EMPRESA
              </div>

              <div className="settings-preview-logo-wrap">

                {dados.logo_url ? (
                  <img
                    src={dados.logo_url}
                    alt="Logo da empresa"
                    className="settings-preview-logo"
                  />
                ) : (
                  <div className="settings-preview-letter">
                    {String(
                      dados.nome_fantasia ||
                      'I'
                    )
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                )}

              </div>

              <h3>
                {dados.nome_fantasia ||
                  'Nome da empresa'}
              </h3>

              {dados.razao_social && (
                <p className="settings-preview-razao">
                  {dados.razao_social}
                </p>
              )}

              <div className="settings-preview-divider" />

              <div className="settings-preview-info">

                {dados.cnpj && (
                  <div>
                    <span>CNPJ</span>
                    <strong>{dados.cnpj}</strong>
                  </div>
                )}

                {dados.telefone && (
                  <div>
                    <span>Telefone</span>
                    <strong>{dados.telefone}</strong>
                  </div>
                )}

                {dados.email && (
                  <div>
                    <span>E-mail</span>
                    <strong>{dados.email}</strong>
                  </div>
                )}

                {enderecoResumo && (
                  <div>
                    <span>Endereço</span>
                    <strong>
                      {enderecoResumo}
                    </strong>
                  </div>
                )}

                {cidadeResumo && (
                  <div>
                    <span>Cidade</span>
                    <strong>
                      {cidadeResumo}
                    </strong>
                  </div>
                )}

              </div>

            </div>

            <div className="settings-preview-note">

              <div className="settings-preview-note-icon">
                <FileText size={16} />
              </div>

              <div>
                <strong>
                  Dados dos documentos
                </strong>

                <span>
                  Essas informações são usadas
                  automaticamente nos PDFs do sistema.
                </span>
              </div>

            </div>

          </aside>

        </section>

      </form>
    </>
  )
}

function PaginaEmConstrucao({
  titulo,
  descricao,
  icone
}) {
  return (
    <>
      <header className="topbar">
        <div>
          <h2>{titulo}</h2>
          <p>{descricao}</p>
        </div>
      </header>

      <section className="panel">
        <Vazio
          icone={icone}
          titulo={titulo}
          texto="Este módulo será desenvolvido em seguida."
        />
      </section>
    </>
  )
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

function formatarQuantidade(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    maximumFractionDigits: 2
  })
}

function formatarDataHora(data) {
  if (!data) {
    return '-'
  }

  return new Date(data).toLocaleString(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short'
    }
  )
}

function formatarData(data) {
  if (!data) return '-'

  return new Date(`${data}T12:00:00`).toLocaleDateString(
    'pt-BR'
  )
}

function dataDentroPeriodo(data, inicio, fim) {
  if (!data) {
    return false
  }

  const dataComparacao = String(data).slice(0, 10)

  if (
    inicio &&
    dataComparacao < inicio
  ) {
    return false
  }

  if (
    fim &&
    dataComparacao > fim
  ) {
    return false
  }

  return true
}

function formatarDataInput(data) {
  const ano = data.getFullYear()
  const mes = String(
    data.getMonth() + 1
  ).padStart(2, '0')
  const dia = String(
    data.getDate()
  ).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function nomeStatus(status) {
  const nomes = {
    rascunho: 'Rascunho',
    enviado: 'Enviado',
    aguardando_aprovacao: 'Aguardando aprovação',
    aprovado: 'Aprovado',
    em_execucao: 'Em execução',
    concluido: 'Concluído',
    recusado: 'Recusado',
    cancelado: 'Cancelado',
    vencido: 'Vencido'
  }

  return nomes[status] || status
}
function formatarPercentual(valor) {
  return Number(
    valor || 0
  ).toLocaleString(
    'pt-BR',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  )
}
export default App