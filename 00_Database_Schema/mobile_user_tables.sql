CREATE TABLE m_users_additional_info (
    user_id int not null primary key,
    user_type_id int,
    profession varchar(255),
    institution_name varchar(255),
    institution_type varchar(255),
    state varchar(255)
);

// a table to store report names
CREATE TABLE IF NOT EXISTS reports (
    id INT NOT NULL AUTO_INCREMENT,
    study_id INT,
    report_type INT,
    report_name VARCHAR(255),
    PRIMARY KEY (id)
);