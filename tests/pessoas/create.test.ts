import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Pessoas - Create',() => {
    
    let cidadeId: number | undefined = undefined;
    let accessToken = '';
    beforeAll(async () => {

        const email = 'create-pessoas@gmail.com'; 
        await testServer.post('/cadastrar').send({
            nome: 'UserTest',
            senha: '123456789',
            email: email,
        });
        const signInRes = await testServer.post('/entrar').send({email: email ,senha: '123456789'});

        accessToken = signInRes.body.accessToken;

        const resCidade = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Teste'});
        
        cidadeId = resCidade.body;
    });

    it('Tenta criar registro sem autenticação', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .send({
                cidadeId,
                email: 'createsemauth@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
    it('Cria Registro', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateuscreate@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });
    it('Cria Registro 2', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateuscreate2@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });
    it('tenta criar registro com email duplicado', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateusduplicado@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const res2 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateusduplicado@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });
        
        expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res2.body).toHaveProperty('errors.default');
    });
    it('Tenta Criar Registro com nome completo muito curto', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mate@gmail.com',
                nomeCompleto: 'M'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
    });
    it('Tenta Criar Registro sem nome completo', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mate@gmail.com',
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
    });
    it('Tenta Criar Registro sem email', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });
    it('Tenta Criar Registro com email invalido', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateus',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });
    it('Tenta Criar Registro sem cidadeId', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                email: 'mateusleal01@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.cidadeId');
    });
    it('Tenta Criar Registro com cidadeId invalido', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId: 'teste',
                email: 'mateusleal01@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.cidadeId');
    });
    it('Tenta Criar Registro com cidade que nao esta cadastrada', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId: 99999,
                email: 'mateusleal01@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
    it('Tenta Criar Registro com cidadeId invalido', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({});

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
        expect(res1.body).toHaveProperty('errors.body.cidadeId');
        expect(res1.body).toHaveProperty('errors.body.nomeCompleto');
    });
});