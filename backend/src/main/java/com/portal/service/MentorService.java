package com.portal.service;
import com.portal.domain.Mentor;
import com.portal.repository.MentorRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class MentorService {
  private final MentorRepository mentors;
  public List<Mentor> list() { return mentors.findAll(); }
  public Mentor create(Mentor m) { m.setId(null); return mentors.save(m); }
}
