namespace BookStore.DomainModel.Enums;

public enum OrderStatus
{
   Placed = 0,
   Processing = 1,
   Shipped = 2,
   OutForDelivery = 3,
   Delivered = 4,
   Cancelled = 5,
   Returned = 6
}