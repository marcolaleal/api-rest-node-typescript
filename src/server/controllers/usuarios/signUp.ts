import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';

import { UsuarioProvider } from '../../database/providers/usuarios';
import { validation } from '../../shared/middlewares';
import { IUsuario } from '../../database/models';


interface IBodyProps extends Omit<IUsuario, 'id'> {}


export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        nome: yup.string().required().min(3),
        senha: yup.string().required().min(6),
        email: yup.string().required().min(5).email(),
    }))
}));

export const signUp = async (req: Request<{},{},IUsuario>, res: Response) => {
    const result = await UsuarioProvider.create(req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            }
        });
    }

    return res.status(StatusCodes.CREATED).json(result);
};