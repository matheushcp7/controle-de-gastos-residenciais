using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;
using ControleGastosApi.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura o Banco de Dados (SQLite)
builder.Services.AddDbContext<Banco>(options =>
    options.UseSqlite("Data Source=banco.db"));

// 2. Adiciona o serviço de transações
builder.Services.AddScoped<ITransacaoService, TransacaoService>();

// 3. Configura o CORS para liberar o acesso do Front-End React
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// 4. Aplica o CORS e os Controllers
app.UseCors("PermitirReact");
app.MapControllers();

app.Run();