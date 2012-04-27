using SignalR.Hubs;

namespace JingR
{
   public class DrawingHub : Hub
   {
      public void SendIt( int x, int y )
      {
         Clients.drawIt( x, y );
      }

      public void SendImage( string url )
      {
         Clients.receiveImage( url );
      }
   }
}