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
    [RoutePrefix("api/products")]
    public class ProductsController : ApiController
    {
        public ProductsController()
        {
            _productRepository = new ProductRepository();
        }
        private readonly ProductRepository _productRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllProducts()
        {
            return Ok(_productRepository.GetAllProducts(1));
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddProduct(Product productToAdd)
        {
            _productRepository.AddProduct(productToAdd);
            return Ok(true);
        }

        [HttpGet]
        [Route("edit")]
        public IHttpActionResult GetProductToEdit(int id)
        {
            return Ok(_productRepository.GetProduct(id));
        }

        [HttpPost]
        [Route("edit")]
        public IHttpActionResult EditProduct(Product editedProduct)
        {
            _productRepository.EditProduct(editedProduct);
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteProduct(int id)
        {
            _productRepository.DeleteProduct(id);
            return Ok(true);
        }
    }
}
