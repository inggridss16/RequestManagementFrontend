using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace RequestManagementWeb.Controllers
{
    [Authorize] //tambahin authorize biar user ga sembarangan masuk lewat url
    public class RequestController : Controller
    {
        private readonly IConfiguration _configuration;

        // Inject IConfiguration through the constructor
        public RequestController(IConfiguration configuration)
        {
            _configuration = configuration;
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
        
        public IActionResult Expense()
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
