using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;
using ControleGastosApi.Models;

namespace ControleGastosApi.Controllers;

[ApiController]
[Route("api/totais")]
/// <summary>
/// Controlador que gerencia as operações dos relatórios( dashboards). 
/// </summary>
public class TotaisController : ControllerBase
{
    private readonly Banco _context;

    public TotaisController(Banco context)
    {
        _context = context;
    }

    /// <summary>
    /// Retorna os totais de receitas, despesas e saldo para cada pessoa, bem como os totais gerais do sistema.
    /// </summary> 
    [HttpGet]
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
}