# Plogger v0.0.1

### About the program
This program is used to collect logs through an API interface and showcase the collected data to 3 different types of users - admins, developers and clients.

### Usage example
A CI/CD pipeline in your app collects and sends logs to this program, which stores the successful/unsuccesful logs and allows users to see the results.

Also funtions as a vault for old logs to see what had happened in the past.

### Program components
This program has 3 main objects:
* Entry (the output of a single pipeline step)
* Log (contains entries from a single pipeline run)
* Pipeline (Info about the pipeline and the logs it contains)

This program also has a simple web UI - it features only a home page for all the different types of users.

### Used technologies

This project has three parts:
1. Frontend which used React and typescript
2. Backend which uses dotnet c#
3. PostgreSQL database