package com.portal.exception;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private ResponseEntity<Map<String, Object>> body(HttpStatus s, String k, Object v) { return ResponseEntity.status(s).body(Map.of(k, v)); }
  @ExceptionHandler(BusinessException.class) ResponseEntity<Map<String, Object>> biz(BusinessException e) { return body(HttpStatus.BAD_REQUEST, "error", e.getMessage()); }
  @ExceptionHandler(NoSuchElementException.class) ResponseEntity<Map<String, Object>> nf(NoSuchElementException e) { return body(HttpStatus.NOT_FOUND, "error", e.getMessage()); }
  @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<Map<String, Object>> dup(DataIntegrityViolationException e) { return body(HttpStatus.CONFLICT, "error", "Conflicts with existing data (duplicate value or linked records)"); }
  @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<Map<String, Object>> val(MethodArgumentNotValidException e) {
    Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
        .collect(Collectors.toMap(FieldError::getField, f -> String.valueOf(f.getDefaultMessage()), (a, b) -> a));
    return body(HttpStatus.BAD_REQUEST, "errors", errors);
  }
}
