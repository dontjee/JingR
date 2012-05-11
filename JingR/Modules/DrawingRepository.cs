using System.Collections.Generic;

namespace JingR.Modules
{
   public class DrawingRepository
   {
      private static readonly Dictionary<string, Drawing> _drawings = new Dictionary<string, Drawing>();

      public Drawing GetDrawing( string id )
      {
         return GetOrCreateDrawingForId( id );
      }

      public void AddArrowToDrawing( string id, Arrow arrow )
      {
         var drawing = GetOrCreateDrawingForId( id );
         drawing.Arrows.Add( arrow );
      }

      public void AddTextToDrawing( string id, Text text )
      {
         var drawing = GetOrCreateDrawingForId( id );
         drawing.Text.Add( text );
      }

      public void AddImageToDrawing( string id, string imageUrl )
      {
         var drawing = GetOrCreateDrawingForId( id );
         drawing.imageUrl = imageUrl;
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