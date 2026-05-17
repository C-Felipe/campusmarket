using CampusMarket.API.Exceptions;
using System.Text.Json;

namespace CampusMarket.API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                await EscreverResposta(context, 404, ex.Message);
            }
            catch (BusinessException ex)
            {
                await EscreverResposta(context, 400, ex.Message);
            }
            catch (Exception ex)
            {
                await EscreverResposta(context, 500, "Erro interno do servidor.");
            }
        }

        private static async Task EscreverResposta(HttpContext context, int statusCode, String mensagem)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            
            var resposta = new { error = mensagem };
            var json = JsonSerializer.Serialize(resposta);

            await context.Response.WriteAsync(json);
        }
    }
}
