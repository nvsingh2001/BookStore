namespace BookStore.BusinessLogic.Utilities;

public static class ProductImageStorage
{
    public static readonly Dictionary<string, string> ExtensionsByContentType = new()
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp"
    };

    public static async Task<string> SaveImageAsync(Guid productId, Stream imageStream, string contentType,
        string baseUrl)
    {
        var extension = ExtensionsByContentType[contentType];
        var directory = Path.Combine("wwwroot", "images", "products");
        Directory.CreateDirectory(directory);

        var filePath = Path.Combine(directory, $"{productId}{extension}");
        await using var fileStream = File.Create(filePath);
        await imageStream.CopyToAsync(fileStream);

        return $"{baseUrl}/images/products/{productId}{extension}";
    }

    public static void DeleteImage(Guid productId)
    {
        var directory = Path.Combine("wwwroot", "images", "products");
        if (!Directory.Exists(directory)) return;

        foreach (var file in Directory.EnumerateFiles(directory, $"{productId}.*"))
            File.Delete(file);
    }
}
