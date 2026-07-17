using ControleGastosApi.Models;

namespace ControleGastosApi.Services;

/// <summary>
/// Interface que define os métodos que o serviço de transações deve implementar.
/// </summary>
public interface ITransacaoService
{
    Task<(bool Sucesso, string Mensagem)> AdicionarTransacaoAsync(Transacao transacao);
}