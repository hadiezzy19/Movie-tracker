namespace MovieTrackerAPI.Helpers;

public static class UserContext
{
    public static int? GetUserId(HttpRequest request)
    {
        if (request.Headers.TryGetValue("X-User-Id", out var userIdHeader) &&
            int.TryParse(userIdHeader, out var userId))
        {
            return userId;
        }

        return null;
    }
}
