using SignalR.Hubs;

namespace JingR
{
   public class Draw : Hub
   {
      public void SendIt( string points )
      {
         Clients.drawIt( points );
      }
   }
}