using System.Web.Mvc;

namespace WareMaster.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Shell()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
