namespace Core.Specifications
{
    //class used to handle better all the parameter of this:
    //public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(string sort, int? brandId, int? typeId)
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;
        
        public int PageIndex {get; set;} = 1; //by default we are to send the very first page
    
        private int _pageSize = 6;
        public int PageSize
        {
            get => _pageSize; //defualt is 6, but can be overwritten
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public int? BrandId {get; set;}
        public int? TypeId {get; set;}
        public string Sort {get; set;}

        private string _search;
        public string Search { 
            get => _search; 
            set => _search = value.ToLower(); 
        }    
    
    }
}