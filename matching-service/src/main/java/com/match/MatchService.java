package com.match;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class MatchService {
  public record TeamInfo(Long teamId, String name, List<String> skills) { }
  public record MatchRequest(List<String> skills, List<TeamInfo> teams) { }
  public record Suggestion(Long teamId, String name, double score) { }

  private Set<String> norm(List<String> l) {
    return l == null ? Set.of() : l.stream().map(s -> s.trim().toLowerCase()).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
  }

  /** Ranks teams by Jaccard similarity between the student's skills and the team's skills. */
  public List<Suggestion> suggest(MatchRequest req) {
    Set<String> mine = norm(req.skills());
    if (req.teams() == null) return List.of();
    return req.teams().stream().map(t -> {
      Set<String> theirs = norm(t.skills());
      Set<String> union = new HashSet<>(mine); union.addAll(theirs);
      Set<String> both = new HashSet<>(mine); both.retainAll(theirs);
      double score = union.isEmpty() ? 0 : Math.round(100.0 * both.size() / union.size()) / 100.0;
      return new Suggestion(t.teamId(), t.name(), score);
    }).filter(s -> s.score() > 0).sorted(Comparator.comparingDouble(Suggestion::score).reversed()).limit(5).toList();
  }
}
