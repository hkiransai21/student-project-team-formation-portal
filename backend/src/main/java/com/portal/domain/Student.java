package com.portal.domain;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
public class Student {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @NotBlank(message = "Name is required") private String name;
  @NotBlank(message = "Email is required") @Email(message = "Enter a valid email") @Column(unique = true) private String email;
  private String skills;
  @ManyToOne private Team team;
}
