import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';

import { UsuarioProvider } from '../../database/providers/usuarios';
import { validation } from '../../shared/middlewares';
import { IUsuario } from '../../database/models';
import { PasswordCrypto } from '../../shared/services/PasswordCrypto';


interface IBodyProps extends Omit<IUsuario, 'id' | 'nome'> {}


export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        senha: yup.string().required().min(6),
        email: yup.string().required().min(5).email(),
    }))
}));

export const signIn = async (req: Request<{},{},IBodyProps>, res: Response) => {
    
    const { email, senha } = req.body;
    
    const result = await UsuarioProvider.getByEmail(email);

    if (result instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha invalidos',
            }
        });
    }


    const passwordMatch = await PasswordCrypto.verifyPassword(senha,result.senha);
    if (!passwordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha invalidos',
            }
        });
    } else {
        return res.status(StatusCodes.OK).json({accessToken: 'teste.teste.teste'});
    }
};