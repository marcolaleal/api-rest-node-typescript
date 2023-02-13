import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - GetAll',() => {

    let cidadeId: number | undefined = undefined;
    beforeAll(async () => {
        const resCidade = await testServer
            .post('/cidades')
            .send({nome: 'Teste'});
        
        cidadeId = resCidade.body;
    });

    it('Busca todos os Registros', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .send({
                cidadeId,
                email: 'mateusGetAll@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        
        const resBusca = await testServer
            .get('/pessoas')
            .send();
        
        expect(Number(resBusca.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBusca.statusCode).toEqual(StatusCodes.OK);
        expect(resBusca.body.length).toBeGreaterThan(0);
    });
});