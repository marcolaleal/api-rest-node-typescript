import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';

import { PessoaProvider } from '../../database/providers/pessoas';
import { validation } from '../../shared/middlewares';
import { IPessoa } from '../../database/models';


interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IPessoa, 'id'> {}

export const updateByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nomeCompleto: yup.string().required().min(3),
        cidadeId: yup.number().integer().required(),
        email: yup.string().required().email(),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateById = async (req: Request<IParamProps,{},IBodyProps>, res: Response) => {

    if (!req.params.id) { 
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parametro "id" precisa ser infromado'
            }
        });
    }

    const result = await PessoaProvider.updateById(req.params.id,req.body);
    
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json(result);
};