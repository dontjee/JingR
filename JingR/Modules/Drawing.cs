using System.Collections.Generic;

namespace JingR.Modules
{
   public class Drawing
   {
      public string Id
      {
         get;
         private set;
      }

      public List<Line> Lines
      {
         get;
         private set;
      }

      public List<Arrow> Arrows
      {
         get;
         private set;
      }

      public Drawing( string id )
      {
         Id = id;

         Lines = new List<Line>();
         Arrows = new List<Arrow>();
      }
   }
}