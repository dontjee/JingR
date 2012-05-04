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

         Post["/{id}/line"] = parameters =>
                       {
                          string id = parameters.id;
                          var line = this.Bind<Line>();

                          _drawingRepository.AddLineToDrawing( id, line );

                          return "{ success : true }";
                       };

         Post["/{id}/arrow"] = parameters =>
                       {
                          string id = parameters.id;
                          var arrow = this.Bind<Arrow>();

                          _drawingRepository.AddArrowToDrawing( id, arrow );

                          return "{ success : true }";
                       };

         Post["/{id}/text"] = parameters =>
                       {
                          string id = parameters.id;
                          var text = this.Bind<Text>();

                          _drawingRepository.AddTextToDrawing( id, text );

                          return "{ success : true }";
                       };
         Post["/{id}/image"] = parameters =>
                       {
                          string id = parameters.id;
                          var image = this.Bind<Image>();

                          _drawingRepository.AddImageToDrawing( id, image );

                          return "{ success : true }";
                       };
      }
   }

   public class Image
   {
      public string Url
      {
         get;
         set;
      }
   }
}