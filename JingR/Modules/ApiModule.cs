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

         Get["/{id}/{type}"] = parameters =>
                        {
                           string id = parameters.id;
                           string type = parameters.type;

                           var drawing = _drawingRepository.GetDrawing( id );
                           if ( type == "arrows" )
                           {
                              return Response.AsJson( drawing.Arrows );
                           }
                           if ( type == "textboxes" )
                           {
                              return Response.AsJson( drawing.Text );
                           }

                           return Response.AsJson( new
                           {
                           } );
                        };

         Put["/{id}"] = parameters =>
                        {
                           string id = parameters.id;

                           var image = this.Bind<Image>();

                           _drawingRepository.AddImageToDrawing( id, image.imageUrl );

                           return Response.AsJson( new
                           {
                              Success = true
                           } );
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
            case "arrows":
            {
               var arrow = this.Bind<Arrow>();
               _drawingRepository.AddArrowToDrawing( id, arrow );
               break;
            }
            case "textboxes":
            {
               var text = this.Bind<Text>();
               _drawingRepository.AddTextToDrawing( id, text );
               break;
            }
         }
      }
   }
}