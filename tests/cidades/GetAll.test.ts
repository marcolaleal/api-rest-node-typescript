import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - GetAll',() => {

    let accessToken = '';

    beforeAll(async () => {
        const email = 'getall-cidades@gmail.com'; 
        await testServer.post('/cadastrar').send({
            nome: 'UserTest',
            senha: '123456789',
            email: email,
        });
        const signInRes = await testServer.post('/entrar').send({email: email ,senha: '123456789'});

        accessToken = signInRes.body.accessToken;
        
    });

    it('Tenta buscar todos os registros sem autenticação', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'São Paulo'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        
        const resBusca = await testServer
            .get('/cidades')
            .send();
        
        expect(resBusca.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBusca.body).toHaveProperty('errors.default');
    });
    it('Busca todos os Registros', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Caxias'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        
        const resBusca = await testServer
            .get('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send();
        
        expect(Number(resBusca.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBusca.statusCode).toEqual(StatusCodes.OK);
        expect(resBusca.body.length).toBeGreaterThan(0);
    });
});