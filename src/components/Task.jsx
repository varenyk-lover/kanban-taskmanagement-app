import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TaskModal from "../modals/TaskModal";
import boardsSlice from "../redux/boardsSlice";

const Task = ({colIndex, taskIndex}) => {

    const dispatch = useDispatch();
    const boards = useSelector((state) => state.boards);
    const board = boards.find((board) => board.isActive === true);
    const columns = board.columns;
    const col = columns.find((col, i) => i === colIndex);
    const task = col.tasks.find((task, i) => i === taskIndex);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);


    let completed = 0;
    let subtasks =  task.subtasks;
    // let subtasks = task && task.subtasks ? task.subtasks : []; // Перевірка на наявність 'subtasks'
    subtasks.forEach((subtask) => {
        if (subtask.isCompleted) {
            completed++;
        }
    });

/*
    const handleOnDrag = (e) => {
        e.dataTransfer.setData(
            "text",
            JSON.stringify({ taskIndex, prevColIndex: colIndex })
        );
    };
*/


    //FOR DRAGGING IN ONE COLUMN
    const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

    //For start index on drag
    const handleOnDragStart = (e) => {
        setDraggedTaskIndex(taskIndex);
        e.dataTransfer.setData(
            "text",
            JSON.stringify({ taskIndex, prevColIndex: colIndex })
        );
    };

    const handleOnDragOver = (e) => {
        e.preventDefault();
    };


/*
    const handleOnDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text"));

        if (data.prevColIndex === colIndex && data.taskIndex !== taskIndex) {
            // IN ONE COLUMN
            dispatch(
                boardsSlice.actions.dragTaskInColumn({
                    colIndex,
                    prevColIndex: data.prevColIndex,
                    taskIndex: data.taskIndex,
                })
            );
        }
    };
*/

    //After drag, when we release the mouse cursor and drop task card
    const handleOnDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text'));

        if (data.prevColIndex === colIndex && data.taskIndex !== taskIndex) {
            // Визначаємо, на яку позицію вставляємо завдання
            const position = taskIndex > data.taskIndex ? taskIndex : taskIndex + 1;

            // Виконуємо операцію переміщення завдання всередині одного стовпця
            dispatch(
                boardsSlice.actions.dragTaskInColumn({
                    colIndex,
                    prevColIndex: data.prevColIndex,
                    taskIndex: data.taskIndex,
                    newPosition: position,
                })
            );
        }


    };


    return (
        <div>
            <div
                onClick={() => {
                    setIsTaskModalOpen(true);
                }}
                draggable
                // onDragStart={handleOnDrag}
                onDragStart={handleOnDragStart}
                onDragOver={handleOnDragOver}
                onDrop={handleOnDrop}
                className=" w-[280px] first:my-5 rounded-lg  bg-white  dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#635fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer "
            >
                <p className=" font-bold tracking-wide ">{task.title}</p>
                <p className=" font-bold text-xs tracking-tighter mt-2 text-gray-500">
                    {completed} of {subtasks.length} completed subtasks
                </p>
            </div>
            {isTaskModalOpen && (
                <TaskModal
                    colIndex={colIndex}
                    taskIndex={taskIndex}
                    setIsTaskModalOpen={setIsTaskModalOpen}
                />
            )}
        </div>
    );
}

export default Task;