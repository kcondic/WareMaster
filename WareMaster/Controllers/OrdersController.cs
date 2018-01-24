using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Web.Http;
using System.Web.Http.Results;
using Newtonsoft.Json.Linq;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;
using Type = WareMaster.Data.Models.Entities.Type;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/orders")]
    [Authorize]
    public class OrdersController : ApiController
    {
        public OrdersController()
        {
            _orderRepository = new OrderRepository();
            _supplierRepository = new SupplierRepository();
            _companyRepository = new CompanyRepository();
        }
        private readonly OrderRepository _orderRepository;
        private readonly SupplierRepository _supplierRepository;
        private readonly CompanyRepository _companyRepository;

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
            var orderId = _orderRepository.AddNewOrder(order);

            if (order.Type == Type.Incoming)
            {
                if (order.SupplierId == null)
                    return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
                var supplierMail = _supplierRepository.GetSupplierDetails(order.SupplierId.Value, order.CompanyId).Email;
                if (supplierMail == null)
                    return Ok(true);

                var mail = new MailMessage();
                var smtpServer = new SmtpClient("smtp.gmail.com");

                mail.From = new MailAddress("waremasterapp@gmail.com");
                mail.To.Add(supplierMail);
                mail.Subject = "Nova narudžba od tvrtke " + _companyRepository.GetCompanyById(order.CompanyId).Name;

                mail.Body =
                    "Molimo Vas da kliknete na link kako bi potvrdili da ćete započeti s narudžbom: " +
                    "<form method=\"post\" action=\"https://waremaster.azurewebsites.net/api/orders/confirmincoming\" " +
                    "class=\"inline\">\r\n  <input type=\"hidden\" name=\"orderId\" value=\"" + orderId + "\">\r\n  " +
                    "<button type=\"submit\" name=\"submit_param\" value=\"submit_value\" " +
                    "class=\"link-button\">\r\nPotvrdi narudžbu\r\n  </button>\r\n</form>";
                mail.IsBodyHtml = true;
                smtpServer.Port = 587;
                smtpServer.Credentials = new NetworkCredential("waremasterapp@gmail.com", "Skladospodar00");
                smtpServer.EnableSsl = true;

                smtpServer.Send(mail);
            }
            return Ok(true);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("confirmincoming")]
        public IHttpActionResult ConfirmIncomingOrder(JObject orderIdObject)
        {
            var orderId = orderIdObject["orderId"].ToObject<int>();
            var didOrderConfirm = _orderRepository.ConfirmIncomingOrder(orderId);
            return Ok(!didOrderConfirm ? "Ta narudžba je već prihvaćena! Pristup odbijen." : "Narudžba je uspješno prihvaćena. Hvala!");
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

        [HttpPost]
        [Route("finish")]
        public IHttpActionResult FinishOutgoingOrder(JObject takenProducts)
        {
            var orderId = takenProducts["orderId"].ToObject<int>();
            takenProducts.Remove("orderId");
            if(!_orderRepository.FinishOrder(orderId, takenProducts))
                return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Forbidden));
            return Ok(true);
        }

        [HttpGet]
        [Route("search")]
        public IHttpActionResult SearchOrders(int companyid, string searchText)
        {
            return Ok(_orderRepository.SearchOrders(companyid, searchText));
        }
    }
}
