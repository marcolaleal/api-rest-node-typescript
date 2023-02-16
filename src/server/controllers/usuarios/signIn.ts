import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';

import { UsuarioProvider } from '../../database/providers/usuarios';
import { validation } from '../../shared/middlewares';
import { IUsuario } from '../../database/models';
import { JWTService, PasswordCrypto } from '../../shared/services';


interface IBodyProps extends Omit<IUsuario, 'id' | 'nome'> {}


export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        senha: yup.string().required().min(6),
        email: yup.string().required().min(5).email(),
    }))
}));

export const signIn = async (req: Request<{},{},IBodyProps>, res: Response) => {
    
    const { email, senha } = req.body;
    
    const usuario = await UsuarioProvider.getByEmail(email);

    if (usuario instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha invalidos',
            }
        });
    }


    const passwordMatch = await PasswordCrypto.verifyPassword(senha,usuario.senha);
    if (!passwordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email ou senha invalidos',
            }
        });
    } else {

        const accessToken = JWTService.sign({uid: usuario.id});

        if (accessToken === 'JWT_SECRET_NOT_FOUND') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'Erro ao gerar token de acesso'
                }
            });
        }

        return res.status(StatusCodes.OK).json({ accessToken });
    }
};