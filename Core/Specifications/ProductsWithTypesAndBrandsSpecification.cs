using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {

         //: base(x => //it takes an expression for our criteria   
        //x goed to
        //if brandId is not present, it used the argument after the or ||
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams productParams)
        //: base(x => //it takes an expression for our criteria
        //x => --> x goes to 

        //|| or else
        //&& and also

        //if brandId.HasValue is true, than !brandId.HasValue is gonna be false
        //so the x.ProductBrandId are filtered
        : base(x =>  
             (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search)) &&
             (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId) &&
             (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
        )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name);
            //-1, becuase we want that for the first page, no items are skipped
            ApplyPaging(productParams.PageSize * (productParams.PageIndex-1),productParams.PageSize);

            //When filtering we can use the Where close. We have arealdy a where close in the 
            // BaseSpecificatin which is going to be the Expression method for the criteria:
            //infact is the Where close in the GetQuery of SpecificationEvaluator class

            if (!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
                {
                    case "priceAsc": AddOrderBy(p => p.Price);
                    break;
                    case "priceDesc": AddOrderByDescending(p => p.Price);
                    break;
                    default: AddOrderBy(n => n.Name);
                    break;
                }
            }
        }

        //base create an instance of Basespecification which container the criteria
        public ProductsWithTypesAndBrandsSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}