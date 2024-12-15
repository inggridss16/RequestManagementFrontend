using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RequestManagementWeb.Models;
using System.Diagnostics;
using System.Security.Claims;

namespace RequestManagementWeb.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            ViewData["CurrentUserId"] = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            ViewData["CurrentUserName"] = User.FindFirst(ClaimTypes.Name).Value;
            ViewData["CurrentDivisionId"] = User.FindFirst("DivisionId").Value;
            ViewData["CurrentRoleId"] = User.FindFirst(ClaimTypes.Role).Value;

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
