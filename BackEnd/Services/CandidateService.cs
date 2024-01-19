using Data;
using Data.Models;
using Project.Contracts;
using Project.Models;


namespace Project.Services;

public class CandidateService : ICandidateService
{
    private readonly PeopleCertProjectContext _context;

    public CandidateService(PeopleCertProjectContext context)
    {
        this._context = context;
    }
    public List<CandidateDto> GetAll()
    {
        try
        {
            List<CandidateDto> candidates = _context.Candidates
                .Join(
                    _context.Users,
                    candidate => candidate.UserId,
                    user => user.Id,
                    (candidate, user) => new CandidateDto()
                    {
                        ID = candidate.Id,
                        UserId = candidate.UserId,
                        Username = user.Username,
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
            var candidateFound = _context.Candidates
                .Join(
                    _context.Users,
                    candidate => candidate.UserId,
                    user => user.Id,
                    (candidate, user) => new CandidateDto()
                    {
                        ID = candidate.Id,
                        UserId = candidate.UserId,
                        Username = user.Username,
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
                .FirstOrDefault(c => c.UserId == id);
            if (candidateFound == null)
            {
                return null;
            }


            return candidateFound;
        }
        if (!string.IsNullOrEmpty(lastName))
        {
            var lowerLastName = lastName.ToLowerInvariant(); // Convert input to lowercase for comparison
            var candidateFound = _context.Candidates
                .Join(
                    _context.Users,
                    candidate => candidate.UserId,
                    user => user.Id,
                    (candidate, user) => new CandidateDto()
                    {
                        ID = candidate.Id,
                        UserId = candidate.UserId,
                        Username = user.Username,
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
                .FirstOrDefault(c => c.LastName.ToLower() == lowerLastName);
            if (candidateFound == null)
            {
                return null;
            }


            return candidateFound;
        }


        throw new ArgumentException("Invalid arguments");




    }

    public CandidateDtoAdmin? GetForsettings(int id)
    {
        var candidateFound = _context.Candidates
            .Join(
                _context.Users,
                candidate => candidate.UserId,
                user => user.Id,
                (candidate, user) => new CandidateDtoAdmin()
                {
                    ID = candidate.Id,
                    UserId = candidate.UserId,
                    Username = user.Username,
                    Password = user.Password,
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
            .FirstOrDefault(c => c.UserId == id);
        if (candidateFound == null)
        {
            return null;
        }

        return candidateFound;
    }

    public void Create(CandidateDtoAdmin candidate)
    {
        try
        {
            var newUser = _context.Users.FirstOrDefault(u => u.Username == candidate.Username);
            if (newUser != null)
            {
                throw new ArgumentException("Username Taken.");
            }

            ValidateCandidate(candidate);

            var createUser = new User
            {
                Username = candidate.Username,
                Password = candidate.Password,
                Role = Role.Candidate,
                CreatedById = 1,
                UpdatedById = 1,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };
            _context.Users.Add(createUser);
            _context.SaveChanges();  // Save changes to get the generated user ID

            // Update createUser with the generated UserId
            var userCreated = _context.Users.FirstOrDefault(u => u.Username == candidate.Username);
            if (userCreated == null)
            {
                throw new Exception("Failed to retrieve the newly created user.");
            }
            // Create the new candidate
            var newCandidate = new Candidate
            {
                UserId = userCreated.Id,
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
                CreatedById = 1,
                UpdatedById = 1,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            // Add the new candidate to the context and save changes
            _context.Candidates.Add(newCandidate);
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public void Update(CandidateDtoBase candidate, string username, string password)
    {
        try
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == username);
            if (existingUser == null)
            {
                throw new ArgumentException("Username doesnt exist.");
            }

            existingUser.Username = username;
            existingUser.Password = password;
            existingUser.UpdatedDate = DateTime.Now;
            existingUser.UpdatedById = existingUser.Id;

            _context.SaveChanges();

            var existingCandidate = _context.Candidates.FirstOrDefault(c => c.UserId == existingUser.Id);
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
            existingCandidate.UpdatedById = existingUser.Id;
            existingCandidate.UpdatedDate = DateTime.Now;

            // Save changes to the context
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public void UpdateAdmin(CandidateDto candidate)
    {
        try
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == candidate.Username);
            if (existingUser == null)
            {
                throw new ArgumentException("Username doesnt exist.");
            }

            existingUser.Username = candidate.Username;
            existingUser.UpdatedDate = DateTime.Now;
            existingUser.UpdatedById = 1;

            _context.SaveChanges();

            var existingCandidate = _context.Candidates.FirstOrDefault(c => c.UserId == existingUser.Id);
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
            existingCandidate.UpdatedById = 1;
            existingCandidate.UpdatedDate = DateTime.Now;

            // Save changes to the context
            _context.SaveChanges();
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

            var candidateToDelete = _context.Candidates.FirstOrDefault(u => u.UserId == userId);
            if (candidateToDelete != null)
            {
                // Perform any additional validations here (e.g., authorization check, cascading delete)

                _context.Candidates.Remove(candidateToDelete);
                _context.SaveChanges();
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

    public void UpdateSettings(CandidateDtoAdmin candidate)
    {
        try
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == candidate.Username);
            if (existingUser == null)
            {
                throw new ArgumentException("Username doesnt exist.");
            }

            existingUser.Username = candidate.Username;
            existingUser.Password = candidate.Password;
            existingUser.UpdatedDate = DateTime.Now;
            existingUser.UpdatedById = candidate.UserId;

            _context.SaveChanges();

            var existingCandidate = _context.Candidates.FirstOrDefault(c => c.UserId == existingUser.Id);
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
            existingCandidate.UpdatedById = candidate.UserId;
            existingCandidate.UpdatedDate = DateTime.Now;

            // Save changes to the context
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }



    private void ValidateCandidate(CandidateDtoBase candidate)
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
