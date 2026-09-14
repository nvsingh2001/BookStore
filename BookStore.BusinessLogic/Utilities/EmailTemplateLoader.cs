namespace BookStore.BusinessLogic.Utilities;

public static class EmailTemplateLoader
{
    public static string Load(string fileName, Dictionary<string, string> replacements)
    {
        var template = File.ReadAllText(Path.Combine("EmailTemplates", fileName));

        foreach (var (placeholder, value) in replacements)
            template = template.Replace(placeholder, value);

        return template;
    }
}
