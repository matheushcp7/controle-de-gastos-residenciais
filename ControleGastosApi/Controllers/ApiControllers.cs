using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;
using ControleGastosApi.Models;

namespace ControleGastosApi.Controllers;

[ApiController]
[Route("api")]

/// <summary>
/// "Controlador" responsável por gerenciar as operações relacionadas a pessoas e transações. 
/// </summary>
public class ApiControllers : ControllerBase
{
    private readonly Banco _context;

    public ApiControllers(Banco context)
    {
        _context = context;
    }

    /// <summary>
    /// Retorna uma lista de todas as pessoas cadastradas no sistema.
    /// </summary>      

    [HttpGet("pessoas")]
    public async Task<IActionResult> GetPessoas() => Ok(await _context.Pessoas.ToListAsync());

    /// <summary>
    /// Cria uma nova pessoa no sistema.   
    /// </summary>
    /// <param name="pessoa">Objeto Pessoa a ser criado.</param> 
    [HttpPost("pessoas")]
    public async Task<IActionResult> CreatePessoa(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();
        return Ok(pessoa);
    }

    /// <summary>
    /// Exclui uma pessoa do sistema com base no ID fornecido.      
    /// </summary>
    /// <param name="id">Representa o ID da pessoa a ser excluída.</param>
    [HttpDelete("pessoas/{id}")]
    public async Task<IActionResult> DeletePessoa(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null) return NotFound();

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return NoContent();
    }


    /// <summary>
    /// Retorna uma lista de todas as transações cadastradas no sistema.
    /// </summary>
    [HttpGet("transacoes")]
    public async Task<IActionResult> GetTransacoes() => Ok(await _context.Transacoes.ToListAsync());

    /// <summary>
    /// Cria uma nova transação no sistema. 
    /// </summary>
    /// <param name="transacao">Objeto Transacao a ser criado.</param>
    [HttpPost("transacoes")]
    public async Task<IActionResult> CreateTransacao(Transacao transacao)
    {
        var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
        if (pessoa == null) return BadRequest("Pessoa não encontrada.");

        // Menores de 18 anos só podem registrar despesas
        if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            return BadRequest("Menores de idade só podem registrar despesas.");

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();
        return Ok(transacao);
    }


    /// <summary>
    /// Retorna os totais de receitas, despesas e saldo para cada pessoa, bem como os totais gerais do sistema.
    /// </summary> 
    [HttpGet("totais")]
    public async Task<IActionResult> GetTotais()
    {
        var totaisPessoas = await _context.Pessoas
            .Select(p => new
            {
                p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) -
                        p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToListAsync();

        var totalGeralReceitas = totaisPessoas.Sum(p => p.TotalReceitas);
        var totalGeralDespesas = totaisPessoas.Sum(p => p.TotalDespesas);

        return Ok(new
        {
            Detalhes = totaisPessoas,
            TotalGeral = new
            {
                TotalReceitas = totalGeralReceitas,
                TotalDespesas = totalGeralDespesas,
                SaldoLiquido = totalGeralReceitas - totalGeralDespesas
            }
        });
    }

    /// <summary>   
    /// Retorna todas as transações associadas a uma pessoa específica com base no ID fornecido.
    /// </summary>
    /// <param name="id">Representa o ID da pessoa cujas transações serão retornadas.</param>
    [HttpGet("pessoas/{id}/transacoes")]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoesPorPessoa(int id)
    {
        var transacoes = await _context.Transacoes
                                       .Where(t => t.PessoaId == id)
                                       .ToListAsync();
        return Ok(transacoes);
    }
}
