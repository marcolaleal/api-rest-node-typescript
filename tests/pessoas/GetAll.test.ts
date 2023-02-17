import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';



describe('Pessoas - GetAll',() => {

    let cidadeId: number | undefined = undefined;
    let accessToken = '';
    beforeAll(async () => {

        const email = 'getall-pessoas@gmail.com'; 
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

    it('Tenta buscar todos os registros sem autenticação', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateusGetAll@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        
        const resBusca = await testServer
            .get('/pessoas')
            .send();
        
        expect(resBusca.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBusca.body).toHaveProperty('errors.default');
    });
    it('Busca todos os Registros', async () => {

        const res1 = await testServer
            .post('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send({
                cidadeId,
                email: 'mateusGetAll2@gmail.com',
                nomeCompleto: 'Mateus Leal'
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        
        const resBusca = await testServer
            .get('/pessoas')
            .set({Authorization: `Bearer ${accessToken}` })
            .send();
        
        expect(Number(resBusca.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBusca.statusCode).toEqual(StatusCodes.OK);
        expect(resBusca.body.length).toBeGreaterThan(0);
    });
});