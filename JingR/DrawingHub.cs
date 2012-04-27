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

      public void SendLine( int x1, int y1, int x2, int y2 )
      {
         Clients.receiveLine( x1, y1, x2, y2 );
      }
   }
}