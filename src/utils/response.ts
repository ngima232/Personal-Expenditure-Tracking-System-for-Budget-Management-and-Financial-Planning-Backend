import { Response } from 'express';
import { HttpStatusEnum } from '../enums';
import { PaginationMetadata } from '../interfaces'

const successResponseData = ({
    data,
    metadata,
    message = '',
    res,
    statusCode = HttpStatusEnum.OK
}: {
    data?: Object | Object[] | null;
    metadata?: PaginationMetadata;
    message?: string;
    res: Response;
    statusCode?: HttpStatusEnum;
}) => {
    res.status(statusCode).json({
        success: true,
        message,
        statusCode,
        ...(data && { data }),
        ...(metadata && { metadata })
    });
};

const errorResponse = ({ errorMessage = 'Internal Server Error', res, statusCode = HttpStatusEnum.INTERNAL_SERVER_ERROR }: { errorMessage?: any, res: Response, statusCode?: HttpStatusEnum }) => {
    res.status(statusCode).json({
        success: false,
        error: {
            message: errorMessage.message,
            statusCode,
        },
    });
}

export { successResponseData, errorResponse }