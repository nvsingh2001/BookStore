namespace BookStore.DataAccess.Exceptions;

public class ForeignKeyConstraintException : Exception
{
    public ForeignKeyConstraintException()
    {
    }

    public ForeignKeyConstraintException(string message) : base(message)
    {
    }

    public ForeignKeyConstraintException(string message, Exception innerException) : base(message, innerException)
    {
    }
}