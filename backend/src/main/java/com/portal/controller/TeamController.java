package com.portal.controller;
import com.portal.domain.*;
import com.portal.service.*;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/teams") @RequiredArgsConstructor
public class TeamController {
  private final TeamService service;
  @GetMapping public List<Team> list() { return service.list(); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public Team create(@Valid @RequestBody Team t) { return service.create(t); }
  @GetMapping("/{id}/members") public List<Student> members(@PathVariable Long id) { return service.members(id); }
  @PostMapping("/{id}/join/{studentId}") public Student join(@PathVariable Long id, @PathVariable Long studentId) { return service.join(id, studentId); }
  @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { service.delete(id); }
}
