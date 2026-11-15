package com.portal.repository;
import com.portal.domain.Student;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StudentRepository extends JpaRepository<Student, Long> {
  long countByTeamId(Long teamId);
  List<Student> findByTeamId(Long teamId);
  boolean existsByEmail(String email);
}
