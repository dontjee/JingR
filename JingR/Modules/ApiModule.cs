using Nancy;
using Nancy.ModelBinding;

namespace JingR.Modules
{
   public class ApiModule : NancyModule
   {
      private readonly DrawingRepository _drawingRepository = new DrawingRepository();
      public ApiModule()
         : base( "/api" )
      {
         Get["/{id}"] = parameters =>
                        {
                           string id = parameters.id;

                           return Response.AsJson( _drawingRepository.GetDrawing( id ) );
                        };

         Post["/{id}/{type}"] = parameters =>
                       {
                          string id = parameters.id;
                          string type = parameters.type;

                          SaveDrawingElement( type, id );


                          return "{ success : true }";
                       };
      }

      private void SaveDrawingElement( string type, string id )
      {
         switch ( type )
         {
            case "arrow":
            {
               var arrow = this.Bind<Arrow>();
               _drawingRepository.AddArrowToDrawing( id, arrow );
               break;
            }
            case "text":
            {
               var text = this.Bind<Text>();
               _drawingRepository.AddTextToDrawing( id, text );
               break;
            }
            case "image":
            {
               var image = this.Bind<Image>();
               _drawingRepository.AddImageToDrawing( id, image );
               break;
            }
         }
      }
   }
}