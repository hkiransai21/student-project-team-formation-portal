package com.portal;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.portal.controller.ProjectController;
import com.portal.service.ProjectService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {
  @Autowired MockMvc mvc;
  @MockBean ProjectService service;

  @Test void listReturnsOk() throws Exception {
    when(service.search("", "")).thenReturn(List.of());
    mvc.perform(get("/api/projects")).andExpect(status().isOk()).andExpect(content().json("[]"));
  }

  @Test void invalidProjectReturnsFieldErrors() throws Exception {
    mvc.perform(post("/api/projects").contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"\",\"domain\":\"\"}"))
       .andExpect(status().isBadRequest()).andExpect(jsonPath("$.errors.title").exists()).andExpect(jsonPath("$.errors.domain").exists());
  }
}
