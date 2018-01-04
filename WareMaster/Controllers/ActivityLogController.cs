using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/activitylogs")]
    [Authorize]
    public class ActivityLogController : ApiController
    {
        public ActivityLogController()
        {
            _activityLogRepository = new ActivityLogRepository();
        }
        private readonly ActivityLogRepository _activityLogRepository;

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddActivityLog(ActivityLog activityLogToAdd)
        {
            _activityLogRepository.AddActivityLog(activityLogToAdd);
            return Ok(true);
        }
    }
}
