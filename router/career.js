const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { uploadImage, uploadDocument } = require('../middleware/upload');
const {
  getAllVacancies,
  getVacancyById,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  getAllApplicants,
  applyJob,
  updateApplicantStatus,
  deleteApplicant
} = require('../controller/career');

// ── Public Vacancy & Application Routes ──────────────────────────────────────
router.get('/vacancies', getAllVacancies);
router.get('/vacancies/:id', getVacancyById);
router.post('/vacancies/:vacancyId/apply', uploadDocument.single('cv'), applyJob);

// ── Protected Admin/HR Routes ────────────────────────────────────────────────
router.post('/vacancies', authenticate, uploadImage.single('image'), createVacancy);
router.put('/vacancies/:id', authenticate, uploadImage.single('image'), updateVacancy);
router.delete('/vacancies/:id', authenticate, deleteVacancy);

router.get('/applicants', authenticate, getAllApplicants);
router.put('/applicants/:id/status', authenticate, updateApplicantStatus);
router.delete('/applicants/:id', authenticate, deleteApplicant);

module.exports = router;
