import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from 'express';
import { SchemaOf, ValidationError } from 'yup';


type TProperty = 'body' | 'header' | 'params' | 'query';

type TGetSchema = <T>(schema: SchemaOf<T>) => SchemaOf<T>

type TAllSchemas = Record<TProperty, SchemaOf<any>>;

type TGetAllSchemas = (getSchema: TGetSchema) => Partial <TAllSchemas>

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas(schema => schema);

    /*
        Cria uma const errorsResult que é um objeto para receber todos os erros de validação no formato de objeto
        tal como o exemplo abaixo
        {
            "errorsResult": {
                "body": {
			        "nome": "O campo deve ter pelo menos 3 caracteres",
			        "estado": "Este campo é obrigatório"
		        },
                "query": {
                    "filter": "O campo deve ter pelo menos 3 caracteres"
                }
            }
        }
    */
    const errorsResult: Record<string, Record<string, string>> = {};


    /* 
        faz a validação propriamente dita, recebe um objeto com os Schemas que devem ser validados
        o Object.entries transfoma o objeto com os schemas em um array de arrays, cada um composto com a chave (body queryu...)
        e seu schema correspondente. Dessa forma é possivel validar todos os campos de todas as partes do doc que foram
        passadas ao mesmo tempo.
        Como a validação é uma função async usamos o validateSync
        Caso aconteça um erro, ele é guardado na const errorResult
    */
    Object.entries(schemas).forEach(([key, schema]) => {
        try {
            schema.validateSync(req[key as TProperty], { abortEarly: false });
        } catch (err) {
            const yupError = err as ValidationError;
            const errors: Record<string, string> = {};

            yupError.inner.forEach(error => {
                if (error.path === undefined) return;

                errors[error.path] = error.message;
            });

            errorsResult[key] = errors;

        }
    });


    if (Object.entries(errorsResult).length === 0) {
        return next();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ errorsResult });
    }

};