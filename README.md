# Student Project and Team Formation Portal

21CSE354T Full Stack Web Development - Task 4. Students post project ideas, form teams, get mentors allocated and track milestones.
Team: Deeraneeshwaran, Kiransai, Viswakk, Ashwin, Gurpreet, Suyash.

| Part | Tech | Port |
|---|---|---|
| `frontend/` | React 18 + Vite, React Router, hooks | 5173 |
| `backend/` | Spring Boot 3.3, Spring Data JPA, JDBC, Bean Validation | 8080 |
| `matching-service/` | Separate Spring Boot microservice (team suggestions) | 8081 |
| `database/` | MySQL `schema.sql` + synthetic `seed.sql` | 3306 |

## Prerequisites
Java 17+, Maven 3.9+, Node 18+. MySQL 8 is optional: without it the backend uses in-memory H2 with the seed data loaded automatically.

## Run locally (3 terminals, no database setup needed)
```bash
cd matching-service && mvn spring-boot:run      # http://localhost:8081
cd backend          && mvn spring-boot:run      # http://localhost:8080
cd frontend         && npm install && npm run dev   # http://localhost:5173
```
The matching service is only needed for the "Suggested teams" feature; the rest works without it.

## Use MySQL instead of H2
```bash
mysql -u root -p < database/schema.sql && mysql -u root -p portal < database/seed.sql   # or: docker compose up -d
export DB_URL=jdbc:mysql://localhost:3306/portal DB_USER=root DB_PASSWORD=<your password> SEED_MODE=never
cd backend && mvn spring-boot:run
```

## Environment variables (never commit real values)
| Variable | Used by | Default |
|---|---|---|
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | backend | in-memory H2 |
| `SEED_MODE` | backend | `embedded` (seed H2 only). Use `never` for MySQL |
| `MATCHING_URL` | backend | `http://localhost:8081` |
| `CORS_ORIGINS` | backend | `http://localhost:5173` |
| `VITE_API_URL` | frontend (build time) | `/api` (dev proxy) |

## Build and deploy
```bash
cd backend && mvn clean package && java -jar target/portal-backend-1.0.0.jar
cd matching-service && mvn clean package && java -jar target/matching-service-1.0.0.jar
cd frontend && VITE_API_URL=https://<backend-host>/api npm run build     # upload dist/
```
Suggested hosting: frontend on Vercel/Netlify, backend + matching service on Render/Railway, managed MySQL. Set the variables above in the host's dashboard and set `CORS_ORIGINS` to the frontend URL.

## Tests
```bash
cd backend && mvn test            # TeamServiceTest, ProjectServiceTest (business rules), ProjectControllerTest (MockMvc API path)
cd matching-service && mvn test   # MatchServiceTest
```
| Rule / path | Expected |
|---|---|
| Join a full team | 400 "Team ... is full" |
| Student already in a team joins another | 400 "... is already in a team" |
| Mentor at capacity gets another project | 400 "... is already at capacity" |
| POST /api/projects with empty title/domain | 400 with per-field `errors` |
| Duplicate student email | 400 "Email already registered" |

## API (JSON)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/projects?q=&domain=` | Search / filter projects |
| POST | `/api/projects` | Create project. Body `{"title":"Smart Attendance","domain":"AI","requiredSkills":"Python","description":"..."}` -> 201 |
| GET / PUT / DELETE | `/api/projects/{id}` | Read, update, delete (also deletes its milestones) |
| PUT | `/api/projects/{id}/mentor/{mentorId}` | Allocate mentor (capacity rule) |
| GET / POST | `/api/mentors` | List / create mentors |
| GET / POST | `/api/teams` | List (with `memberCount`) / create. Body `{"name":"Delta","maxSize":4,"project":{"id":1}}` |
| POST | `/api/teams/{id}/join/{studentId}` | Join team (size + duplicate rules) |
| GET / DELETE | `/api/teams/{id}/members`, `/api/teams/{id}` | Members, delete team |
| GET / POST | `/api/students` | List / register |
| GET | `/api/students/{id}/suggestions` | Calls the matching microservice |
| GET / POST | `/api/milestones?projectId=` | List / create. Body `{"title":"Wireframes","dueDate":"2026-12-01","project":{"id":2}}` |
| PUT / DELETE | `/api/milestones/{id}` | Update status (`PENDING`, `IN_PROGRESS`, `COMPLETED`) / delete |
| GET | `/api/dashboard` | Totals, projects per domain, progress (plain JDBC joins) |

Error format: `{"error":"message"}` or `{"errors":{"field":"message"}}`.

**Matching microservice** - `POST http://localhost:8081/match/suggest`
```json
{"skills":["React","Java"],"teams":[{"teamId":4,"name":"Beta","skills":["react","sql"]}]}
```
returns `[{"teamId":4,"name":"Beta","score":0.33}]` (Jaccard similarity of skills, best first). Health check: `GET /health`.

## Course outcome evidence
| CO | Where |
|---|---|
| CO-1 | `frontend/src/styles.css`, semantic forms/tables, responsive grid |
| CO-2 | `frontend/src/` components, React Router, `useState`/`useEffect`/custom `useFetch`, client validation |
| CO-3 | `database/schema.sql`, `seed.sql`, `JdbcReportRepository` (Connection/Statement/ResultSet, joins, subqueries), CRUD |
| CO-4 | `backend/` controller -> service -> domain/repository layers, auto-configuration, JUnit/Mockito/MockMvc tests |
| CO-5 | JPA entities and repositories, separate `matching-service` called by `MatchingClient` and shown in the UI |

## Not included
No login/authentication (roles are not enforced), no Dockerfiles, no wireframe images. Use only synthetic data in public demos.
