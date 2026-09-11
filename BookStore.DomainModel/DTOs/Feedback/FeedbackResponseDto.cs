namespace BookStore.DomainModel.DTOs;

public class FeedbackResponseDto
{
    public string FeedbackId { get; set; }
    public string FullName { get; set; }
    public string Comment { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}