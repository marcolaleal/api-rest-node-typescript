import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - DeleteById',() => {

    let accessToken = '';

    beforeAll(async () => {
        const email = 'delete-cidades@gmail.com'; 
        await testServer.post('/cadastrar').send({
            nome: 'UserTest',
            senha: '123456789',
            email: email,
        });
        const signInRes = await testServer.post('/entrar').send({email: email ,senha: '123456789'});

        accessToken = signInRes.body.accessToken;
        
    });
    
    it('Tenta apagar um Registro sem Autenticação', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const resApaga = await testServer
            .delete(`/cidades/${res1.body}`)
            .send();
        
        expect(resApaga.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resApaga.body).toHaveProperty('errors.default');
    });
    it('Apagar um Registro', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const resApaga = await testServer
            .delete(`/cidades/${res1.body}`)
            .set({Authorization: `Bearer ${accessToken}` })
            .send();
        
        expect(resApaga.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
    it('Apagar um registro que nao existe', async () => {

        const res1 = await testServer
            .delete('/cidades/99999')
            .set({Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});