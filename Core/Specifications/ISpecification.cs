using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {
        //Navigation criteria
        Expression<Func<T, bool>> Criteria {get; }

        //Include navigation property
        List<Expression<Func<T, object>>> Includes {get;}
    }
}