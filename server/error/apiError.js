class ApiError extends Error {
    constructor(message, status ) {
        super(message);
        this.status = status;
    }
    static badRequest(message){
        return new ApiError(message, 404);
    }
    static internal(message){
        return new ApiError(message, 500);
    }
    static forbidden(message){
        return new ApiError(message, 403);
    }
}
module.exports = ApiError;