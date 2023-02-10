import { ETableNames } from '../../ETableNames';
import { IPessoa } from '../../models';
import { Knex } from '../../knex';



export const updateById = async (id: number, pessoa: Omit<IPessoa, 'id'>): Promise<void | Error> => {
    try {
        //verifica se a cidade cadastrada na pessoa existe na tabela cidades
        const [{ count }] = await Knex(ETableNames.cidade)
            .where('id','=', pessoa.cidadeId)
            .count<[{ count: number }]>('* as count');

        //se nao existir da erro
        if(count === 0) {
            return new Error('A cidade usada no cadastro nao foi encontrada');
        }

        const result = await Knex(ETableNames.pessoa)
            .update(pessoa)
            .where('id','=',id);

        if (result > 0) return;

        return new Error('Erro ao atualizar o registro');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};