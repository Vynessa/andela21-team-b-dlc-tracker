import express from 'express';

const router = express.Router();

// test
router.get('/:comm/:id', (req, res) => {
  const community = req.params.comm,
    id = req.params.id;
  
  const aModule = {

  }
  res.render('module', { module: aModule, error: null });
});

router.post('/:comm/:id', (req, res) => {
  const correct = true; // or false

  if (correct) {
    res.render('module', { module: aModule, error: null });  // Render next module
  } else {
    const errorMessage = "Incorrect Answer";
    res.render('module', { module: aMOdule, error: errorMessage }); // Same module
  }
});
