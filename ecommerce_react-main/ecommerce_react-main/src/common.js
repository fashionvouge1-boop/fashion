const productsArray = [
  { id: 1, image: 'https://via.placeholder.com/400?text=Product+1', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 579, rating: 4.3, discount: 60 },
  { id: 2, image: 'https://via.placeholder.com/400?text=Product+2', title: 'Sera', description: 'Floral Printed Tie-Up Shrug', price: 579, rating: 4.3, discount: 60 },
  { id: 3, image: 'https://via.placeholder.com/400?text=Product+3', title: 'Sera', description: 'Women Printed Tie-Up Shrug', price: 579, rating: 4.3, discount: 60 },
  { id: 4, image: 'https://via.placeholder.com/400?text=Product+4', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 579, rating: 4.3, discount: 60 },
  { id: 5, image: 'https://via.placeholder.com/400?text=Product+5', title: 'Sera', description: 'Women Printed Shrug', price: 519, rating: 4.4, discount: 60 },
  { id: 6, image: 'https://via.placeholder.com/400?text=Product+6', title: 'Sera', description: 'Women Printed Tie-Up Shrug', price: 597, rating: 4.2, discount: 60 },
  { id: 7, image: 'https://via.placeholder.com/400?text=Product+7', title: 'Sera', description: 'Women Printed Tie-Up Shrug', price: 579, rating: 4.3, discount: 60 },
  { id: 8, image: 'https://via.placeholder.com/400?text=Product+8', title: 'Sera', description: 'Women Printed Tie-Up Shrug', price: 519, rating: 4.4, discount: 60 },
  { id: 9, image: 'https://via.placeholder.com/400?text=Product+9', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 597, rating: 4.2, discount: 60 },
  { id: 10, image: 'https://via.placeholder.com/400?text=Product+10', title: 'Sera', description: 'Women Printed Tie-Up Shrug', price: 757, rating: 3.2, discount: 60 },
  { id: 11, image: 'https://via.placeholder.com/400?text=Product+11', title: 'Sera', description: 'Crop Tie-Up Shrug', price: 519, rating: 4.0, discount: 60 },
  { id: 12, image: 'https://via.placeholder.com/400?text=Product+12', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 719, rating: 4.5, discount: 60 },
  { id: 13, image: 'https://via.placeholder.com/400?text=Product+13', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 519, rating: 4.1, discount: 60 },
  { id: 14, image: 'https://via.placeholder.com/400?text=Product+14', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 519, rating: 4.3, discount: 60 },
  { id: 15, image: 'https://via.placeholder.com/400?text=Product+15', title: 'Sera', description: 'Floral Printed Crop Shrug', price: 639, rating: 4.3, discount: 60 },
  { id: 16, image: 'https://via.placeholder.com/400?text=Product+16', title: 'Sera', description: 'Women Tie-Up Shrug', price: 519, rating: 3.7, discount: 60 },
  { id: 17, image: 'https://via.placeholder.com/400?text=Product+17', title: 'Sera', description: 'Printed Bohemian Crop Shrug', price: 759, rating: 4.3, discount: 60 },
  { id: 18, image: 'https://via.placeholder.com/400?text=Product+18', title: 'Sera', description: 'Printed Tie-Up Shrug', price: 719, rating: 3.5, discount: 60 },
  { id: 19, image: 'https://via.placeholder.com/400?text=Product+19', title: 'Sera', description: 'Printed Crop Open Front Shrug', price: 639, rating: 4.2, discount: 60 },
  { id: 20, image: 'https://via.placeholder.com/400?text=Product+20', title: 'Sera', description: 'Printed Crop Tie-Up Shrug', price: 519, rating: 4.3, discount: 60 }
];

const singleData = Array.from({ length: 20 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    images: Array.from({ length: 5 }, (__, j) => `https://via.placeholder.com/720x960?text=Product+${id}+Image+${j+1}`),
    title: `Sera Product ${id}`,
    price: 499 + (id % 5) * 50,
    discount: 60,
    size: ['M', 'S', 'L', 'XL'],
    rating: Number((3.5 + ((id % 5) * 0.2)).toFixed(1))
  };
});

export { productsArray, singleData };
