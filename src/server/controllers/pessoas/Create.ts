import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';

import { PessoaProvider } from '../../database/providers/pessoas';
import { validation } from '../../shared/middlewares';
import { IPessoa } from '../../database/models';


interface IBodyProps extends Omit<IPessoa, 'id'> {}


export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nomeCompleto: yup.string().required().min(3),
        cidadeId: yup.number().integer().required(),
        email: yup.string().required().email(),
    }))
}));

export const create = async (req: Request<{},{},IPessoa>, res: Response) => {
    const result = await PessoaProvider.create(req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            }
        });
    }

    return res.status(StatusCodes.CREATED).json(result);
};