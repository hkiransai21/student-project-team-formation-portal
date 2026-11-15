package com.portal.controller;
import com.portal.domain.*;
import com.portal.service.*;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/students") @RequiredArgsConstructor
public class StudentController {
  private final StudentService service;
  @GetMapping public List<Student> list() { return service.list(); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public Student create(@Valid @RequestBody Student s) { return service.create(s); }
  @GetMapping("/{id}/suggestions") public List<MatchingClient.Suggestion> suggestions(@PathVariable Long id) { return service.suggestions(id); }
}
