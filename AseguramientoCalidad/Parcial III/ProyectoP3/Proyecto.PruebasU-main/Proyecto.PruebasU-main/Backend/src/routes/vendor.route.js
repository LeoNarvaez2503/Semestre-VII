const express = require('express');
const vendorController = require('../controllers/vendor.controller');

const router = express.Router();

router.post('/', vendorController.createVendor);
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;