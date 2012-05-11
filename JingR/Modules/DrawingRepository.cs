using System.Collections.Generic;
using System.Linq;

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

      public void UpdateArrow( string drawingId, string id, Arrow modifiedArrow )
      {
         var drawing = GetDrawing( drawingId );
         var existingArrow = drawing.Arrows.FirstOrDefault( a => a.id == id );
         if ( existingArrow != null )
         {
            existingArrow.begin = modifiedArrow.begin;
            existingArrow.end = modifiedArrow.end;
         }
      }

      public void UpdateTextBox( string drawingId, string id, Text modifiedTextbox )
      {
         var drawing = GetDrawing( drawingId );
         var existingTextbox = drawing.Text.FirstOrDefault( t => t.id == id );
         if ( existingTextbox != null )
         {
            existingTextbox.begin = modifiedTextbox.begin;
            existingTextbox.end = modifiedTextbox.end;
            existingTextbox.value = modifiedTextbox.value;
         }
      }
   }
}