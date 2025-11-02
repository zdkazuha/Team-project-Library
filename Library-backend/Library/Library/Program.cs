using DataAccess.Data;
using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using BusinessLogic.Configurations;
using BusinessLogic.Interfaces;
using BusinessLogic.Services;


var builder = WebApplication.CreateBuilder(args);

string SomeeStr = builder.Configuration.GetConnectionString("SomeeStr")
    ?? throw new InvalidOperationException("Connection string 'SomeeStr' not found.");

// Add services to the container
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//  AutoMapper (сумісно з усіма версіями)
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MapperProfile>();
});

//  DbContext
builder.Services.AddDbContext<LibraryDbContext>(options =>
    options.UseSqlServer(SomeeStr));

// Repository
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddScoped<IBookService, BookService>();


var app = builder.Build();

// HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
