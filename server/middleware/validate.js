const Joi = require('joi');

// Функция-обёртка для валидации
function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            // Передаём ошибку дальше в глобальный обработчик ошибок
            return next(new Error(error.details[0].message));
        }
        next();
    };
}

module.exports = validate;
