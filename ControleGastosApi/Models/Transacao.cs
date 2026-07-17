namespace ControleGastosApi.Models;

///<summary>
/// Define os tipos permitidos para uma transação.
///</summary>
public enum TipoTransacao { Despesa, Receita }

/// <summary>
/// Classe que representa as Transações no sistema eno banco de dados.
/// </summary>
public class Transacao
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }

    public int PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}