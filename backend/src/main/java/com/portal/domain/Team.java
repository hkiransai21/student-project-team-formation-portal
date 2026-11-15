package com.portal.domain;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Team {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @NotBlank(message = "Team name is required") private String name;
  @Min(value = 2, message = "Team size must be 2-6") @Max(value = 6, message = "Team size must be 2-6") private int maxSize = 4;
  @ManyToOne private Project project;
  @Transient private int memberCount;
}
