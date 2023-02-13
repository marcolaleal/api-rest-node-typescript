import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - DeleteById',() => {

    let cidadeId: number | undefined = undefined;
    beforeAll(async () => {
        const resCidade = await testServer
            .post('/cidades')
            .send({nome: 'Teste'});
        
        cidadeId = resCidade.body;
    });

    it('Apagar um Registro', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .send({
                cidadeId,
                email: 'mateusDeleteById@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const resApaga = await testServer
            .delete(`/pessoas/${res1.body}`)
            .send();
        
        expect(resApaga.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
    it('Apagar um registro que nao existe', async () => {

        const res1 = await testServer
            .delete('/pessoas/99999')
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});