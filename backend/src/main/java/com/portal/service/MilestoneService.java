package com.portal.service;
import com.portal.domain.*;
import com.portal.exception.BusinessException;
import com.portal.repository.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class MilestoneService {
  private final MilestoneRepository milestones;
  private final ProjectRepository projects;
  private Milestone get(Long id) { return milestones.findById(id).orElseThrow(() -> new NoSuchElementException("Milestone " + id + " not found")); }
  public List<Milestone> forProject(Long projectId) { return milestones.findByProjectIdOrderByDueDate(projectId); }
  public Milestone create(Milestone m) {
    if (m.getProject() == null || m.getProject().getId() == null) throw new BusinessException("Project is required");
    Long pid = m.getProject().getId();
    m.setProject(projects.findById(pid).orElseThrow(() -> new NoSuchElementException("Project " + pid + " not found")));
    m.setId(null);
    return milestones.save(m);
  }
  public Milestone update(Long id, Milestone in) {
    Milestone m = get(id); m.setTitle(in.getTitle()); m.setDueDate(in.getDueDate()); m.setStatus(in.getStatus());
    return milestones.save(m);
  }
  public void delete(Long id) { milestones.delete(get(id)); }
}
