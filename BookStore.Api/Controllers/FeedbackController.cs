using BookStore.BusinessLogic.Interfaces;
using BookStore.DomainModel.DTOs;
using BookStore.DomainModel.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers;

[Route("api/[controller]")]
public class FeedbackController(IFeedbackService feedbackService) : ApiControllerBase
{
    [HttpGet("{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<FeedbackResponseDto>>>> GetFeedbackByProductIdAsync(
        Guid productId)
    {
        var feedbacks = await feedbackService.GetFeedbackByProductIdAsync(productId);
        return Ok(ApiResponse<List<FeedbackResponseDto>>.SuccessResponse(feedbacks));
    }


    [HttpPost("{productId:guid}")]
    [Authorize(Roles = "User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<FeedbackResponseDto>>> AddFeedbackAsync(Guid productId,
        [FromBody] FeedbackRequestDto feedbackRequestDto)
    {
        var feedback = await feedbackService.AddFeedbackAsync(CurrentUserId, productId, feedbackRequestDto);
        return Ok(ApiResponse<FeedbackResponseDto>.SuccessResponse(feedback));
    }
}
