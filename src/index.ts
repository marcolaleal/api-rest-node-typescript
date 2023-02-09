import { Knex } from './server/database/knex';
import { server } from './server/Server';
import 'dotenv/config';

const startServer = () => {
    server.listen(process.env.PORT || 3333, () => {
        console.log(`App rodando na porta ${process.env.PORT || 3333}`);
    });
};


if(process.env.IS_LOCALHOST !== 'true') {
    Knex.migrate.latest()
        .then(() => {
            startServer();
        })
        .catch(console.log);
} else {
    startServer();
}
