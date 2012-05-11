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

      public List<Arrow> Arrows
      {
         get;
         private set;
      }

      public List<Text> Text
      {
         get;
         private set;
      }

      public string imageUrl
      {
         get;
         set;
      }

      public Drawing( string id )
      {
         Id = id;

         Arrows = new List<Arrow>();
         Text = new List<Text>();
      }
   }
}