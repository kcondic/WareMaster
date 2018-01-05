using System;

namespace WareMaster.Data.Models.Entities
{
    public class ActivityLog
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime TimeOfActivity { get; set; }
        public User User { get; set; }
        public int? UserId { get; set; }
        public Company Company { get; set; }
        public int CompanyId { get; set; }
    }
}
