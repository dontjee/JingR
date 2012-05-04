using System.Collections.Generic;

namespace JingR.Modules
{
   public class DrawingRepository
   {
      private static readonly Dictionary<string, Drawing> _drawings = new Dictionary<string, Drawing>();

      public void AddLineToDrawing( string id, Line line )
      {
         var drawing = GetOrCreateDrawingForId( id );

         drawing.Lines.Add( line );
      }


      public Drawing GetDrawing( string id )
      {
         return GetOrCreateDrawingForId( id );
      }

      public void AddArrowToDrawing( string id, Arrow arrow )
      {
         var drawing = GetOrCreateDrawingForId( id );
         drawing.Arrows.Add( arrow );
      }

      private static Drawing GetOrCreateDrawingForId( string id )
      {
         if ( !_drawings.ContainsKey( id ) )
         {
            _drawings.Add( id, new Drawing( id ) );
         }

         Drawing drawing = _drawings[id];
         return drawing;
      }
   }
}