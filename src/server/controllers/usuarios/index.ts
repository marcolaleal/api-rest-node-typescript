import * as signIn from './signUp';
import * as signUp from './signIn';


export const UsuariosController = {
    ...signIn,
    ...signUp
};