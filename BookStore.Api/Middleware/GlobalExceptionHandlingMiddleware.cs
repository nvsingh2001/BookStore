using BookStore.BusinessLogic.Exceptions;
using BookStore.DataAccess.Exceptions;
using BookStore.DomainModel.Utilities;

namespace BookStore.Middleware;

public class GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await next(httpContext);
        }
        catch (Exception ex)
        {
            var (statusCode, message) = ex switch
            {
                NotFoundException => (StatusCodes.Status404NotFound, ex.Message),
                ConflictException => (StatusCodes.Status409Conflict, ex.Message),
                ForbiddenException => (StatusCodes.Status403Forbidden, ex.Message),
                ValidationException => (StatusCodes.Status400BadRequest, ex.Message),
                DuplicateKeyException or ForeignKeyConstraintException => (StatusCodes.Status409Conflict,
                    "A conflicting record already exists"),
                _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred")
            };

            if (statusCode == StatusCodes.Status500InternalServerError)
                logger.LogError(ex, "Unhandled exception");

            httpContext.Response.StatusCode = statusCode;
            await httpContext.Response.WriteAsJsonAsync(ApiResponse<object>.ErrorResponse(message));
        }
    }
}