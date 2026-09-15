using System.ComponentModel.DataAnnotations;

namespace BookStore.DomainModel.DTOs;

public class FeedbackRequestDto
{
    [Required(ErrorMessage = "Comment is required")]
    [MaxLength(512, ErrorMessage = "Comment must be 512 characters or less")]
    public string Comment { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }
}