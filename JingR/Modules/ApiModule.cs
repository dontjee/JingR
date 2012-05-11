using System;
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

                          switch ( type )
                          {
                             case "arrows":
                             {
                                var arrow = this.Bind<Arrow>();
                                arrow.id = Guid.NewGuid().ToString();
                                _drawingRepository.AddArrowToDrawing( id, arrow );
                                return Response.AsJson( arrow );
                             }
                             case "textboxes":
                             {
                                var text = this.Bind<Text>();
                                text.id = Guid.NewGuid().ToString();
                                _drawingRepository.AddTextToDrawing( id, text );
                                return Response.AsJson( text );
                             }
                          }

                          return Response.AsJson( new
                          {
                             success = false
                          } );
                       };

         Put["/{drawingId}/{type}/{id}"] = parameters =>
                       {
                          string drawingId = parameters.drawingId;
                          string id = parameters.id;
                          string type = parameters.type;

                          switch ( type )
                          {
                             case "arrows":
                             {
                                var modifiedArrow = this.Bind<Arrow>();
                                _drawingRepository.UpdateArrow( drawingId, id, modifiedArrow );

                                return Response.AsJson( modifiedArrow );
                             }
                             case "textboxes":
                             {
                                var modifiedTextBox = this.Bind<Text>();
                                _drawingRepository.UpdateTextBox( drawingId, id, modifiedTextBox );
                                return Response.AsJson( modifiedTextBox );
                             }
                          }

                          return Response.AsJson( new
                          {
                             success = false
                          } );
                       };
      }
   }
}