module.exports = {
    /**
     * @method :- success
     * @isSuccess: 
     */
    success: (message = 'success', response = [], status = 200, error = false, success = true) => {
        return {
            message,
            response,
            status,
            error,
            success
        }
    },

    successWithMsg : (response = [], status = 200, error = false, success = true) => {
        return {
            response,
            status,
            error,
            success
        }
    },

    /**
     * @method :- notFound
     * @notFound : it is Default Response Not Found... 
     */
    notFound: (message = 'this is resource not found', response = [], status = 404, error = true, success = false) => {
        return {
            message,
            response,
            status,
            error,
            success
        }
    },

    /**
     * @method :- notFound
     * @notFound : it is Default Response Not Found... 
     */
    serveError: (message = 'internal server error.', response = [], status = 500, error = true, success = false) => {
        return {
            message,
            response,
            status,
            error,
            success
        }
    },

    /**
     * @method :- notFound
     * @notFound : it is Default Response Not Found... 
     */
    alreadyExist: (message = 'This Info already exists..', response = [], status = 422, error = true, success = false) => {
        return {
            message,
            response,
            status,
            error,
            success
        }
    },

    resourceAlreadyExist: (message = 'This Info already exists..', response = [], status = 409, error = true, success = false) => {
        return {
            message,
            response,
            status,
            error,
            success
        }
    }
}