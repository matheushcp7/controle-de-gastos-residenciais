using ControleGastosApi.Data;
using ControleGastosApi.Models;

namespace ControleGastosApi.Services;

/// <summary>
/// Classe que implementa os métodos do serviço de transações (as regras de negócio).
/// </summary>
public class TransacaoService : ITransacaoService
{
    private readonly Banco _context;

    public TransacaoService(Banco context)
    {
        _context = context;
    }

    public async Task<(bool Sucesso, string Mensagem)> AdicionarTransacaoAsync(Transacao transacao)
    {
        var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
        if (pessoa == null)
            return (false, "Pessoa não encontrada.");

        // Regra de negócio isolada aqui:
        if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            return (false, "Menores de idade só podem registrar despesas.");

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return (true, string.Empty);
    }
}