package com.portal.repository;
import java.sql.*;
import java.util.*;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

/** Plain JDBC (Connection / Statement / ResultSet) for report queries with joins - CO-3 evidence. */
@Repository @RequiredArgsConstructor
public class JdbcReportRepository {
  private final DataSource dataSource;

  public List<Map<String, Object>> projectReport() {
    String sql = """
        SELECT p.title, p.domain, p.status, m.name AS mentor,
               (SELECT COUNT(*) FROM milestone x WHERE x.project_id = p.id) AS total,
               (SELECT COUNT(*) FROM milestone x WHERE x.project_id = p.id AND x.status = 'COMPLETED') AS done
        FROM project p LEFT JOIN mentor m ON p.mentor_id = m.id ORDER BY p.id""";
    List<Map<String, Object>> out = new ArrayList<>();
    try (Connection c = dataSource.getConnection(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(sql)) {
      while (rs.next()) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("title", rs.getString("title")); row.put("domain", rs.getString("domain"));
        row.put("status", rs.getString("status")); row.put("mentor", rs.getString("mentor"));
        row.put("milestones", rs.getInt("total")); row.put("done", rs.getInt("done"));
        out.add(row);
      }
    } catch (SQLException e) { throw new IllegalStateException("Report query failed", e); }
    return out;
  }

  public List<Map<String, Object>> domainCounts() {
    List<Map<String, Object>> out = new ArrayList<>();
    try (Connection c = dataSource.getConnection(); Statement st = c.createStatement();
         ResultSet rs = st.executeQuery("SELECT domain, COUNT(*) AS cnt FROM project GROUP BY domain ORDER BY cnt DESC")) {
      while (rs.next()) out.add(Map.of("domain", rs.getString("domain"), "count", rs.getInt("cnt")));
    } catch (SQLException e) { throw new IllegalStateException("Report query failed", e); }
    return out;
  }
}
