using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/suppliers")]
    public class SuppliersController : ApiController
    {
        public SuppliersController()
        {
            _supplierRepository = new SupplierRepository();
        }

        private readonly SupplierRepository _supplierRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllSuppliers()//dodat int id od tvrtke
        {
            return Ok(_supplierRepository.GetAllSuppliersForACompany(1));
        }

        [HttpGet]
        [Route("details")]
        public IHttpActionResult GetSupplierDetails(int id)
        {
            var supplierDetails = _supplierRepository.GetSupplier(id);
            //var supplier = MovieDto.FromMovie(movieDetails);
            return Ok(supplierDetails);
        }
    }
}
