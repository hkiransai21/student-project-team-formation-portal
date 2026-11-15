package com.portal.repository;
import com.portal.domain.Project;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface ProjectRepository extends JpaRepository<Project, Long> {
  @Query("select p from Project p where lower(p.title) like lower(concat('%', :q, '%')) and (:domain = '' or p.domain = :domain) order by p.id desc")
  List<Project> search(@Param("q") String q, @Param("domain") String domain);
  long countByMentorId(Long mentorId);
}
