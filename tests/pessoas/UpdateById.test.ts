import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Pessoas - UpdateById',() => {
    
    let cidadeId: number | undefined = undefined;
    beforeAll(async () => {
        const resCidade = await testServer
            .post('/cidades')
            .send({nome: 'TesteUpdate'});
        
        cidadeId = resCidade.body;
    });

    it('Atualiza um Registro por Id', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .send({
                cidadeId,
                email: 'mateusupdatebyid@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAtualizada = await testServer
            .put(`/pessoas/${res1.body}`)
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
            .send({
                cidadeId,
                email: 'mateus@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res2.body).toHaveProperty('errors.default');
    });
});