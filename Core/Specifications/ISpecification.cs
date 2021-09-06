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

        //Orderby. take a T(type) and return an object
        Expression<Func<T, object>> OrderBy {get;}

        Expression<Func<T, object>> OrderByDescending {get;}

        // following 3 properties are used for pagination
        // use case products list with 10 products: for the first page 5 are take, none are skipped
        //                                          for the second page 5 are taken and 5 are skipped
        int Take {get;}
        int Skip {get;}
        bool IsPagingEnabled {get;}
    }
}