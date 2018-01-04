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
        public ActivityLogRepository()
        {
            _userRepository = new UserRepository();
        }

        private readonly UserRepository _userRepository;

        public List<ActivityLog> GetAllActivityLogs(int companyId)
        {
            var userList = _userRepository.GetAllUsers(companyId).ToList();
            var activityLogList = new List<ActivityLog>();

            foreach (var user in userList)
                    activityLogList.AddRange(user.ActivityLogs);

            return activityLogList;
        }

        public void AddActivityLog(ActivityLog activityLogToAdd)
        {
            using (var context = new WarehouseContext())
            {
                context.Users.Attach(activityLogToAdd.User);

                context.ActivityLogs.Add(activityLogToAdd);
                context.SaveChanges();
            }
        }
    }
}
