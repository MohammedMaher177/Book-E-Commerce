

export const catchError = (fn) => {
    return async (req, res, next) => {
        fn(req, res, next).catch((error) => {
            next(error)
        })
    }
}   