using SignalR.Hubs;

namespace JingR
{
   public class DrawingHub : Hub
   {
      public void SendTextBox( int x1, int y1, int x2, int y2, string text )
      {
         Clients.drawTextBox( x1, y1, x2, y2, text );
      }

      public void SendImage( string url )
      {
         Clients.receiveImage( url );
      }

      public void SendLine( int x1, int y1, int x2, int y2 )
      {
         Clients.receiveLine( x1, y1, x2, y2 );
      }
      public void SendArrow( int x1, int y1, int x2, int y2 )
      {
         Clients.receiveArrow( x1, y1, x2, y2 );
      }
   }
}