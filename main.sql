LOAD DATA INFILE 'movies_mock.csv'
INTO TABLE my_table
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
SELECT * FROM my_table;
SELECT column1, column2 FROM my_table WHERE column2 > 50;
