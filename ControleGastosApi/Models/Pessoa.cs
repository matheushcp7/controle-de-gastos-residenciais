using System.Text.Json.Serialization;

namespace ControleGastosApi.Models;


/// <summary>
/// Classe que representa uma pessoa no sistema e no banco de dados.
/// </summary>
public class Pessoa
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }

    [JsonIgnore]
    public List<Transacao> Transacoes { get; set; } = new();
}