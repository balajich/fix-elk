# Fixing broken Elasticsearch implementation

# Overview

- Recently we got an opportunity to fix broken elasticsearch implementation in my organization. This blog post covers
  the
  challenges faced and how we overcome them.

# Challenges
- Application is built on heterogeneous technologies like Java, Python, NodeJS etc
- Each application logs in different formats
- Existing integration centralizes logs in elasticsearch but it is challenging to search logs
- Developers complain that stack traces are missing in elasticsearch

# Solution

- To fix the broken system, We defined a common log data model and format

## Log data model

- Do we need to have a data model for logs? We generally think only entities need a data model. But it is essential to
  have a data model for logs.
- Below is the log entity data model that we defined

| field      | value                                                          | explanation                                                                                                                                |
|------------|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| timestamp  | 2024-09-10T23:37:59.952Z                                       | log timestamp should be in UTC (Coordinated Universal Time) because it is not affected by time zones or Daylight Saving Time (DST) changes |
| level      | INFO                                                           | log level is used to categorize logs                                                                                                       |
| message    | User logged in                                                 | log message is a human-readable message                                                                                                    |
| service    | auth-service                                                   | Name of the service that generated the log                                                                                                 |
| stacktrace | com.example.authservice.AuthService.login(AuthService.java:10) | Stack trace of the log message                                                                                                             |                                                                          
| thread     | main                                                           | Name of the thread that generated the log message                                                                                          |

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

# Design considerations
- All the applications should log messages in JSON format
- JSON log format is not human-readable, so we agreed applications log in JSON and Text formats
- Thread field makes sense for java,python application but not for nodejs application as it is single-threaded and uses
  non-blocking I/O and the event loop.
- We decided to keep the thread field in the log data model for consistency across applications
- We decided to use the logback library for Java applications, python logging library for python applications, and
  winston library for nodejs applications
# Log message flow
- Applications log messages in JSON and Text formats
- filebeat reads the log files and publishes JSON message to elasticsearch index
- No logstash or pipeline is used in the log message flow because a log message is already in JSON format
- Kibana is used to search and visualize logs
# Key takeaways
- Define a common log data model and format
- Let producer applications log message in JSON format. It avoids logstash or pipeline and complex Grok patterns
# Sample Application 
- a small version of the application with Java, Python, NodeJS and ELK stack can be found in the below github repository
- source code https://github.com/balajich/fix-elk.git
# Prerequisites

```bash
set JAVA_HOME=C:\soft\OpenJDK22U-jdk_x64_windows_hotspot_22.0.2_9\jdk-22.0.2+9
set M2_HOME=C:\soft\apache-maven-3.9.9-bin\apache-maven-3.9.9
set PYTHONHOME=C:\soft\python-3.9.13
set NODE_HOME=C:\soft\node-v16.20.2-win-x64
set PATH=%PYTHONHOME%;%PYTHONHOME%\Scripts;%JAVA_HOME%\bin;%M2_HOME%\bin;%NODE_HOME%;%PATH%
```

# Run Java Application

```bash
cd C:\github\fix-elk\java-app
mvn spring-boot:run
```

# Run Python Application

```bash
cd C:\github\fix-elk\python-app
# need to run below commands only once
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
# run the application
python app.py
```

# Run NodeJS Application

```bash
cd C:\github\fix-elk\nodejs-app
npm install
npm start
```

# Access the application

- Java application- http://localhost:8080/helloworld
- Python application- http://localhost:5000/helloworld
- NodeJS application- http://localhost:3000/helloworld