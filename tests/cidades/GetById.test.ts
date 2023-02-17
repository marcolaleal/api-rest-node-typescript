import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - GetById',() => {

    let accessToken = '';

    beforeAll(async () => {
        const email = 'getbyid-cidades@gmail.com'; 
        await testServer.post('/cadastrar').send({
            nome: 'UserTest',
            senha: '123456789',
            email: email,
        });
        const signInRes = await testServer.post('/entrar').send({email: email ,senha: '123456789'});

        accessToken = signInRes.body.accessToken;
        
    });

    it('Tenta buscar um registro por Id sem autenticação', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resBusca = await testServer
            .get(`/cidades/${res1.body}`)
            .send();
        
        expect(resBusca.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBusca.body).toHaveProperty('errors.default');
    });
    it('Busca um Registro por Id', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resBusca = await testServer
            .get(`/cidades/${res1.body}`)
            .set({Authorization: `Bearer ${accessToken}` })
            .send();
        
        expect(resBusca.statusCode).toEqual(StatusCodes.OK);
        expect(resBusca.body).toHaveProperty('nome');
    });
    it('Busca um registro que nao existe', async () => {

        const res1 = await testServer
            .get('/cidades/99999')
            .set({Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});