import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5242/api';

type Pessoa = { id: number; nome: string; idade: number };
// Novo tipo para podermos listar as transações
type Transacao = { id: number; descricao: string; valor: number; tipo: number; pessoaId: number };

type DadosTotais = {
  detalhes: { nome: string; totalReceitas: number; totalDespesas: number; saldo: number }[];
  totalGeral: { totalReceitas: number; totalDespesas: number; saldoLiquido: number };
};

export default function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [totais, setTotais] = useState<DadosTotais | null>(null);

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('0'); 
  const [pessoaId, setPessoaId] = useState('');

  // Novos estados para o Extrato da Pessoa
  const [extratoPessoaId, setExtratoPessoaId] = useState('');
  const [transacoesFiltradas, setTransacoesFiltradas] = useState<Transacao[]>([]);

  const carregarDados = async () => {
    try {
      const [resPessoas, resTotais] = await Promise.all([
        axios.get(`${API}/pessoas`),
        axios.get(`${API}/totais`)
      ]);
      setPessoas(resPessoas.data);
      setTotais(resTotais.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    carregarDados();
  }, []);

  // Nova função para buscar o extrato quando selecionar uma pessoa
  const buscarExtrato = async (id: string) => {
    setExtratoPessoaId(id);
    if (!id) {
      setTransacoesFiltradas([]);
      return;
    }
    try {
      const res = await axios.get(`${API}/pessoas/${id}/transacoes`);
      setTransacoesFiltradas(res.data);
    } catch (err) {
      console.error("Erro ao buscar extrato", err);
    }
  };

  const addPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${API}/pessoas`, { nome, idade: Number(idade) });
    setNome(''); setIdade('');
    carregarDados();
  };

  const deletarPessoa = async (id: number) => {
    await axios.delete(`${API}/pessoas/${id}`);
    // Limpa aba se deletar a pessoa selecionada
    if (extratoPessoaId === id.toString()) setExtratoPessoaId(''); 
    carregarDados();
  };

  const addTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/transacoes`, {
        descricao,
        valor: Number(valor),
        tipo: Number(tipo),
        pessoaId: Number(pessoaId)
      });
      setDescricao(''); setValor('');
      carregarDados();
      
      if (extratoPessoaId === pessoaId) {
        buscarExtrato(pessoaId);
      }
    } catch (err) {
      // Verifica se é um erro do Axios (ex: o erro 400 BadRequest do seu backend)
      if (axios.isAxiosError(err)) {
        alert(err.response?.data || 'Erro ao cadastrar transação');
      } else {
        // Cai aqui se for um erro genérico de JavaScript ou falha de internet
        alert('Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem', backgroundColor: colorBlue, padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', color: colorWhite, marginBottom: '2rem' }}>Controle de Gastos Residenciais</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Card: Nova Pessoa */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={titulosStyle}>Cadastro de Pessoas</h3>
            <form onSubmit={addPessoa} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input style={inputStyle} placeholder="Nome:" value={nome} onChange={e => setNome(e.target.value)} required />
              <input 
                style={{...inputStyle, width: '80px'}} 
  type="number" 
  placeholder="Idade:" 
  value={idade} 
  min="0"
  onChange={e => {
    const valorDigitado = e.target.value;
    if (Number(valorDigitado) >= 0) setIdade(valorDigitado);
  }} 
  required 
/>
              <button style={btnPrimary} type="submit">Salvar</button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {pessoas.map(p => (
                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: colorBlack }}>{p.nome} ({p.idade} anos)</span>
                  <button style={btnDanger} onClick={() => deletarPessoa(p.id)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Nova Transação */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={titulosStyle}>Nova Transação</h3>
            <form onSubmit={addTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input style={inputStyle} placeholder="Descrição:" value={descricao} onChange={e => setDescricao(e.target.value)} required />
                <input style={{...inputStyle, width: '120px'}} type="number" placeholder="Valor (R$)" value={valor} onChange={e => setValor(e.target.value)} min="0" required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value)}>
                  <option value="0">Despesa</option>
                  <option value="1">Receita</option>
                </select>
                <select style={inputStyle} value={pessoaId} onChange={e => setPessoaId(e.target.value)} required>
                  <option value="">Selecione a pessoa</option>
                  {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <button style={{...btnPrimary,...titulosStyle,backgroundColor: colorBlack, width: '100%'}} type="submit">Adicionar Transação</button>
            </form>
          </div>
        </div>

        {/* Card: Resumo Geral */}
        {totais && (
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{...titulosStyle, borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}}>Resumo Geral</h2>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={thStyle}>Pessoa</th>
                  <th style={thStyle}>Receitas</th>
                  <th style={thStyle}>Despesas</th>
                  <th style={thStyle}>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {totais.detalhes.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{...tdStyle, color: colorBlack }}>{d.nome}</td>
                    <td style={{...tdStyle, color: colorReceita, fontWeight: 'bold' }}>R$ {d.totalReceitas.toFixed(2)}</td>
                    <td style={{...tdStyle, color: colorDespesa , fontWeight: 'bold' }}>R$ {d.totalDespesas.toFixed(2)}</td>
                    <td style={{...tdStyle, fontWeight: 'bold', color: d.saldo >= 0 ? colorReceita : colorDespesa }}>R$ {d.saldo.toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: colorBlue, color: '#fff' }}>
  <td style={{ ...tdStyle, borderBottomLeftRadius: '8px', fontWeight:'bold' }}>TOTAL GERAL</td>
  <td style={{ ...tdStyle, color: '#fff', fontWeight: 'bold' }}>R$ {totais.totalGeral.totalReceitas.toFixed(2)}</td>
  <td style={{ ...tdStyle, color: '#fff', fontWeight: 'bold' }}>R$ {totais.totalGeral.totalDespesas.toFixed(2)}</td>
  <td style={{ ...tdStyle, color: '#fff', borderBottomRightRadius: '8px', fontWeight: 'bold' }}>R$ {totais.totalGeral.saldoLiquido.toFixed(2)}</td>
</tr>
              </tbody>
            </table>
          </div>
        )}

        {/* CARD: Extrato Detalhado por Pessoa */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h2 style={titulosStyle}>Extrato Detalhado por Pessoa:
             <select 
            style={{...inputStyle, backgroundColor: colorBlue, fontWeight: 'bold', color: colorWhite, maxWidth: '300px', marginBottom: '0rem', marginTop: '0.5rem', marginLeft: '1rem', borderRadius: '4px', padding: '0.3rem'}} 
            value={extratoPessoaId} 
            onChange={e => buscarExtrato(e.target.value)}
            >
            <option value="">Selecione a pessoa</option>
            {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </h2>
          

          {extratoPessoaId && (
            <>
              {/* Reaproveita os totais da pessoa sem precisar ir no back-end calcular de novo */}
              {(() => {
                const pessoa = pessoas.find(p => p.id === Number(extratoPessoaId));
                const resumo = totais?.detalhes.find(d => d.nome === pessoa?.nome);
                
                return resumo ? (
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                    <div><strong style={{ color: colorBlack }}>Receitas:</strong> <span style={{ color: colorReceita, fontWeight: 'bold' }}>R$ {resumo.totalReceitas.toFixed(2)}</span></div>
                    <div><strong style={{ color: colorBlack }}>Despesas:</strong> <span style={{ color: colorDespesa, fontWeight: 'bold' }}>R$ {resumo.totalDespesas.toFixed(2)}</span></div>
                    <div><strong style={{ color: colorBlack }}>Saldo:</strong> <span style={{ fontWeight: 'bold', color: resumo.saldo >= 0 ? colorReceita : colorDespesa }}>R$ {resumo.saldo.toFixed(2)}</span></div>
                  </div>
                ) : null;
              })()}

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={thStyle}>Descrição</th>
                    <th style={thStyle}>Tipo</th>
                    <th style={thStyle}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoesFiltradas.length === 0 ? (
                    <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>Nenhuma transação registrada.</td></tr>
                  ) : (
                    transacoesFiltradas.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{...tdStyle, color: colorBlack }}>{t.descricao}</td>
                        <td style={{...tdStyle, color: colorBlack }}>{t.tipo === 1 ? 'Receita' : 'Despesa'}</td>
                        <td style={{...tdStyle, color: t.tipo === 1 ? colorReceita : colorDespesa, fontWeight: 'bold' }}>R$ {t.valor.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// Estilos padronizados
const colorBlue = '#397afc';
const colorDespesa = '#f83f3f';
const colorWhite = '#ebe9e9';
const colorBlack = '#383f49';
const colorReceita = '#383f49'; {/*Cor dos textos de Receita*/}
const titulosStyle = {backgroundColor: colorBlue, borderRadius: '8px', marginTop: 0, color: colorWhite, borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' };
const inputStyle = { padding: '0.5rem',backgroundColor: '#fff', color: colorBlack, border: '1px solid #d1d5db', borderRadius: '4px', flex: 1, outline: 'none' };
const btnPrimary = { backgroundColor: colorBlack, color: colorWhite, border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnDanger = { backgroundColor: colorBlack, color: colorWhite, border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' };
const thStyle = { padding: '1rem', color: colorBlack };
const tdStyle = { padding: '1rem' };