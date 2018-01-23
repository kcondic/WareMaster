using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/dashboard")]
    [Authorize]
    public class DashboardController : ApiController
    {
        public DashboardController()
        {
            _activityLogRepository = new ActivityLogRepository();
        }

        private readonly ActivityLogRepository _activityLogRepository;
    }
}
