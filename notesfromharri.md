-----------Harri's Notes------
be in the client directory and can start the game + server with "npm start",

used localhost:3002

I used postgres for my database. the table was created using this script:

 CREATE TABLE game_results (
     id SERIAL PRIMARY KEY,
     player VARCHAR(1) NOT NULL,
     result VARCHAR(10) NOT NULL,
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 then to access the results just run: SELECT * FROM game_results;

IMPROVEMENTS:
If I had more time I would have liked to Dockerrise it but it works fine locally with the npm
start command. I feel this work gives a good representation of what I can do in a few hours. I would have loved to write some more unit tests to test the front end components also. 

My main gripe is my table design, it stores the player and result but currently both losers and winners share the same columns and it looks a bit messy in pg admin. 

Maybe a better schema like this could work: 

CREATE TABLE game_results (
    id SERIAL PRIMARY KEY,
    game_id UUID DEFAULT gen_random_uuid() NOT NULL,
    player1 VARCHAR(50) NOT NULL,
    player2 VARCHAR(50) NOT NULL,
    player1_result VARCHAR(10) NOT NULL,
    player2_result VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

I also did a small refactoring and moved some components out to make the main.tsx file less bloated.

the back end server followed a MVC style. I believe good code is self documenting so I haven't written
a huge amount of comments but am happy to answer any questions regarding everything!

Thanks for the test, it was super fun :) 