import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Cidades - DeleteById',() => {

    it('Apagar um Registro', async () => {

        const res1 = await testServer
            .post('/cidades')
            .send({nome: 'Formiga'});

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const resApaga = await testServer
            .delete(`/cidades/${res1.body}`)
            .send();
        
        expect(resApaga.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });
    it('Apagar um registro que nao existe', async () => {

        const res1 = await testServer
            .delete('/cidades/99999')
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });
});