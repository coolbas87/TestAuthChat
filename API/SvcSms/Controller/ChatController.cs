using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SvcSms.Hubs;
using SvcSms.Hubs.Clients;
using SvcSms.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SvcSms.Controller
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub, IChatClient> _chatHub;

        public ChatController(IHubContext<ChatHub, IChatClient> chatHub)
        {
            _chatHub = chatHub;
        }

        [Authorize]
        [HttpPost("messages")]
        public async Task<IActionResult> Post(ChatMessage message)
        {
            if (message.Message.Length == 0)
            {
                return BadRequest(new { errorText = "Message is empty." });
            }
            if ((message.User.Length == 0) || (message.User != User.Identity.Name))
            {
                return BadRequest(new { errorText = "Invalid username." });
            }

            try
            {
                await _chatHub.Clients.All.ReceiveMessage(message);
            }
            catch (Exception e)
            {
                BadRequest(new { errorText = e.Message });
            }

            return Ok();
        }
    }
}
