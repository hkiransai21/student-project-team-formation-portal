package com.portal.controller;
import com.portal.domain.*;
import com.portal.service.*;
import jakarta.validation.Valid;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/mentors") @RequiredArgsConstructor
public class MentorController {
  private final MentorService service;
  @GetMapping public List<Mentor> list() { return service.list(); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public Mentor create(@Valid @RequestBody Mentor m) { return service.create(m); }
}
