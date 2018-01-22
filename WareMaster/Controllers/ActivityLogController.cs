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

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetActivityLogs(int companyId, int currentPosition)
        {
            return Ok(_activityLogRepository.GetActivityLogs(companyId, currentPosition));
        }

        [HttpGet]
        [Route("getspecific")]
        public IHttpActionResult GetActivityLogsForEmployee(int employeeId)
        {
            return Ok(_activityLogRepository.GetActivityLogsForEmployee(employeeId));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddActivityLog(ActivityLog activityLogToAdd)
        {
            _activityLogRepository.AddActivityLog(activityLogToAdd);
            return Ok(true);
        }
    }
}
