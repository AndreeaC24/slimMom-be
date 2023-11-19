const express = require('express');
const router = express.Router();
const FormSchema = require('../../models/schemas/formSchema');
const products = require('../../models/schemas/products.json');

 
router.post('/saveForm', async (req, res) => {
  try {
    const formData = new FormSchema(req.body);
    const savedData = await formData.save(); 
    res.status(200).json(savedData);
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
});

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
