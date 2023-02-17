import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - UpdateById',() => {

    let accessToken = '';

    beforeAll(async () => {
        const email = 'update-cidades@gmail.com'; 
        await testServer.post('/cadastrar').send({
            nome: 'UserTest',
            senha: '123456789',
            email: email,
        });
        const signInRes = await testServer.post('/entrar').send({email: email ,senha: '123456789'});

        accessToken = signInRes.body.accessToken;
        
    });

    it('Tenta atualizar um Registro por Id sem autenticação', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer
            .put(`/cidades/${res1.body}`)
            .send({ nome: 'Arcos' });
        
        expect(resAtualizada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resAtualizada.body).toHaveProperty('errors.default');
    });
    it('Atualiza um Registro por Id', async () => {

        const res1 = await testServer
            .post('/cidades')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer
            .put(`/cidades/${res1.body}`)
            .set({Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Arcos' });
        
        expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
    it('Tenta Atualizar um registro que nao existe', async () => {

        const res1 = await testServer
            .put('/cidades/99999')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Arcos' });

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});