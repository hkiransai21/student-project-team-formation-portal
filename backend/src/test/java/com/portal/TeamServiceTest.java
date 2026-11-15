package com.portal;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import com.portal.domain.*;
import com.portal.exception.BusinessException;
import com.portal.repository.*;
import com.portal.service.TeamService;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {
  @Mock TeamRepository teams; @Mock StudentRepository students; @Mock ProjectRepository projects;
  @InjectMocks TeamService service;
  Team team; Student student;

  @BeforeEach void setUp() {
    team = new Team(); team.setId(1L); team.setName("Alpha"); team.setMaxSize(2);
    student = new Student(); student.setId(5L); student.setName("Asha");
  }

  @Test void joinFullTeamIsRejected() {
    when(teams.findById(1L)).thenReturn(Optional.of(team));
    when(students.findById(5L)).thenReturn(Optional.of(student));
    when(students.countByTeamId(1L)).thenReturn(2L);
    assertThrows(BusinessException.class, () -> service.join(1L, 5L));
  }

  @Test void studentAlreadyInATeamIsRejected() {
    student.setTeam(new Team());
    when(teams.findById(1L)).thenReturn(Optional.of(team));
    when(students.findById(5L)).thenReturn(Optional.of(student));
    assertThrows(BusinessException.class, () -> service.join(1L, 5L));
  }

  @Test void joinWithFreeSlotSucceeds() {
    when(teams.findById(1L)).thenReturn(Optional.of(team));
    when(students.findById(5L)).thenReturn(Optional.of(student));
    when(students.countByTeamId(1L)).thenReturn(1L);
    when(students.save(any(Student.class))).thenAnswer(i -> i.getArgument(0));
    assertSame(team, service.join(1L, 5L).getTeam());
  }
}
