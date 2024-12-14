exports.successResponse = (res, message, data, status) => {
    res.status(status || 200).send({
        status: true,
        message: message || "Successful",  
        data: data || null
    });
};

exports.failedResponse = (res, message, data, status) => {
    res.status(status || 400).send({
        status: false,
        message: message || "Bad request",
        data: data || null
    });
};

exports.errorResponse = (res, message, data, status) => {
    res.status(status || 500).send({
        status: false,
        message: message || "Internal server error",
        data:  data  || null
    });
};
