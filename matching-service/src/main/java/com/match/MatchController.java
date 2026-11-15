package com.match;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController
public class MatchController {
  private final MatchService service;
  public MatchController(MatchService service) { this.service = service; }
  @PostMapping("/match/suggest") public List<MatchService.Suggestion> suggest(@RequestBody MatchService.MatchRequest req) { return service.suggest(req); }
  @GetMapping("/health") public String health() { return "UP"; }
}
