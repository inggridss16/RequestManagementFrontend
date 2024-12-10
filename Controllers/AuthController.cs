using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using RequestManagementWeb.Models;
using System.Text.Json;

namespace RequestManagementWeb.Controllers
{
    public class AuthController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;

        // Inject IConfiguration and IHttpClientFactory through the constructor
        public AuthController(IConfiguration configuration, IHttpClientFactory clientFactory)
        {
            _configuration = configuration;
            _clientFactory = clientFactory;
        }

        public IActionResult Login()
        {
            ViewData["WebAPIUrl"] = _configuration["WebAPIUrl"];
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CheckLogin([FromBody] MstUser loginRequest)
        {
            try
            {
                // Create an HttpClient using the named client from IHttpClientFactory
                var client = _clientFactory.CreateClient("WebAPIClient");

                // Serialize the login request
                var jsonContent = new StringContent(
                    JsonSerializer.Serialize(loginRequest),
                    Encoding.UTF8,
                    "application/json"
                );

                // Make the API call to the LoginController
                var response = await client.PostAsync("/api/Login/CheckLogin", jsonContent);

                if (response.IsSuccessStatusCode)
                {
                    // Read the response content
                    var userJson = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    };
                    var user = JsonSerializer.Deserialize<MstUser>(userJson, options);

                    if (user != null)
                    {
                        // Create claims for authentication
                        var claims = new[]
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim(ClaimTypes.Name, user.UserName),
                            new Claim("DivisionId", user.DivisionId.ToString()),
                            new Claim(ClaimTypes.Role, user.RoleId.ToString())
                        };

                        // Create authentication cookie
                        var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme));
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                        return Ok(user);
                    }
                }

                // If login fails
                return Unauthorized(new { message = "Invalid username or password." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return RedirectToAction("Login");
        }
    }
}
