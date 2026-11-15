package com.match;
import static org.junit.jupiter.api.Assertions.*;
import com.match.MatchService.*;
import java.util.List;
import org.junit.jupiter.api.Test;
class MatchServiceTest {
  MatchService service = new MatchService();
  @Test void ranksBestOverlapFirstAndDropsZeroScores() {
    var req = new MatchRequest(List.of("React", "Java"), List.of(
        new TeamInfo(1L, "A", List.of("python")), new TeamInfo(2L, "B", List.of("react", "java", "sql")), new TeamInfo(3L, "C", List.of("Java"))));
    List<Suggestion> out = service.suggest(req);
    assertEquals(2, out.size());
    assertEquals(2L, out.get(0).teamId());
    assertTrue(out.get(0).score() > out.get(1).score());
  }
}
