# Fixing broken Elasticsearch implementation

# Overview

- Recently we got an opportunity to fix broken elasticsearch implementation in my organization. This blog post covers the
  challenges faced and how we overcome them.

# Challenges
- Application is built on heterogeneous technologies like Java, Python, NodeJS etc
- Each application logs in different formats
- Existing integration centraizes logs in elasticsearch but it is challenging to search logs
- Developers complain that stack traces are missing in elasticsearch

# Solution
- To fix the broken system, We defined a common log data model and format

## Log data model

- Do we need to have a data model for logs? I generally think only entities need a data model. But it is essential to
  have a data model for logs.
- Below is the log entity data model that we defined

| field      | value                                                          | explanation                                                                                                                                |
|------------|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| timestamp  | 2024-09-10T23:37:59.952Z                                       | log timestamp should be in UTC (Coordinated Universal Time) because it is not affected by time zones or Daylight Saving Time (DST) changes |
| level      | INFO                                                           | log level is used to categorize logs                                                                                                       |
| message    | User logged in                                                 | log message is a human-readable message                                                                                                    |
| service    | auth-service                                                   | service name is the name of the service that generated the log                                                                             |
| stacktrace | com.example.authservice.AuthService.login(AuthService.java:10) | stacktrace is the stack trace of the log message                                                                                           |
| thread     | main                                                           | thread is the name of the thread that generated the log message                                                                            |

- JSON representations of it
- ```json
  {
    "timestamp": "2024-09-10T23:37:59.952Z",
    "level": "INFO",
    "message": "User logged in",
    "service": "auth-service",
    "stacktrace": "com.example.authservice.AuthService.login(AuthService.java:10)",
    "thread": "main"
  }
  ```

## Log format

- All the applications should log messages in JSON format
- JSON log format is not human-readable, so we agreed applications log in JSON and Text formats

### Sample log message in text format by Java based application

- ```
  2024-09-10T23:37:59.952Z INFO [auth-service] [main] User logged in
  ```

### Sample log message in text format by Python based application

- ```
    2024-09-10T23:37:59.952Z INFO [auth-service] [main] User logged in
  ```

### Sample log message in text format by NodeJS based application

- ```
    2024-09-10T23:37:59.952Z INFO [auth-service] [main] User logged in
  ```
# Sample Application
# Prerequisites
```bash
set JAVA_HOME=C:\soft\OpenJDK22U-jdk_x64_windows_hotspot_22.0.2_9\jdk-22.0.2+9
set M2_HOME=C:\soft\apache-maven-3.9.9-bin\apache-maven-3.9.9
set PATH=%JAVA_HOME%\bin;%M2_HOME%\bin;%PATH%
```
# Run Java Application
```bash
cd C:\github\springboot-elk\javalogdemo
mvn spring-boot:run
```