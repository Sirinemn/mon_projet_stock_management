package fr.sirine.stock_management_back.exceptions.handler;

import fr.sirine.stock_management_back.exceptions.custom.*;
import fr.sirine.stock_management_back.exceptions.custom.IllegalStateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<ExceptionResponse> buildResponseEntity(BusinessErrorCodes errorCode, String message) {
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .errorCode(errorCode.getCode())
                                .message(message)
                                .httpStatus(errorCode.getHttpStatus().value())
                                .build()
                );
    }
    @ExceptionHandler(GroupAlreadyExistException.class)
    public ResponseEntity<ExceptionResponse> handleException(GroupAlreadyExistException exp) {
        logger.error("Group already exist", exp);
        return buildResponseEntity(BusinessErrorCodes.GROUP_ALREADY_EXIST, exp.getMessage());
    }
    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ExceptionResponse> handleException(EmailAlreadyUsedException exp) {
        logger.error("Email already used", exp);
        return buildResponseEntity(BusinessErrorCodes.EMAIL_ALREADY_USED, exp.getMessage());
    }
    @ExceptionHandler(EmailServiceException.class)
    public ResponseEntity<ExceptionResponse> handleException(EmailServiceException exp) {
        logger.error("Email service error", exp);
        return buildResponseEntity(BusinessErrorCodes.EMAIL_SERVICE_ERROR, exp.getMessage());
    }
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(CategoryNotFoundException exp) {
        logger.error("Category Not found", exp);
        return buildResponseEntity(BusinessErrorCodes.CATEGORY_NOT_FOUND, exp.getMessage());
    }
    @ExceptionHandler(CategoryAlreadyExistException.class)
    public ResponseEntity<ExceptionResponse> handleException(CategoryAlreadyExistException exp) {
        logger.error("Category already exist", exp);
        return buildResponseEntity(BusinessErrorCodes.CATEGORY_ALREADY_EXIST, exp.getMessage());
    }
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(ProductNotFoundException exp) {
        logger.error("Product Not found", exp);
        return buildResponseEntity(BusinessErrorCodes.PRODUCT_NOT_FOUND, exp.getMessage());
    }
    @ExceptionHandler(ProductAlreadyExistException.class)
    public ResponseEntity<ExceptionResponse> handleException(ProductAlreadyExistException exp) {
        logger.error("Product name already exist", exp);
        return buildResponseEntity(BusinessErrorCodes.PRODUCT_ALREADY_EXIST, exp.getMessage());
    }
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ExceptionResponse> handleException(InsufficientStockException exp) {
        logger.error("Insufficient stock", exp);
        return buildResponseEntity(BusinessErrorCodes.INSUFFICIENT_STOCK, exp.getMessage());
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleException() {
        logger.error("Bad credentials");
        return buildResponseEntity(BusinessErrorCodes.BAD_CREDENTIALS, "Login and / or Password is incorrect");
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException ex) {
        logger.error("Validation error", ex);
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));

        String errorMessage = errors.entrySet().stream()
                .map(entry -> entry.getKey() + ": " + entry.getValue())
                .collect(Collectors.joining(", "));
        return buildResponseEntity(BusinessErrorCodes.INVALID_REQUEST, errorMessage);
    }
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(UserNotFoundException exp) {
        logger.error("User not found", exp);
        return buildResponseEntity(BusinessErrorCodes.USER_NOT_FOUND, exp.getMessage());
    }
    @ExceptionHandler(JwtTokenExpiredException.class)
    public ResponseEntity<ExceptionResponse> handleException(JwtTokenExpiredException exp) {
        logger.error("JWT token expired", exp);
        return buildResponseEntity(BusinessErrorCodes.JWT_TOKEN_EXPIRED, exp.getMessage());
    }
    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ExceptionResponse> handleException(UnauthorizedActionException exp) {
        logger.error("Unauthorized action", exp);
        return buildResponseEntity(BusinessErrorCodes.UNAUTHORIZED_ACTION, exp.getMessage());
    }
    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(RoleNotFoundException exp) {
        logger.error("Role not found", exp);
        return buildResponseEntity(BusinessErrorCodes.ROLE_NOT_FOUND, exp.getMessage());
    }
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ExceptionResponse> handleException(InvalidPasswordException exp) {
        logger.error("Invalid password", exp);
        return buildResponseEntity(BusinessErrorCodes.INVALID_PASSWORD, exp.getMessage());
    }
    @ExceptionHandler(SamePasswordException.class)
    public ResponseEntity<ExceptionResponse> handleException(SamePasswordException exp) {
        logger.error("Same password", exp);
        return buildResponseEntity(BusinessErrorCodes.SAME_PASSWORD, exp.getMessage());
    }
    @ExceptionHandler(LinkExpiredException.class)
    public ResponseEntity<ExceptionResponse> handleException( LinkExpiredException exp) {
        logger.error("Link expired");
        return buildResponseEntity(BusinessErrorCodes.LINK_EXPIRED, exp.getMessage());
    }
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ExceptionResponse> handleException(IllegalStateException exp) {
        logger.error("Illegal state", exp);
        return buildResponseEntity(BusinessErrorCodes.ILLEGAL_STATE, exp.getMessage());
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleException(Exception exp) {
        logger.error("An unexpected error occurred", exp);
        return buildResponseEntity(BusinessErrorCodes.INTERNAL_SERVER_ERROR, "Internal error, please contact the admin");
    }
}
