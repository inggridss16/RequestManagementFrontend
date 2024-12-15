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
    [Authorize] //tambahin authorize biar user ga sembarangan masuk lewat url
    public class UserController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;

        // Inject IConfiguration and IHttpClientFactory through the constructor
        public UserController(IConfiguration configuration, IHttpClientFactory clientFactory)
        {
            _configuration = configuration;
            _clientFactory = clientFactory;
        }

        public IActionResult Index()
        {
            ViewData["WebAPIUrl"] = _configuration["WebAPIUrl"];
            ViewData["CurrentUserId"] = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            ViewData["CurrentUserName"] = User.FindFirst(ClaimTypes.Name).Value;
            ViewData["CurrentDivisionId"] = User.FindFirst("DivisionId").Value;
            ViewData["CurrentRoleId"] = User.FindFirst(ClaimTypes.Role).Value;

            return View();
        }

        public IActionResult Details()
        {
            ViewData["WebAPIUrl"] = _configuration["WebAPIUrl"];
            ViewData["CurrentUserId"] = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            ViewData["CurrentUserName"] = User.FindFirst(ClaimTypes.Name).Value;
            ViewData["CurrentDivisionId"] = User.FindFirst("DivisionId").Value;
            ViewData["CurrentRoleId"] = User.FindFirst(ClaimTypes.Role).Value;

            return View();
        }
    }
}
