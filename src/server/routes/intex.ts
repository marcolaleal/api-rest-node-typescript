import { Router } from 'express';


import { CidadesController } from '../controllers';

const router = Router();


router.get('/',(_,res) =>{
    return res.send('Ola Dev! A API esta rodando');
});

router.post('/cidades',  
    CidadesController.createValidation,
    CidadesController.create
);



export {router};
