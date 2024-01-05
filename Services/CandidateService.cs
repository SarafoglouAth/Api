using Data;
using Data.Models;
using Project.Contracts;
using Project.Models;
using System.Linq;

namespace Project.Services;

public class CandidateService : ICandidateService
{
    private readonly PeopleCertProject context;

    public CandidateService(PeopleCertProject context)
    {
        this.context = context;
    }
    public List<CandidateDto> GetAll()
    {
        try
        {
            List<CandidateDto> candidates = context.Candidates
                .Select(candidate => new CandidateDto()
                {
                    ID = candidate.Id,
                    UserId = candidate.UserId,
                    FirstName = candidate.FirstName,
                    MiddleName = candidate.MiddleName,
                    LastName = candidate.LastName,
                    Gender = candidate.Gender,
                    NativeLanguage = candidate.NativeLanguage,
                    PhotoIDType = candidate.PhotoIDType,
                    PhotoIDNumber = candidate.PhotoIDNumber,
                    BirthDate = candidate.BirthDate,
                    PhotoIDIssueDate = candidate.PhotoIDIssueDate,
                    Email = candidate.Email,
                    Address = candidate.Address,
                    AddressLine2 = candidate.AddressLine2,
                    CountryOfResidence = candidate.CountryOfResidence,
                    State = candidate.State,
                    Territory = candidate.Territory,
                    Province = candidate.Province,
                    TownCity = candidate.TownCity,
                    PostalCode = candidate.PostalCode,
                    LandlineNumber = candidate.LandlineNumber,
                    MobileNumber = candidate.MobileNumber
                })
                .ToList();

            return candidates;
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public CandidateDto? GetOne(int? id, string? lastName)
    {
        if (id.HasValue)
        {
            var candidate = context.Candidates.FirstOrDefault(u => u.Id == id);
            if (candidate == null)
            {
                return null; // User not found
            }

            // Map user entity to UserDto
            var candidateDto = new CandidateDto()
            {
                ID = candidate.Id,
                UserId = candidate.UserId,
                FirstName = candidate.FirstName,
                MiddleName = candidate.MiddleName,
                LastName = candidate.LastName,
                Gender = candidate.Gender,
                NativeLanguage = candidate.NativeLanguage,
                PhotoIDType = candidate.PhotoIDType,
                PhotoIDNumber = candidate.PhotoIDNumber,
                BirthDate = candidate.BirthDate,
                PhotoIDIssueDate = candidate.PhotoIDIssueDate,
                Email = candidate.Email,
                Address = candidate.Address,
                AddressLine2 = candidate.AddressLine2,
                CountryOfResidence = candidate.CountryOfResidence,
                State = candidate.State,
                Territory = candidate.Territory,
                Province = candidate.Province,
                TownCity = candidate.TownCity,
                PostalCode = candidate.PostalCode,
                LandlineNumber = candidate.LandlineNumber,
                MobileNumber = candidate.MobileNumber
            };

            return candidateDto;
        }
        
        if (!string.IsNullOrEmpty(lastName))
        {
            var lowerLastName = lastName.ToLowerInvariant(); // Convert input to lowercase for comparison

            var candidate = context.Candidates.FirstOrDefault(c => c.LastName.ToLower() == lowerLastName);

            if (candidate == null)
            {
                return null; // User not found
            }

            // Map user entity to UserDto
            var candidateDto = new CandidateDto()
            {
                UserId = candidate.Id,
                FirstName = candidate.FirstName,
                MiddleName = candidate.MiddleName,
                LastName = candidate.LastName,
                Gender = candidate.Gender,
                NativeLanguage = candidate.NativeLanguage,
                PhotoIDType = candidate.PhotoIDType,
                PhotoIDNumber = candidate.PhotoIDNumber,
                BirthDate = candidate.BirthDate,
                PhotoIDIssueDate = candidate.PhotoIDIssueDate,
                Email = candidate.Email,
                Address = candidate.Address,
                AddressLine2 = candidate.AddressLine2,
                CountryOfResidence = candidate.CountryOfResidence,
                State = candidate.State,
                Territory = candidate.Territory,
                Province = candidate.Province,
                TownCity = candidate.TownCity,
                PostalCode = candidate.PostalCode,
                LandlineNumber = candidate.LandlineNumber,
                MobileNumber = candidate.MobileNumber
            };

            return candidateDto;
           
        }

        throw new ArgumentException("Invalid arguments");
    }
    
    public void Create(CandidateDtoWithoutId candidate, int userId )
    {
        try
        {
            var newUser = context.Users.FirstOrDefault(u => u.Id == userId);
            if (newUser == null)
            {
                throw new ArgumentException("User not found. Invalid user ID provided for the candidate.");

            }
            
            ValidateCandidate(candidate);
          
            // Create the new candidate
            var newCandidate = new Candidate
            {
                UserId = userId,
                FirstName = candidate.FirstName.Trim(),
                MiddleName = candidate.MiddleName.Trim(),
                LastName = candidate.LastName.Trim(),
                Gender = candidate.Gender.Trim(),
                NativeLanguage = candidate.NativeLanguage.Trim(),
                PhotoIDType = candidate.PhotoIDType.Trim(),
                PhotoIDNumber = candidate.PhotoIDNumber.Trim(),
                BirthDate = candidate.BirthDate,
                PhotoIDIssueDate = candidate.PhotoIDIssueDate,
                Email = candidate.Email.Trim(),
                Address = candidate.Address.Trim(),
                AddressLine2 = candidate.AddressLine2?.Trim(),
                CountryOfResidence = candidate.CountryOfResidence.Trim(),
                State = candidate.State.Trim(),
                Territory = candidate.Territory.Trim(),
                Province = candidate.Province.Trim(),
                TownCity = candidate.TownCity.Trim(),
                PostalCode = candidate.PostalCode.Trim(),
                LandlineNumber = candidate.LandlineNumber?.Trim(),
                MobileNumber = candidate.MobileNumber.Trim(),
                CreatedById = userId,
                UpdatedById = userId,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            // Add the new candidate to the context and save changes
            context.Candidates.Add(newCandidate);
            context.SaveChanges();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public void Update(CandidateDtoWithoutId candidate, int userId)
{
    try
    {
        var existingCandidate = context.Candidates.FirstOrDefault(c => c.UserId == userId);
        if (existingCandidate == null)
        {
            throw new ArgumentException("Candidate not found. Invalid candidate ID provided for updating.");
        }

        ValidateCandidate(candidate);

        // Update the existing candidate entity
        existingCandidate.FirstName = candidate.FirstName.Trim();
        existingCandidate.MiddleName = candidate.MiddleName.Trim();
        existingCandidate.LastName = candidate.LastName.Trim();
        existingCandidate.Gender = candidate.Gender.Trim();
        existingCandidate.NativeLanguage = candidate.NativeLanguage.Trim();
        existingCandidate.PhotoIDType = candidate.PhotoIDType.Trim();
        existingCandidate.PhotoIDNumber = candidate.PhotoIDNumber.Trim();
        existingCandidate.BirthDate = candidate.BirthDate;
        existingCandidate.PhotoIDIssueDate = candidate.PhotoIDIssueDate;
        existingCandidate.Email = candidate.Email.Trim();
        existingCandidate.Address = candidate.Address.Trim();
        existingCandidate.AddressLine2 = candidate.AddressLine2?.Trim();
        existingCandidate.CountryOfResidence = candidate.CountryOfResidence.Trim();
        existingCandidate.State = candidate.State.Trim();
        existingCandidate.Territory = candidate.Territory.Trim();
        existingCandidate.Province = candidate.Province.Trim();
        existingCandidate.TownCity = candidate.TownCity.Trim();
        existingCandidate.PostalCode = candidate.PostalCode.Trim();
        existingCandidate.LandlineNumber = candidate.LandlineNumber?.Trim();
        existingCandidate.MobileNumber = candidate.MobileNumber.Trim();
        existingCandidate.UpdatedById = userId;
        existingCandidate.UpdatedDate = DateTime.Now;

        // Save changes to the context
        context.SaveChanges();
    }
    catch (Exception ex)
    {
        throw new Exception(ex.Message);
    }
}


    public void Delete(int userId)
    {
        try
        {
            if (userId < 0)
            {
                throw new ArgumentException("Invalid user ID.");
            }

            var candidateToDelete = context.Candidates.FirstOrDefault(u => u.UserId == userId);
            if (candidateToDelete != null)
            {
                // Perform any additional validations here (e.g., authorization check, cascading delete)

                context.Candidates.Remove(candidateToDelete);
                context.SaveChanges();
            }
            else
            {
                throw new InvalidOperationException("Candidate not found.");
            }
        }
        catch (ArgumentException ex)
        {
            throw new ArgumentException(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            throw new InvalidOperationException(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }
    
    
    
    
     private void ValidateCandidate(CandidateDtoWithoutId candidate)
    {
        if (candidate == null)
        {
            throw new ArgumentNullException(nameof(candidate), "Candidate information is missing.");
        }

        if (string.IsNullOrWhiteSpace(candidate.FirstName) || string.IsNullOrWhiteSpace(candidate.LastName))
        {
            throw new ArgumentException("First Name and Last Name are required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.MiddleName))
        {
            throw new ArgumentException("MiddleName is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.Email))
        {
            throw new ArgumentException("Email is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.Gender))
        {
            throw new ArgumentException("Gender is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.NativeLanguage))
        {
            throw new ArgumentException("Native Language is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.PhotoIDType))
        {
            throw new ArgumentException("Photo ID Type is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.PhotoIDNumber))
        {
            throw new ArgumentException("Photo ID Number is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.BirthDate.ToString()))
        {
            throw new ArgumentException("Birth Date is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.PhotoIDIssueDate.ToString()))
        {
            throw new ArgumentException("Photo ID Issue Date is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.MobileNumber))
        {
            throw new ArgumentException("Mobile Number is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.Address))
        {
            throw new ArgumentException("Address is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.CountryOfResidence))
        {
            throw new ArgumentException("Country of Residence is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.State))
        {
            throw new ArgumentException("State is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.TownCity))
        {
            throw new ArgumentException("Town/City is required.");
        }
        if (string.IsNullOrWhiteSpace(candidate.PostalCode))
        {
            throw new ArgumentException("Postal Code is required.");
        }
    }

    
}



