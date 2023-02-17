import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - Create',() => {

    let accessToken = '';

    beforeAll(async () => {
        const email = 'create-cidades@gmail.com'; 
        await testServer.post('/cadastrar').send({
            nome: 'UserTest',
            senha: '123456789',
            email: email,
        });
        const signInRes = await testServer.post('/entrar').send({email: email ,senha: '123456789'});

        accessToken = signInRes.body.accessToken;
        
    });

    it('Tenta criar registro sem token de acesso', async () => {

        const res1 = await testServer
            .post('/cidades')
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    
    });
    it('Cria Registro', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Caxias do Sul'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });
    it('Tenta Criar Registro com nome muito curto', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({nome: 'Fo'});

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nome');
    });
    it('Tenta Criar Registro com um numero', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}`})
            .send({nome: 10});

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nome');
    });
});