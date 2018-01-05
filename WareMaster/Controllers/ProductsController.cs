﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WareMaster.Data.Models.Entities;
using WareMaster.Domain.Repositories;

namespace WareMaster.Controllers
{
    [RoutePrefix("api/products")]
    [Authorize]
    public class ProductsController : ApiController
    {
        public ProductsController()
        {
            _productRepository = new ProductRepository();
            _companyRepository = new CompanyRepository();
        }
        private readonly ProductRepository _productRepository;
        private readonly CompanyRepository _companyRepository;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAllProducts(int companyId)
        {
            return Ok(_productRepository.GetAllProducts(companyId));
        }

        [HttpGet]
        [Route("add")]
        public IHttpActionResult GetIdNeededForImageName()
        {
            return Ok(_productRepository.GetLastProductId());
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddProduct(Product productToAdd)
        {
            var companyName = _companyRepository.GetCompanyById(productToAdd.CompanyId).Name;
            _productRepository.AddProduct(productToAdd);
            var lastId = _productRepository.GetLastProductId();
            productToAdd.ImageUrl = "Uploads\\" + companyName + "\\Proizvodi\\" +
                                    productToAdd.Name + lastId + ".jpg";
            _productRepository.EditProduct(productToAdd);
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
            var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
            var companyName = _companyRepository.GetCompanyById(editedProduct.CompanyId).Name;
            var oldUrlOfImage = Path.Combine(Directory.GetParent(uploadsFolder).ToString(), editedProduct.ImageUrl);
            var newUrlForImage = Path.Combine(Path.Combine(Path.Combine(uploadsFolder, companyName), "Proizvodi"),
                editedProduct.Name + editedProduct.Id + ".jpg");

            if (File.Exists(oldUrlOfImage) && oldUrlOfImage != newUrlForImage)
                File.Move(oldUrlOfImage, newUrlForImage);

            editedProduct.ImageUrl = "Uploads\\" + companyName + "\\Proizvodi\\" +
                                      editedProduct.Name + editedProduct.Id + ".jpg";
            _productRepository.EditProduct(editedProduct);
            return Ok(true);
        }

        [HttpDelete]
        [Route("delete")]
        public IHttpActionResult DeleteProduct(int id)
        {
            var companyName = _companyRepository.GetCompanyById(_productRepository.GetProduct(id).CompanyId).Name;
            var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
            var companyFolder = Path.Combine(Path.Combine(uploadsFolder, companyName), "Proizvodi");
            if (!Directory.Exists(companyFolder))
            {
                _productRepository.DeleteProduct(id);
                return Ok(true);
            }
            var fileToDeleteFilter = @"*" + id + ".jpg";
            var fileToDelete = Directory.GetFiles(companyFolder, fileToDeleteFilter);
            if (fileToDelete.Any())
                File.Delete(fileToDelete[0]);
            _productRepository.DeleteProduct(id);
            return Ok(true);
        }

        [HttpPost]
        [Route("upload")]
        public IHttpActionResult UploadImage(int companyId)
        {
            if (HttpContext.Current.Request.Files.Count > 0)
            {
                var file = HttpContext.Current.Request.Files[0];
                var companyName = _companyRepository.GetCompanyById(companyId).Name;
                var uploadsFolder = HttpContext.Current.Server.MapPath("\\Uploads");
                Directory.CreateDirectory(Path.Combine(Path.Combine(uploadsFolder, companyName), "Proizvodi"));
                var path = Path.Combine(Path.Combine(Path.Combine(uploadsFolder, companyName), "Proizvodi"), file.FileName);

                file.SaveAs(path);
                file.InputStream.Close();
            }
            return Ok(true);
        }
    }
}
