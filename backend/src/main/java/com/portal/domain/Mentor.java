package com.portal.domain;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Mentor {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @NotBlank(message = "Name is required") private String name;
  private String department;
  @Min(value = 1, message = "Capacity must be at least 1") private int maxTeams = 3;
}
