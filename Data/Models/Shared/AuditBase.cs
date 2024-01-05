using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Data.Models.Shared;

public abstract class AuditBase : EntityKey
{
    public int CreatedById { get; set; }
    public int UpdatedById { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public virtual User? CreatedBy { get; set; }
    public virtual User? UpdatedBy { get; set; }
}
