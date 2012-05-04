using System.Collections.Generic;

namespace JingR.Modules
{
   public class DrawingRepository
   {
      private static readonly Dictionary<string, Drawing> _drawings = new Dictionary<string, Drawing>();

      public void AddLineToDrawing( string id, Line line )
      {
         if ( !_drawings.ContainsKey( id ) )
         {
            _drawings.Add( id, new Drawing( id ) );
         }

         Drawing drawing = _drawings[id];

         drawing.Lines.Add( line );
      }

      public Drawing GetDrawing( string id )
      {
         return _drawings.ContainsKey( id ) ? _drawings[id] : new Drawing( id );
      }
   }
}