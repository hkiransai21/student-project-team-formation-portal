package com.portal;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import com.portal.domain.*;
import com.portal.exception.BusinessException;
import com.portal.repository.*;
import com.portal.service.ProjectService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
  @Mock ProjectRepository projects; @Mock MentorRepository mentors; @Mock MilestoneRepository milestones;
  @InjectMocks ProjectService service;

  @Test void mentorAtCapacityCannotTakeAnotherProject() {
    Mentor m = new Mentor(); m.setId(1L); m.setName("Dr. Meena"); m.setMaxTeams(1);
    Project p = new Project(); p.setId(10L);
    when(projects.findById(10L)).thenReturn(Optional.of(p));
    when(mentors.findById(1L)).thenReturn(Optional.of(m));
    when(projects.countByMentorId(1L)).thenReturn(1L);
    assertThrows(BusinessException.class, () -> service.assignMentor(10L, 1L));
  }
}
