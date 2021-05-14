CREATE TABLE IF NOT EXISTS TASK (
    ID VARCHAR NOT NULL DEFAULT uuid_string(),

    TITLE VARCHAR NOT NULL,
    STATUS BOOLEAN NOT NULL DEFAULT FALSE,

    CREATED_AT TIMESTAMP DEFAULT current_timestamp(),
);

CREATE OR REPLACE PROCEDURE create_todo(TITLE VARCHAR)
    returns VARIANT NOT NULL
    language javascript
    as
    $$
        if (TITLE.length > 100) {
            return {
                "success": false,
                "error": {
                    "message": "TITLE must be less than or equal to 100 characters",
                    "code": 400
                }
            }
        }

        const generateUUID = function() {
            const res = snowflake.execute({
                sqlText: "SELECT uuid_string();",
                binds: []
            });

            res.next();

            return res.getColumnValue(1);
        }
        
        const insertTask = (id) => {
            const query = `INSERT INTO TODO(ID, TITLE) VALUES(:1, :2);`;

            snowflake.execute({
                sqlText: query,
                binds: [id, TITLE]
            });
        }

        try {
            const id = generateUUID();
            insertTask(id);

            return {
                "success": true,
                "data": {
                    id
                }
            }
        } catch (e) {
            return {
                "success": false,
                "error": {
                    "message": `${e}`,
                    "code": 500
                }
            }
        }
    $$
    ;

CREATE OR REPLACE PROCEDURE get_todo_by_id(TODO_ID VARCHAR)
    returns VARIANT NOT NULL
    language javascript
    as
    $$
        const getTodoById = function() {
            const query = `
                SELECT * FROM TODO WHERE ID = :1;
            `;

            const getTodoByIdResponse = snowflake.execute({
                sqlText: query,
                binds: [TODO_ID]
            });

            if (!getTodoByIdResponse.getRowCount()) {
                return null;
            }

            let todo = {};

            while(getTodoByIdResponse.next()) {
                todo = {
                    id: getTodoByIdResponse.getColumnValue('ID'),
                    title: getTodoByIdResponse.getColumnValue('TITLE'),
                    status: getTodoByIdResponse.getColumnValue('STATUS'),
                    createdAt: getTodoByIdResponse.getColumnValue('CREATED_AT')
                };
            }

            return todo;
        }

        try {
            const todo = getTodoById();

            if (!todo) {
                return {
                    "success": false,
                    "error": {
                        "message": `Cannot find todo with ID: ${TODO_ID}`,
                        "code": 404
                    }
                }
            }

            return {
                "success": true,
                "data": todo
            }
        } catch (e) {
            return {
                "success": false,
                "error": {
                    "message": `${e}`,
                    "code": 500
                }
            }
        }
    $$
    ;

CREATE OR REPLACE PROCEDURE get_todos()
    returns VARIANT NOT NULL
    language javascript
    as
    $$
        const getTodos = function() {
            const sqlText = `
                SELECT * FROM TODO`;

            const getTodosResponse = snowflake.execute({sqlText});

            const todos = [];

            while (getTodosResponse.next()) {
                todos.push({
                    id: getTodosResponse.getColumnValue('ID'),
                    title: getTodosResponse.getColumnValue('TITLE'),
                    status: getTodosResponse.getColumnValue('STATUS'),
                    createdAt: getTodosResponse.getColumnValue('CREATED_AT')
                });
            }

            return todos;
        }

        try {
            return {
                "success": true,
                "data": getTodos()
            }
        } catch (e) {
            return {
                "success": false,
                "error": {
                    "message": `${e}`,
                    "code": 500
                }
            }
        }
    $$
    ;