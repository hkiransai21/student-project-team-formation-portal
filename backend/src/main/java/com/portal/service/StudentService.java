package com.portal.service;
import com.portal.domain.*;
import com.portal.exception.BusinessException;
import com.portal.repository.*;
import com.portal.service.MatchingClient.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class StudentService {
  private final StudentRepository students;
  private final TeamRepository teams;
  private final MatchingClient matching;

  static List<String> skills(String csv) {
    return Arrays.stream((csv == null ? "" : csv).split(",")).map(String::trim).filter(x -> !x.isEmpty()).toList();
  }
  public List<Student> list() { return students.findAll(); }
  public Student create(Student s) {
    if (students.existsByEmail(s.getEmail())) throw new BusinessException("Email already registered");
    s.setId(null); s.setTeam(null);
    return students.save(s);
  }

  /** Sends the student's skills and every open team's combined skills to the matching microservice. */
  public List<Suggestion> suggestions(Long id) {
    Student s = students.findById(id).orElseThrow(() -> new NoSuchElementException("Student " + id + " not found"));
    List<TeamInfo> open = new ArrayList<>();
    for (Team t : teams.findAll()) {
      List<Student> members = students.findByTeamId(t.getId());
      if (members.size() >= t.getMaxSize()) continue;
      List<String> teamSkills = members.stream().flatMap(m -> skills(m.getSkills()).stream()).distinct().toList();
      open.add(new TeamInfo(t.getId(), t.getName(), teamSkills));
    }
    return matching.suggest(new MatchRequest(skills(s.getSkills()), open));
  }
}
