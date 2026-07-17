using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;
using ControleGastosApi.Models;

namespace ControleGastosApi.Controllers;

[ApiController]
[Route("api/pessoas")]
/// <summary>
/// Controlador que gerencia as operações relacionadas a pessoas
/// </summary>
public class PessoasController : ControllerBase
{
    private readonly Banco _context;

    public PessoasController(Banco context)
    {
        _context = context;
    }

    /// <summary>
    /// Retorna uma lista de todas as pessoas cadastradas no sistema
    /// </summary>       
    [HttpGet]
    public async Task<IActionResult> GetPessoas() => Ok(await _context.Pessoas.ToListAsync());

    /// <summary>
    /// Cria uma nova pessoa no sistema.   
    /// </summary>
    /// <param name="pessoa">Objeto Pessoa a ser criado.</param> 
    [HttpPost]
    public async Task<IActionResult> CreatePessoa(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();
        return Ok(pessoa);
    }

    /// <summary>
    /// Exclui uma pessoa do sistema com base no ID fornecido.      
    /// </summary>
    /// <param name="id">Representa o ID da pessoa a ser excluída</param>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePessoa(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null) return NotFound();

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>   
    /// Retorna todas as transações associadas a uma pessoa específica com base no ID fornecido.
    /// </summary>
    /// <param name="id">Representa o ID da pessoa cujas transações serão retornadas.</param>
    [HttpGet("{id}/transacoes")]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoesPorPessoa(int id)
    {
        var transacoes = await _context.Transacoes
                                       .Where(t => t.PessoaId == id)
                                       .ToListAsync();
        return Ok(transacoes);
    }
}