package com.portal.domain;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Project {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @NotBlank(message = "Title is required") @Size(min = 3, max = 120, message = "Title must be 3-120 characters") private String title;
  @Size(max = 1000, message = "Description is too long") private String description;
  @NotBlank(message = "Domain is required") private String domain;
  private String requiredSkills;
  private String status = "OPEN";
  @ManyToOne private Mentor mentor;
}
