using Data.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Data.Models;

public class Certificate : AuditBase
{
    public int CadidateExamsID { get; set; }
    public virtual CandidateExam CadidateExam { get; set; }

    public float PercentageScore { get; set; }
    public string AssessmentTestCode { get; set; }
    public bool AssessmentResultLabel { get; set; }
    
}
