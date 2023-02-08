### What is this repository for? ###

This repository has python code for generating the sepsis scores.

### Files ###

- end_to_end_prediction.py - For geerating the score for the full model.
- end_to_end_prediction_asha - For generating the score for the ASHA model.

### Prep ###

- Please ensure that the database tables are created, for that kindly run **Prep/Make_Tables.sql** SQL.
- Please ensure that the database credentials are given in the python code. The varibales DB_HOST, DB_PORT, DB_PASSWORD are to be set.