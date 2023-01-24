import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - GetById',() => {

    it('Busca um Registro por Id', async () => {

        const res1 = await testServer
            .post('/cidades')
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resBusca = await testServer
            .get(`/cidades/${res1.body}`)
            .send();
        
        expect(resBusca.statusCode).toEqual(StatusCodes.OK);
        expect(resBusca.body).toHaveProperty('nome');
    });
    it('Busca um registro que nao existe', async () => {

        const res1 = await testServer
            .get('/cidades/99999')
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});