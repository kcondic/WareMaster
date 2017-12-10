﻿using System;
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

        public List<ActivityLog> GetAllActivityLogsForACompany(int companyId)
        {
            var userList = _userRepository.GetAllUsersFromACompany(companyId).ToList();
            var activityLogList = new List<ActivityLog>();

            foreach (var user in userList)
                    activityLogList.AddRange(user.ActivityLogs);

            return activityLogList;
        }
    }
}