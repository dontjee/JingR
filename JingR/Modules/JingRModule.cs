using Nancy;

namespace JingR.Modules
{
   public class JingRModule : NancyModule
   {
      public JingRModule()
         : base( "/api" )
      {
         Get["{id}/foo"] = parameters =>
                       {
                          return "id: " + parameters.id;
                       };
      }
   }
}