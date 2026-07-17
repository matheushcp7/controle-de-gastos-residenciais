using Microsoft.EntityFrameworkCore;
using ControleGastosApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura o Banco de Dados (SQLite)
builder.Services.AddDbContext<Banco>(options =>
    options.UseSqlite("Data Source=banco.db"));

// 2. Configura o CORS para liberar o acesso do Front-End React
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

// 3. Aplica o CORS e os Controllers
app.UseCors("PermitirReact");
app.MapControllers();

app.Run();