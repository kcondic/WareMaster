using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WareMaster.Data.Models;
using WareMaster.Data.Models.Entities;

namespace WareMaster.Domain.Repositories
{
    public class ActivityLogRepository
    {
        public List<ActivityLog> GetAllActivityLogs(int companyId)
        {
            using (var context = new WarehouseContext())
                return context.ActivityLogs.Where(log => log.CompanyId == companyId)
                                           .OrderByDescending(order => order.TimeOfActivity)
                                           .ToList();
        }

        public void AddActivityLog(ActivityLog activityLogToAdd)
        {
            using (var context = new WarehouseContext())
            {
                activityLogToAdd.User = context.Users.Find(activityLogToAdd.UserId);
                activityLogToAdd.Company = context.Companies.Find(activityLogToAdd.CompanyId);

                context.Users.Attach(activityLogToAdd.User);
                context.Companies.Attach(activityLogToAdd.Company);

                activityLogToAdd.TimeOfActivity = DateTime.Now;

                context.ActivityLogs.Add(activityLogToAdd);
                context.SaveChanges();
            }
        }
    }
}
