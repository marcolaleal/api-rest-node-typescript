import { ETableNames } from '../../ETableNames';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';



export const create = async (pessoa: Omit<IPessoa, 'id'>): Promise<number | Error> => {
    try {
        //verifica se a cidade cadastrada na pessoa existe na tabela cidades
        const [{ count }] = await Knex(ETableNames.cidade)
            .where('id','=', pessoa.cidadeId)
            .count<[{ count: number }]>('* as count');

        //se nao existir da erro
        if(count === 0) {
            return new Error('A cidade usada no cadastro nao foi encontrada');
        }

        //se exitir continua para salvar a pessoa no banco de dados
        const [result] = await Knex(ETableNames.pessoa).insert(pessoa).returning('id');

        if (typeof result === 'object') {
            return result.id;
        }else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }
};