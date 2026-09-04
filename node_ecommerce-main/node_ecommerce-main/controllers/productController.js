const products = require('../data/products');

exports.getAllProducts = async (req, res) => {
  try {
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPaginatedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const category = req.query.category;
    let data = [...products];

    if (category) {
      data = data.filter((item) => String(item.id) === String(category) || String(item.product_type) === String(category));
    }

    const total = data.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
      statusCode: 1,
      total,
      data: data.slice(start, end)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  const { identifier } = req.params;
  try {
    const product = products.find((item) =>
      String(item._id) === String(identifier) ||
      String(item.id) === String(identifier) ||
      String(item.handle) === String(identifier)
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
