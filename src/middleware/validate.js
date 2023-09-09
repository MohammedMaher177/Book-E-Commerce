const keys = ["body", "params", "query", "headers", "file"]


export const validate = (schema) => {
    return (req, res, next) => {
        
        const errors = []
        keys.forEach(key=>{
            if(schema[key]){
                const { error } = schema[key].validate(req[key], { abortEarly: false })
                if (error) {
                    error.details.forEach(ele => {
                        errors.push({ message: ele.message, field: ele.path[0] })
                    });
                }
            }
        })
        if(errors.length > 0){
            return res.status(404).json({ message: "error", errors })
        }
        return next()
    }
}