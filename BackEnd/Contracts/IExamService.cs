using Project.Models;

namespace Project.Contracts;

public interface IExamService
{
    List<ExamDto> GetAll();
    /// <summary>
    /// Gets a single exam by id
    /// </summary>
    /// <param name="id">The id</param>
    /// <returns>An exam dto</returns>
    ExamDto GetOne(int id);
    void Create(ExamDto exam);
    void Update(ExamDto exam);
    void Delete(int id);
}
