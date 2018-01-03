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
    [RoutePrefix("api/suppliers")]
    [Authorize]
    public class SuppliersController : ApiController
    {
        public SuppliersController()
        {
            _supplierRepository = new SupplierRepository();
        }

        private readonly SupplierRepository _supplierRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllSuppliers(int companyId)
        {
            return Ok(_supplierRepository.GetAllSuppliers(companyId));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddNewSupplier(Supplier supplierToAdd)
        {
            _supplierRepository.AddNewSupplier(supplierToAdd);
            return Ok(true);
        }

        [HttpGet]
        [Route("edit")]
        public IHttpActionResult GetSupplierToEdit(int id)
        {
            return Ok(_supplierRepository.GetSupplier(id));
        }

        [HttpPost]
        [Route("edit")]
        public IHttpActionResult EditSupplier(Supplier editedSupplier)
        {
            _supplierRepository.EditSupplier(editedSupplier);
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteSupplier(int id)
        {
            _supplierRepository.DeleteSupplier(id);
            return Ok(true);
        }
    }
}
