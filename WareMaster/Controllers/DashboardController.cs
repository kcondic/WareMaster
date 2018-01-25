using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/dashboard")]
    [Authorize]
    public class DashboardController : ApiController
    {
        public DashboardController()
        {
            _activityLogRepository = new ActivityLogRepository();
            _userRepository = new UserRepository();
            _orderRepository = new OrderRepository();
            _productRepository = new ProductRepository();
            _suppliersRepository = new SupplierRepository();
        }

        private readonly ActivityLogRepository _activityLogRepository;
        private readonly UserRepository _userRepository;
        private readonly OrderRepository _orderRepository;
        private readonly ProductRepository _productRepository;
        private readonly SupplierRepository _suppliersRepository;

        [HttpGet]
        [Route("generalinfo")]
        public IHttpActionResult GetGeneralInfoForDashboard(int companyId)
        {
            var employeeCount = _userRepository.GetEmployeeCount(companyId);
            var productCount = _productRepository.GetProductCount(companyId);

            var allSuppliers = _suppliersRepository.GetAllSuppliers(companyId);
            var supplierCount = allSuppliers.Count();

            var allOrders = _orderRepository.GetAllOrders(companyId);
            var allOrdersCount = allOrders.Count();

            

            var incomingOrdersPlannedCount = allOrders.Where(order => order.Type == Data.Models.Entities.Type.Incoming && order.Status == Data.Models.Entities.Status.Created).Count();
            var incomingOrdersActiveCount = allOrders.Where(order => order.Type == Data.Models.Entities.Type.Incoming && order.Status == Data.Models.Entities.Status.InProgress).Count();
            var incomingOrdersFinishedCount = allOrders.Where(order => order.Type == Data.Models.Entities.Type.Incoming && order.Status == Data.Models.Entities.Status.Finished).Count();

            var outgoingOrdersPlannedCount = allOrders.Where(order => order.Type == Data.Models.Entities.Type.Outgoing && order.Status == Data.Models.Entities.Status.Created).Count();
            var outgoingOrdersActiveCount = allOrders.Where(order => order.Type == Data.Models.Entities.Type.Outgoing && order.Status == Data.Models.Entities.Status.InProgress).Count();
            var outgoingOrdersFinishedCount = allOrders.Where(order => order.Type == Data.Models.Entities.Type.Outgoing && order.Status == Data.Models.Entities.Status.Finished).Count();

            Dictionary<string, int> countedNumbers = new Dictionary<string, int>()
                                                            {
                                                                {"employeeCount", employeeCount},
                                                                {"productCount", productCount},
                                                                {"supplierCount", supplierCount},
                                                                {"allOrdersCount", allOrdersCount},
                                                                {"incomingOrdersPlannedCount", incomingOrdersPlannedCount},
                                                                {"incomingOrdersActiveCount", incomingOrdersActiveCount},
                                                                {"incomingOrdersFinishedCount", incomingOrdersFinishedCount},
                                                                {"outgoingOrdersPlannedCount", outgoingOrdersPlannedCount},
                                                                {"outgoingOrdersActiveCount", outgoingOrdersActiveCount},
                                                                {"outgoingOrdersFinishedCount", outgoingOrdersFinishedCount}
                                                            };

            return Ok(countedNumbers);
        }

    }
}
