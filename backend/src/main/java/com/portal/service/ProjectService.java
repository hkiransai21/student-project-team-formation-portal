package com.portal.service;
import com.portal.domain.*;
import com.portal.exception.BusinessException;
import com.portal.repository.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class ProjectService {
  private final ProjectRepository projects;
  private final MentorRepository mentors;
  private final MilestoneRepository milestones;

  public List<Project> search(String q, String domain) { return projects.search(q, domain); }
  public Project get(Long id) { return projects.findById(id).orElseThrow(() -> new NoSuchElementException("Project " + id + " not found")); }
  public Project create(Project p) { p.setId(null); p.setMentor(null); return projects.save(p); }

  public Project update(Long id, Project in) {
    Project p = get(id);
    p.setTitle(in.getTitle()); p.setDescription(in.getDescription()); p.setDomain(in.getDomain());
    p.setRequiredSkills(in.getRequiredSkills());
    if (in.getStatus() != null) p.setStatus(in.getStatus());
    return projects.save(p);
  }

  @Transactional
  public void delete(Long id) { Project p = get(id); milestones.deleteAll(milestones.findByProjectIdOrderByDueDate(id)); projects.delete(p); }

  /** Business rule: a mentor cannot supervise more projects than their capacity. */
  public Project assignMentor(Long projectId, Long mentorId) {
    Project p = get(projectId);
    Mentor m = mentors.findById(mentorId).orElseThrow(() -> new NoSuchElementException("Mentor " + mentorId + " not found"));
    boolean already = p.getMentor() != null && p.getMentor().getId().equals(mentorId);
    if (!already && projects.countByMentorId(mentorId) >= m.getMaxTeams())
      throw new BusinessException("Mentor " + m.getName() + " is already at capacity (" + m.getMaxTeams() + ")");
    p.setMentor(m);
    return projects.save(p);
  }
}
