using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class FeedbackRequestDto
{
    public string Comment { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }
}