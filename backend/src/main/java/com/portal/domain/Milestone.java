package com.portal.domain;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Milestone {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @NotBlank(message = "Title is required") private String title;
  private LocalDate dueDate;
  @Pattern(regexp = "PENDING|IN_PROGRESS|COMPLETED", message = "Status must be PENDING, IN_PROGRESS or COMPLETED") private String status = "PENDING";
  @ManyToOne private Project project;
}
