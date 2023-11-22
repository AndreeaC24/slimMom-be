const express = require('express');
const router = express.Router(); 
const products = require('../../models/schemas/products.json');
const FormSchema = require('../../models/schemas/formSchema');
const User = require('../../models/schemas/user');  


router.post('/fetchForbiddenProducts', async (req, res) => {
  try {
    const { bloodType } = req.body;
    const forbiddenProducts = products.filter((product) => {
      const groupBloodNotAllowed = product.groupBloodNotAllowed; 
      return groupBloodNotAllowed.some((forbiddenGroup, index) => forbiddenGroup && bloodType[index]);
    }); 
    forbiddenProducts.forEach((product) => {
      console.log('Title:', product.title);
    });

    res.status(200).json({ forbiddenProducts });
  } catch (error) {
    console.error('Error in fetchForbiddenProducts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
