import {createSlice} from "@reduxjs/toolkit";
import data from "../data/data.json";

const boardsSlice = createSlice({
    name: "boards",
    initialState: data.boards,
    reducers: {
        addBoard: (state, action) => {
            const isActive = state.length > 0 ? false : true;
            const payload = action.payload;
            const board = {
                name: payload.name,
                isActive,
                columns: [],
            };
            board.columns = payload.newColumns;
            state.push(board);
        },
        editBoard: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive);
            board.name = payload.name;
            board.columns = payload.newColumns;
        },
        deleteBoard: (state) => {
            const board = state.find((board) => board.isActive);
            state.splice(state.indexOf(board), 1);
        },
        setBoardActive: (state, action) => {
            state.map((board, index) => {
                index === action.payload.index
                    ? (board.isActive = true)
                    : (board.isActive = false);
                return board;
            });
        },
        addTask: (state, action) => {
            const {title, status, description, subtasks, newColIndex} =
                action.payload;
            const task = {title, description, subtasks, status};
            const board = state.find((board) => board.isActive);
            const column = board.columns.find((col, index) => index === newColIndex);
            column.tasks.push(task);
        },
        editTask: (state, action) => {
            const {
                title,
                status,
                description,
                subtasks,
                prevColIndex,
                newColIndex,
                taskIndex,
            } = action.payload;
            const board = state.find((board) => board.isActive);
            const column = board.columns.find((col, index) => index === prevColIndex);
            const task = column.tasks.find((task, index) => index === taskIndex);
            task.title = title;
            task.status = status;
            task.description = description;
            task.subtasks = subtasks;
            if (prevColIndex === newColIndex) return;
            column.tasks = column.tasks.filter((task, index) => index !== taskIndex);
            const newCol = board.columns.find((col, index) => index === newColIndex);
            newCol.tasks.push(task);
        },
        //FOR DRAGGING BETWEEN DIFFERENT COLUMN
        dragTask: (state, action) => {
            const {colIndex, prevColIndex, taskIndex,newPosition} = action.payload;
            const board = state.find((board) => board.isActive);
            const prevCol = board.columns.find((col, i) => i === prevColIndex);
            const task = prevCol.tasks.splice(taskIndex, 1)[0];
            /*Цей рядок коду виконує наступні дії:
            1)prevCol.tasks - це масив колонки, який містить завдання.
            2).splice(draggedTaskIndex, 1) - метод splice видаляє елементи з масиву. В даному випадку, він видаляє один
             елемент з масиву prevCol.tasks, починаючи з індексу draggable taskIndex. Однак метод splice повертає масив
              видалених елементів, тому ми видаляємо тільки один елемент, а не масив.
            3)[0] - після виконання методу splice, ми отримуємо масив з видаленими елементами (в даному випадку, масив
            з одним елементом). Зараз ми вибираємо перший (і єдиний) елемент з цього масиву, і це значення присвоюється
             змінній draggable task.
            Тобто, цей рядок коду видаляє 1(це другий аргумент ф-ї) елемент з масиву prevCol.tasks за індексом draggable taskIndex і повертає
             його значення, яке потім зберігається у змінній draggable task. Це корисно, коли ви хочете зберегти видалений
              елемент для подальшого використання, наприклад, для переміщення його на іншу позицію, як у випадку з
              реалізацією методу drag and drop.*/

            //Додає переміщене завдання в кінець колонки:
            // board.columns.find((col, i) => i === colIndex).tasks.push(task);

            //Додає в потрібне місце
            const newCol = board.columns.find((col, i) => i === colIndex);
            // Видаляє 0 елементів по індексу newPosition і вставляє task:
            newCol.tasks.splice(newPosition, 0, task);//Тобто: Додає переміщене завдання в нову колонку на потрібне місце:
        },
        //FOR DRAGGING IN ONE COLUMN
  /*      dragTaskInColumn: (state, action) => {
            const { colIndex, prevColIndex, taskIndex } = action.payload;
            const board = state.find((board) => board.isActive);
            const column = board.columns.find((col, i) => i === colIndex);
            const task = column.tasks[taskIndex];

            // Видаліть завдання з попереднього стовпця
            const prevColumn = board.columns.find((col, i) => i === prevColIndex);
            prevColumn.tasks.splice(taskIndex, 1);

            // Додайте завдання в новий стовпець
            column.tasks.push(task);
        },
*/
        dragTaskInColumn: (state, action) => {
            const { colIndex, prevColIndex, taskIndex, newPosition } = action.payload;
            const board = state.find((board) => board.isActive);
            const column = board.columns.find((col, i) => i === colIndex);
            const task = column.tasks[taskIndex];

            // Перевіряє чи завдання в тому ж стовпці в бере завдання
            const prevColumn = board.columns.find((col, i) => i === prevColIndex);
            prevColumn.tasks.splice(taskIndex, 1);

            // Видаляє 0 елементів по індексу newPosition і вставляє task
            // Тобто: Додає завдання в новий стовпець на вказану позицію
            column.tasks.splice(newPosition, 0, task);
        },


        setSubtaskCompleted: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive);
            const col = board.columns.find((col, i) => i === payload.colIndex);
            const task = col.tasks.find((task, i) => i === payload.taskIndex);
            const subtask = task.subtasks.find((subtask, i) => i === payload.index);
            subtask.isCompleted = !subtask.isCompleted;
        },
        setTaskStatus: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive);
            const columns = board.columns;
            const col = columns.find((col, i) => i === payload.colIndex);
            if (payload.colIndex === payload.newColIndex) return;
            const task = col.tasks.find((task, i) => i === payload.taskIndex);
            task.status = payload.status;
            col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
            const newCol = columns.find((col, i) => i === payload.newColIndex);
            newCol.tasks.push(task);
        },
        deleteTask: (state, action) => {
            const payload = action.payload;
            const board = state.find((board) => board.isActive);
            const col = board.columns.find((col, i) => i === payload.colIndex);
            col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
        },
    },
});

export default boardsSlice;