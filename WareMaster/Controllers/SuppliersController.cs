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
        [Route("getall")]
        public IHttpActionResult GetAllSuppliers(int companyId)
        {
            return Ok(_supplierRepository.GetAllSuppliers(companyId));
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetSuppliers(int companyId, int currentPosition)
        {
            return Ok(_supplierRepository.GetSuppliers(companyId, currentPosition));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddNewSupplier(Supplier supplierToAdd)
        {
            _supplierRepository.AddNewSupplier(supplierToAdd);
            return Ok(true);
        }

        [HttpGet]
        [Route("details")]
        public IHttpActionResult GetSupplierDetails(int id, int companyId)
        {
            var supplier = _supplierRepository.GetSupplierDetails(id, companyId);
            if(supplier != null)
                return Ok(supplier);
            return new ResponseMessageResult(Request.CreateResponse(HttpStatusCode.Unauthorized));
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
