import PasswordValidator from 'password-validator';

type ValidationDetail = {
    validation: string;
    arguments: any;
    message: string;
}

export const usePasswordValidator = () => {
    const schema = new PasswordValidator();
    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().not().spaces()
        .is().not().oneOf(['Passw0rd', 'Password123']);
    
    const validatePassword = (password: string): ValidationDetail[] => {
        return schema.validate(password, { details: true }) as ValidationDetail[];
    }

    return {
        validatePassword
    }
}