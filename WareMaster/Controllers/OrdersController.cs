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
            var wasOrderEdited = _orderRepository.EditOrder(editedOrder);
            if (!wasOrderEdited)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteOrder(int id)
        {
            var wasOrderDeleted = _orderRepository.DeleteOrder(id);
            if (!wasOrderDeleted)
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            return Ok(true);
        }

        [HttpGet]
        [Route("assigned")]
        public IHttpActionResult GetOrdersAssignedToEmployee(int employeeId)
        {
            var ordersToGet = _orderRepository.GetOrdersAssignedToEmployee(employeeId);
            if (ordersToGet == null || !ordersToGet.Any())
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            return Ok(ordersToGet);
        }
    }
}
