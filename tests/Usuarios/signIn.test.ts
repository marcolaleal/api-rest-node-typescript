import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Usuarios - SignIn',() => {
    beforeAll(async () => {
        await testServer.post('/cadastrar').send({
            nome: 'Gustavo',
            senha: '123456789',
            email: 'gustavo@hotmail.com'
        });
    });

    it('Faz Login', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                senha: '123456789',
                email: 'gustavo@hotmail.com'
            });

        expect(res1.statusCode).toEqual(StatusCodes.OK);
        expect(res1.body).toHaveProperty('accessToken');
    });
    it('Senha errada', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                senha: '987654321',
                email: 'gustavo@hotmail.com'
            });

        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
    it('Email errado', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                senha: '123456789',
                email: 'mateus@hotmail.com'
            });

        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
    it('Formato de email invalido', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                senha: '123456789',
                email: 'gustavo hotmail.com'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });
    it('senha muito pequena', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                senha: '12',
                email: 'gustavo@hotmail.com'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.senha');
    });
    it('Senha nao informada', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                email: 'gustavo@hotmail.com'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.senha');
    });
    it('Email nao informado', async () => {

        const res1 = await testServer
            .post('/entrar')
            .send({
                senha: '123456789'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });
});