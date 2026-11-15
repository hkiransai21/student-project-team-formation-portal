package com.portal.repository;
import com.portal.domain.Milestone;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
  List<Milestone> findByProjectIdOrderByDueDate(Long projectId);
}
