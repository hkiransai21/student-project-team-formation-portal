package com.portal.service;
import com.portal.exception.BusinessException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;

/** HTTP client for the separate matching microservice (service/API boundary - CO-5). */
@Component
public class MatchingClient {
  public record TeamInfo(Long teamId, String name, List<String> skills) { }
  public record MatchRequest(List<String> skills, List<TeamInfo> teams) { }
  public record Suggestion(Long teamId, String name, double score) { }

  private final RestTemplate rest = new RestTemplate();
  @Value("${matching.url}") private String url;

  public List<Suggestion> suggest(MatchRequest req) {
    try {
      Suggestion[] res = rest.postForObject(url + "/match/suggest", req, Suggestion[].class);
      return res == null ? List.of() : List.of(res);
    } catch (RestClientException e) { throw new BusinessException("Matching service is unavailable. Start it on " + url); }
  }
}
