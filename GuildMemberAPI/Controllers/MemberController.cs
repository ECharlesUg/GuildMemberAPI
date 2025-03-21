using GuildMemberAPI.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace GuildMemberAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        // In-Memory Data Store
        private static readonly Dictionary<int, Member> Members = new();
        private static int _currentId = 1;

        [HttpGet]
        //Returns a list of all the guild members as a JSON array
        public ActionResult<IEnumerable<Member>> ReturnGuildMember()
        {
            return Ok(Members.Values);
        }

        [HttpGet("{id}")]
        //Return the members with the specified ID
        public ActionResult<Member> ReturnMemberWithSpecifiedId(int id)
        {
            if (!Members.ContainsKey(id))
            {
                return NotFound(new { message = "Member not found" });
            }
            return Ok(Members[id]);
        }
        [HttpPost]
        //Add a new member to the data store, assigning a unique ID
        public ActionResult<Member> AddMemberAssignUniqueId([FromBody] Member member)
        {
            if (string.IsNullOrWhiteSpace(member.Name) || string.IsNullOrWhiteSpace(member.Role))
            {
                return BadRequest(new { message = "Name and Role cannot be empty" });
            }
            var id = _currentId++;
            Members[id] = member;
            return CreatedAtAction(nameof(ReturnMemberWithSpecifiedId), new { id = member.Id }, member);
        }
        [HttpPut("{id}")]
        //Update an existing member. 
        public ActionResult<Member> UpdateExistingMember(int id, [FromBody] Member member)
        {
            if (Members.ContainsValue(member))
            {
                member.Id = id;
                Members[id] = member;
                return Ok(member);
            }
            if (string.IsNullOrWhiteSpace(member.Name) || string.IsNullOrWhiteSpace(member.Role))
            {
                return BadRequest(new { message = "Name and Role cannot be empty" });
            }
            return NotFound(new { message = "Member not found" });
        }

        [HttpDelete("{id}")]
        //Removes a member
        public ActionResult<Member> RemoveMember(int id)
        {
            if (!Members.ContainsKey(id))
            {
                return NotFound(new { message = "Member not found" });
            }

            var member = Members[id];
            Members.Remove(id);
            return Ok(member) ;
        }
        // Seed with Initial Data (Static Constructor)
        static MemberController()
        {
            Members[_currentId] = new Member { Id = _currentId, Name = "Aria Swiftblade", Role = "Warrior", ContributionPoints = 150 };
            _currentId++;
            Members[_currentId] = new Member { Id = _currentId, Name = "Lorin Spellbinder", Role = "Mage", ContributionPoints = 200 };
            _currentId++;
            Members[_currentId] = new Member { Id = _currentId, Name = "Thalia Shadowstep", Role = "Rogue", ContributionPoints = 120 };
            _currentId++;
        }

    }
}
