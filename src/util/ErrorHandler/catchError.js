
export const catchError = (fn) => async (req, res, next) => {
    try {
        return await Promise.resolve(fn(req, res, next));
    } catch (error) {
        console.log(error);
        next(error);
    }

} 