const catalogueService = require('./catalogue.service');

// ─── Products ────────────────────────────────────────────────────────────────

async function listProducts(req, res, next) {
  try {
    const result = await catalogueService.listProducts(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await catalogueService.getProduct(req.params.productId);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await catalogueService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await catalogueService.updateProduct(req.params.productId, req.body);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await catalogueService.deleteProduct(req.params.productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Product Images ──────────────────────────────────────────────────────────

async function listProductImages(req, res, next) {
  try {
    const images = await catalogueService.listProductImages(req.params.productId);
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
}

async function addProductImage(req, res, next) {
  try {
    const image = await catalogueService.addProductImage(req.params.productId, req.body);
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
}

async function deleteProductImage(req, res, next) {
  try {
    await catalogueService.deleteProductImage(req.params.productId, req.params.imageId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── SKUs ────────────────────────────────────────────────────────────────────

async function listSkus(req, res, next) {
  try {
    const skus = await catalogueService.listSkus(req.params.productId);
    res.status(200).json(skus);
  } catch (err) {
    next(err);
  }
}

async function getSku(req, res, next) {
  try {
    const sku = await catalogueService.getSku(req.params.productId, req.params.skuId);
    res.status(200).json(sku);
  } catch (err) {
    next(err);
  }
}

async function createSku(req, res, next) {
  try {
    const sku = await catalogueService.createSku(req.params.productId, req.body);
    res.status(201).json(sku);
  } catch (err) {
    next(err);
  }
}

async function updateSku(req, res, next) {
  try {
    const sku = await catalogueService.updateSku(req.params.productId, req.params.skuId, req.body);
    res.status(200).json(sku);
  } catch (err) {
    next(err);
  }
}

async function deleteSku(req, res, next) {
  try {
    await catalogueService.deleteSku(req.params.productId, req.params.skuId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

async function listCategories(req, res, next) {
  try {
    const categories = await catalogueService.listCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await catalogueService.getCategory(req.params.categoryId);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

async function listProductsByCategory(req, res, next) {
  try {
    const result = await catalogueService.listProductsByCategory(req.params.categoryId, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await catalogueService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await catalogueService.updateCategory(req.params.categoryId, req.body);
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await catalogueService.deleteCategory(req.params.categoryId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Brands ──────────────────────────────────────────────────────────────────

async function listBrands(req, res, next) {
  try {
    const brands = await catalogueService.listBrands();
    res.status(200).json(brands);
  } catch (err) {
    next(err);
  }
}

async function getBrand(req, res, next) {
  try {
    const brand = await catalogueService.getBrand(req.params.brandId);
    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
}

async function createBrand(req, res, next) {
  try {
    const brand = await catalogueService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
}

async function updateBrand(req, res, next) {
  try {
    const brand = await catalogueService.updateBrand(req.params.brandId, req.body);
    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
}

async function deleteBrand(req, res, next) {
  try {
    await catalogueService.deleteBrand(req.params.brandId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listSkus,
  getSku,
  createSku,
  updateSku,
  deleteSku,
  listCategories,
  getCategory,
  listProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
