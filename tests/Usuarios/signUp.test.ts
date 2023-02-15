import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Usuarios - SignUp',() => {
    it('Cria Registro', async () => {

        const res1 = await testServer
            .post('/cadastrar')
            .send({
                email: 'mateuscreate@gmail.com',
                senha: '123456789',
                nome: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });
    it('Cria Registro 2', async () => {

        const res1 = await testServer
            .post('/cadastrar')
            .send({
                email: 'brunacreate@gmail.com',
                senha: '987654321',
                nome: 'Bruna Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });
    it('tenta criar registro com email duplicado', async () => {

        const res1 = await testServer
            .post('/cadastrar')
            .send({
                senha: '987654321',
                email: 'mateusduplicado@gmail.com',
                nome: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const res2 = await testServer
            .post('/cadastrar')
            .send({
                senha: '987654321',
                email: 'mateusduplicado@gmail.com',
                nome: 'Mateus Leal'
            });
        
        expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res2.body).toHaveProperty('errors.default');
    });
    it('Tenta Criar Registro sem nome completo', async () => {
        
        const res1 = await testServer
            .post('/cadastrar')
            .send({
                senha: '987654321',
                email: 'mate@gmail.com',
            });
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nome');
    });
    it('Tenta Criar Registro sem email', async () => {
        
        const res1 = await testServer
            .post('/cadastrar')
            .send({
                senha: '987654321',
                nome: 'Mateus Leal'
            });
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });
    it('Tenta Criar Registro sem senha', async () => {
        
        const res1 = await testServer
            .post('/cadastrar')
            .send({
                email: 'mateus@gmail.com',
                nome: 'Mateus Leal'
            });
        
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.senha');
    });
    it('Tenta Criar Registro com nome muito curto', async () => {

        const res1 = await testServer
            .post('/cadastrar')
            .send({
                senha: '987654321',
                email: 'mate@gmail.com',
                nomeCompleto: 'M'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nome');
    });
    it('Tenta Criar Registro com email invalido', async () => {

        const res1 = await testServer
            .post('/cadastrar')
            .send({
                senha: '987654321',
                email: 'mate gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });
    it('Tenta Criar Registro com senha muito curto', async () => {

        const res1 = await testServer
            .post('/cadastrar')
            .send({
                senha: '12',
                email: 'mateus.leal@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.senha');
    });
});