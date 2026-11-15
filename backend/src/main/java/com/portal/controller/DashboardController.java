package com.portal.controller;
import com.portal.domain.*;
import com.portal.service.*;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/dashboard") @RequiredArgsConstructor
public class DashboardController {
  private final DashboardService service;
  @GetMapping public Map<String, Object> summary() { return service.summary(); }
}
