using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/orders")]
    [Authorize]
    public class OrdersController : ApiController
    {
        public OrdersController()
        {
            _orderRepository = new OrderRepository();
        }
        private readonly OrderRepository _orderRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllOrders(int companyId)
        {
            return Ok(_orderRepository.GetAllOrders(companyId));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddNewOrder(Order order)
        {
            _orderRepository.AddNewOrder(order);
            return Ok(true);
        }

        [HttpGet]
        [Route("edit")]
        public IHttpActionResult GetOrderToEdit(int id)
        {
            return Ok(_orderRepository.GetOrderDetails(id));
        }

        [HttpGet]
        [Route("details")]
        public IHttpActionResult GetOrderDetails(int id, int companyId)
        {
            var order = _orderRepository.GetOrderDetails(id, companyId);
            if (order != null)
                return Ok(order);
            return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Unauthorized));
        }

        [HttpPost]
        [Route("edit")]
        public IHttpActionResult EditOrder(Order editedOrder)
        {
            _orderRepository.EditOrder(editedOrder);
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteOrder(int id)
        {
            _orderRepository.DeleteOrder(id);
            return Ok(true);
        }
    }
}
