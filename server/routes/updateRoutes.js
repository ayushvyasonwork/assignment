import express from 'express';
import {
  requestUpdateMongo, confirmUpdateMongo,
  requestDeleteMongo, confirmDeleteMongo
} from '../controllers/updateProfile.js';

import {
  requestUpdateSQL, confirmUpdateSQL,
  requestDeleteSQL, confirmDeleteSQL
} from '../controllers/updateProfileMysql.js';

const router = express.Router();

// MongoDB
router.put('/mongo/request-update', requestUpdateMongo);
router.get('/mongo/confirm-update/:token', confirmUpdateMongo);
router.get('/mongo/request-delete', requestDeleteMongo);
router.get('/mongo/confirm-delete/:token', confirmDeleteMongo);

// MySQL
router.put('/sql/request-update', requestUpdateSQL);
router.get('/sql/confirm-update/:token', confirmUpdateSQL);
router.delete('/sql/request-delete', requestDeleteSQL);
router.get('/sql/confirm-delete/:token', confirmDeleteSQL);

export default router;
