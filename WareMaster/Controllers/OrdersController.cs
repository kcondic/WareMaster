using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/orders")]
    public class OrdersController : ApiController
    {
        public OrdersController()
        {
            _orderRepository = new OrderRepository();
        }
        private readonly OrderRepository _orderRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllOrders()
        {
            return Ok(_orderRepository.GetAllOrders(1));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddNewOrder(Order order)
        {
            _orderRepository.AddNewOrder(order);
            return Ok(true);
        }

        [HttpGet]
        [Route("details")]
        public IHttpActionResult GetOrder(int id)
        {
            return Ok(_orderRepository.GetOrderDetails(id));
        }

        [HttpPost]
        [Route("edit")]
        public IHttpActionResult EditOrder(Order editedOrder)
        {
            _orderRepository.EditOrder(editedOrder);
            //_orderRepository.EditOrderProducts(editedOrder);
            return Ok(true);
        }
    }
}
