package com.portal.controller;
import com.portal.domain.*;
import com.portal.service.*;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/projects") @RequiredArgsConstructor
public class ProjectController {
  private final ProjectService service;
  @GetMapping public List<Project> list(@RequestParam(defaultValue = "") String q, @RequestParam(defaultValue = "") String domain) { return service.search(q, domain); }
  @GetMapping("/{id}") public Project get(@PathVariable Long id) { return service.get(id); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public Project create(@Valid @RequestBody Project p) { return service.create(p); }
  @PutMapping("/{id}") public Project update(@PathVariable Long id, @Valid @RequestBody Project p) { return service.update(id, p); }
  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { service.delete(id); }
  @PutMapping("/{id}/mentor/{mentorId}") public Project assign(@PathVariable Long id, @PathVariable Long mentorId) { return service.assignMentor(id, mentorId); }
}
