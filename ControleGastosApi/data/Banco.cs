using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Models;

namespace ControleGastosApi.Data;
/// <summary>
/// Classe que representa o banco de dados.
/// </summary>
public class Banco : DbContext
{
    public Banco(DbContextOptions<Banco> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Função que garante a exclusão em cascata (se deletar a pessoa, deleta as transações)
        modelBuilder.Entity<Pessoa>()
            .HasMany(p => p.Transacoes)
            .WithOne(t => t.Pessoa)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}