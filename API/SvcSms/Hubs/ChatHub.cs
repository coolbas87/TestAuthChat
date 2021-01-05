using Microsoft.AspNetCore.SignalR;
using SvcSms.Hubs.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SvcSms.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
    }
}
