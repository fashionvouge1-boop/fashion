const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/slider-image/get', (req, res) => {
  res.json({
    statusCode: 1,
    data: {
      slideImages: [
        'https://assets.myntassets.com/f_webp,w_480,c_limit,fl_progressive/assets/images/2023/12/13/41586a5f-7a1a-4b75-ac8f-27c87319f15d1702452890247-Desktop-banner-4.jpg',
        'https://assets.myntassets.com/f_webp,w_480,c_limit,fl_progressive/assets/images/2024/1/4/b6872304-bcc9-42ed-94f5-d4b949ec4c051704840431315-Desktop-banner1.jpg'
      ],
      logo: 'https://cdn.shopify.com/s/files/1/0588/1567/6504/files/LOGO_FOR_SOFA.png?v=1723884058'
    }
  });
});

app.get('/api/analytic-code/get', (req, res) => {
  res.json({ statusCode: 1, data: {} });
});

app.get('/api/category/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    statusCode: 1,
    data: {
      _id: id,
      title: `Category ${id}`,
      description: 'Fallback category data for local development',
      images: []
    }
  });
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
