import { useEffect, useState } from 'react';
import axios from 'axios';


// Definindo a URL base da API pra conexão com o backend
const API = 'http://localhost:5242/api';

// Tipos para as pessoas e os totais
type Pessoa = { id: number; nome: string; idade: number };
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

  // Função para carregar os dados de pessoas e totais do backend
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
    // Comentário abaixo desabilita a regra do eslint para evitar o aviso de dependências ausentes no useEffect
    // eslint-disable-next-line
    carregarDados();
  }, []);

  // Função para adicionar uma nova pessoa
  const addPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${API}/pessoas`, { nome, idade: Number(idade) });
    setNome(''); setIdade('');
    carregarDados();
  };
  // Função para deletar uma pessoa pelo ID
  const deletarPessoa = async (id: number) => {
    await axios.delete(`${API}/pessoas/${id}`);
    carregarDados();
  };
  // Função para adicionar uma nova transação
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
    } catch (err: any) {
      alert(err.response?.data || 'Erro ao cadastrar transação');
    }
  };

  // retorno do JSX do componente principal
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <h1 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '2rem' }}>Controle de Gastos Residenciais</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Card: Nova Pessoa */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#262626', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Cadastro de Pessoas</h3>
            <form onSubmit={addPessoa} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input style={inputStyle} placeholder="Nome:" value={nome} onChange={e => setNome(e.target.value)} required />
              <input style={{...inputStyle, width: '80px'}} type="number" placeholder="Idade:" value={idade} onChange={e => setIdade(e.target.value)} required />
              <button style={btnPrimary} type="submit">Salvar</button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {pessoas.map(p => (
                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#000000' }}>{p.nome} ({p.idade} anos)</span>
                  <button style={btnDanger} onClick={() => deletarPessoa(p.id)}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Nova Transação */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#374151', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Nova Transação</h3>
            <form onSubmit={addTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input style={inputStyle} placeholder="Descrição:" value={descricao} onChange={e => setDescricao(e.target.value)} required />
                <input style={{...inputStyle, width: '120px'}} type="number" placeholder="Valor (R$)" value={valor} onChange={e => setValor(e.target.value)} required />
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
              <button style={{...btnPrimary, width: '100%'}} type="submit">Adicionar Transação</button>
            </form>
          </div>

        </div>

        {/* Card: Resumo de Totais */}
        {totais && (
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, color: '#374151' }}>Resumo Geral</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                    <td style={{...tdStyle, color: '#000000' }}>{d.nome}</td>
                    <td style={{...tdStyle, color: '#10b981', fontWeight: 'bold' }}>R$ {d.totalReceitas.toFixed(2)}</td>
                    <td style={{...tdStyle, color: '#ef4444', fontWeight: 'bold' }}>R$ {d.totalDespesas.toFixed(2)}</td>
                    <td style={{...tdStyle, fontWeight: 'bold', color: d.saldo >= 0 ? '#10b981' : '#ef4444' }}>R$ {d.saldo.toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#1f2937', color: '#fff', fontWeight: 'bold' }}>
                  <td style={tdStyle}>TOTAL GERAL</td>
                  <td style={{...tdStyle, color: '#34d399'}}>R$ {totais.totalGeral.totalReceitas.toFixed(2)}</td>
                  <td style={{...tdStyle, color: '#f87171'}}>R$ {totais.totalGeral.totalDespesas.toFixed(2)}</td>
                  <td style={tdStyle}>R$ {totais.totalGeral.saldoLiquido.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
          </div>
        )}

      </div>
      
    </div>
  );
}

// Estilos padronizados
const inputStyle = { padding: '0.5rem',backgroundColor: '#fff', color: '#000', border: '1px solid #d1d5db', borderRadius: '4px', flex: 1, outline: 'none' };
const btnPrimary = { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnDanger = { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' };
const thStyle = { padding: '1rem', color: '#4b5563' };
const tdStyle = { padding: '1rem' };