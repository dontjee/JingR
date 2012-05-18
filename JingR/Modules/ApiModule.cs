using System;
using Nancy;
using Nancy.ModelBinding;
using PusherRESTDotNet;

namespace JingR.Modules
{
   public class ApiModule : NancyModule
   {
      private readonly DrawingRepository _drawingRepository = new DrawingRepository();
      private readonly PusherProvider _provider = new PusherProvider( "20727", "f92e432c5c1537977aaf", "915bc6bf715f3661b59d" );
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

                                SendNewObjectToClients( id, "arrows", arrow );

                                return Response.AsJson( arrow );
                             }
                             case "textboxes":
                             {
                                var text = this.Bind<Text>();
                                text.id = Guid.NewGuid().ToString();
                                _drawingRepository.AddTextToDrawing( id, text );

                                SendNewObjectToClients( id, "textboxes", text );

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

                                SendUpdateObjectToClients( drawingId, "arrows", modifiedArrow );

                                return Response.AsJson( modifiedArrow );
                             }
                             case "textboxes":
                             {
                                var modifiedTextBox = this.Bind<Text>();
                                _drawingRepository.UpdateTextBox( drawingId, id, modifiedTextBox );

                                SendUpdateObjectToClients( drawingId, "textboxes", modifiedTextBox );

                                return Response.AsJson( modifiedTextBox );
                             }
                          }

                          return Response.AsJson( new
                          {
                             success = false
                          } );
                       };
      }

      private void SendUpdateObjectToClients( string id, string collectionName, object modifiedObject )
      {
         string channel = string.Format( "{0}-{1}", id, collectionName );
         var request = new ObjectPusherRequest( channel, "updated", modifiedObject );
         _provider.Trigger( request );
      }

      private void SendNewObjectToClients( string id, string collectionName, object objectToSend )
      {
         string channel = string.Format( "{0}-{1}", id, collectionName );
         var request = new ObjectPusherRequest( channel, "created", objectToSend );
         _provider.Trigger( request );
      }
   }
}