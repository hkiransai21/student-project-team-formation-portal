package com.portal.service;
import com.portal.domain.*;
import com.portal.exception.BusinessException;
import com.portal.repository.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class TeamService {
  private final TeamRepository teams;
  private final StudentRepository students;
  private final ProjectRepository projects;

  private Team count(Team t) { t.setMemberCount((int) students.countByTeamId(t.getId())); return t; }
  public Team get(Long id) { return teams.findById(id).orElseThrow(() -> new NoSuchElementException("Team " + id + " not found")); }
  public List<Team> list() { List<Team> all = teams.findAll(); all.forEach(this::count); return all; }
  public List<Student> members(Long id) { get(id); return students.findByTeamId(id); }

  public Team create(Team t) {
    t.setId(null);
    Long pid = t.getProject() == null ? null : t.getProject().getId();
    t.setProject(pid == null ? null : projects.findById(pid).orElseThrow(() -> new NoSuchElementException("Project " + pid + " not found")));
    return count(teams.save(t));
  }

  /** Business rules: one team per student, and a team cannot exceed its maximum size. */
  public Student join(Long teamId, Long studentId) {
    Team t = get(teamId);
    Student s = students.findById(studentId).orElseThrow(() -> new NoSuchElementException("Student " + studentId + " not found"));
    if (s.getTeam() != null) throw new BusinessException(s.getName() + " is already in a team");
    if (students.countByTeamId(teamId) >= t.getMaxSize()) throw new BusinessException("Team " + t.getName() + " is full");
    s.setTeam(t);
    return students.save(s);
  }

  @Transactional
  public void delete(Long id) { Team t = get(id); students.findByTeamId(id).forEach(s -> s.setTeam(null)); teams.delete(t); }
}
