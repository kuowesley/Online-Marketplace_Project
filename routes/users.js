import {Router} from 'express';


const router = Router();
router
  .route('/')
  .get(async (req, res) => {
    try {
        
    } catch (e) {
      return res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    const body = req.body;
    
    console.log(body)
    return res.send(body);
  });


router
  .route('/:id')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {
    //res.send(`POST request to http://localhost:3000/users/${req.params.id}`);
  });


export default router;