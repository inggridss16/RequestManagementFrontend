using System;
using System.Collections.Generic;

namespace RequestManagementWeb.Models
{
    public partial class MstUser
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public int? OrganizationId { get; set; }
        public int? DivisionId { get; set; }
        public int? RoleId { get; set; }
        public int? PermissionId { get; set; }
    }
}
