using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        // public OrderService(IGenericRepository<Order> orderRepo, IGenericRepository<DeliveryMethod> dmRepo, 
        // IGenericRepository<Product> productRepo, IBasketRepository basketRepo)
        // {
        //     _basketRepo = basketRepo;
        //     _dmRepo = dmRepo;
        //     _productRepo = productRepo;
        //     _orderRepo = orderRepo;
        // }

        public OrderService(IBasketRepository basketRepo, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // 1. get basked from the basket repo (we can trust the items and quantity, but which price is set to)
            var basket = await _basketRepo.GetBasketAsync(basketId);
            
            // 2. get items from the product repo (to get the price, to be sure)
            var items = new List<OrderItem>();
            foreach(var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl); //take snapshot
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            // 3. get delivery-method from repo
                //so we need to injects basket, product, delivery-method and order repo in our service in order to do that
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            
            // 4. calc subtotal
            var subtotal = items.Sum(items => items.Price * items.Quantity);
            
            // create order
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);
           
            // save to db
            _unitOfWork.Repository<Order>().Add(order);

            //result will contains the number of change. In this case will be 2
            // the change to order and to orderitem
            var result = await _unitOfWork.Complete(); //Actually save in the DB. If this action failt. All other changes will not take place at all.

            if (result <= 0) return null;

            // delete basket
            await _basketRepo.DeleteBasketAsync(basketId);
            
            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            // need to get also the related propery DeliveryMethod and OrderItem (this is done in specification/OrdersWithItemsAndOrderingSpecification)
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}