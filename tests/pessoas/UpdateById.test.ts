import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Pessoas - UpdateById',() => {
    
    let cidadeId: number | undefined = undefined;
    let accessToken = '';
    beforeAll(async () => {

        const email = 'update-pessoas@gmail.com'; 
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

    it('Tenta atualizar um registro por Id sem autenticação', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateusupdatebyid@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        console.log(cidadeId);

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer
            .put(`/pessoas/${res1.body}`)
            .send({
                cidadeId,
                email: 'mateusupdatebyids@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });
        
        expect(resAtualizada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resAtualizada.body).toHaveProperty('errors.default');
    });
    it('Atualiza um Registro por Id', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'matupdatebyid1987@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer
            .put(`/pessoas/${res1.body}`)
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateusupdatebyids@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });
        
        expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
    it('Tenta Atualizar um registro que nao existe', async () => {

        const res2 = await testServer
            .put('/pessoas/99999')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateus@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res2.body).toHaveProperty('errors.default');
    });
});