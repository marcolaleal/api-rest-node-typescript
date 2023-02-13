import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - GetById',() => {

    let cidadeId: number | undefined = undefined;
    beforeAll(async () => {
        const resCidade = await testServer
            .post('/cidades')
            .send({nome: 'Teste'});
        
        cidadeId = resCidade.body;
    });

    it('Busca um Registro por Id', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .send({
                cidadeId,
                email: 'mateusgetById@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resBusca = await testServer
            .get(`/pessoas/${res1.body}`)
            .send();
        
        expect(resBusca.statusCode).toEqual(StatusCodes.OK);
        expect(resBusca.body).toHaveProperty('nomeCompleto');
    });
    it('Busca um registro que nao existe', async () => {

        const res1 = await testServer
            .get('/pessoas/99999')
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});