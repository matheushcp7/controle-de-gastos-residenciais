using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;
using ControleGastosApi.Models;
using ControleGastosApi.Services;

namespace ControleGastosApi.Controllers;

[ApiController]
[Route("api/transacoes")]
/// <summary>
/// Controlador que gerencia as operações relacionadas a transações. 
/// </summary>
public class TransacoesController : ControllerBase
{
    private readonly Banco _context;
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(Banco context, ITransacaoService transacaoService)
    {
        _context = context;
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Retorna uma lista de todas as transações cadastradas no sistema.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetTransacoes() => Ok(await _context.Transacoes.ToListAsync());

    /// <summary>
    /// Cria uma nova transação no sistema. 
    /// </summary>
    /// <param name="transacao">Objeto Transacao a ser criado.</param>
    [HttpPost]
    public async Task<IActionResult> CreateTransacao(Transacao transacao)
    {
        var resultado = await _transacaoService.AdicionarTransacaoAsync(transacao);

        if (!resultado.Sucesso)
            return BadRequest(resultado.Mensagem);

        return Ok(transacao);
    }
}