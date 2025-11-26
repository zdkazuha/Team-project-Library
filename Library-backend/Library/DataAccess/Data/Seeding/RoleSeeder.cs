using Microsoft.AspNetCore.Identity;
using DataAccess.Data.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace DataAccess.Data.Seeding
{
    public static class RoleSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            string[] roles = { "Admin", "User" };

            // Створення ролей
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // Отримання даних адміністратора з секретів
            var adminEmail = configuration["ADMIN_EMAIL"];
            var adminPassword = configuration["ADMIN_PASSWORD"];

            if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
            {
                var admin = await userManager.FindByEmailAsync(adminEmail);
                if (admin == null)
                {
                    var newAdmin = new User
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(newAdmin, adminPassword);
                    if (result.Succeeded)
                        await userManager.AddToRoleAsync(newAdmin, "Admin");
                }
            }
        }
    }
}