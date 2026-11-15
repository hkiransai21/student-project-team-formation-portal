package com.portal.service;
import com.portal.repository.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class DashboardService {
  private final JdbcReportRepository report;
  private final ProjectRepository projects; private final TeamRepository teams;
  private final StudentRepository students; private final MentorRepository mentors;
  public Map<String, Object> summary() {
    Map<String, Object> out = new LinkedHashMap<>();
    out.put("totals", Map.of("projects", projects.count(), "teams", teams.count(), "students", students.count(), "mentors", mentors.count()));
    out.put("byDomain", report.domainCounts());
    out.put("projects", report.projectReport());
    return out;
  }
}
