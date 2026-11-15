package com.portal.controller;
import com.portal.domain.*;
import com.portal.service.*;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/milestones") @RequiredArgsConstructor
public class MilestoneController {
  private final MilestoneService service;
  @GetMapping public List<Milestone> list(@RequestParam Long projectId) { return service.forProject(projectId); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public Milestone create(@Valid @RequestBody Milestone m) { return service.create(m); }
  @PutMapping("/{id}") public Milestone update(@PathVariable Long id, @Valid @RequestBody Milestone m) { return service.update(id, m); }
  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { service.delete(id); }
}
