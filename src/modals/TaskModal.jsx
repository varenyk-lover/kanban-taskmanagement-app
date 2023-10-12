import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import elipsis from '../assets/icon-vertical-ellipsis.svg';
import ElipsisMenu from "../components/ElipsisMenu";

const TaskModal = ({colIndex, taskIndex, setIsTaskModalOpen}) => {
    const dispatch = useDispatch();

    const boards = useSelector((state) => state.boards);
    const board = boards.find((board) => board.isActive === true);
    const columns = board.columns;
    const col = columns.find((col, i) => i === colIndex);
    const task = col.tasks.find((task, i) => i === taskIndex);
    const subtasks = task.subtasks;

    let completed = 0;
    subtasks.forEach((subtask) => {
        if (subtask.isCompleted) {
            completed++;
        }
    });

    const [status, setStatus] = useState(task.status);
    const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));
    const [elipsisMenuOpen, setElipsisMenuOpen] = useState(false);

    const setOpenEditModal = () => {
        //late
    };

    const setOpenDeleteModal = () => {
        //later
    };


    return (
        <div className='fixed right-0 left-0 top-0 py-4 overflow-scroll scrollbar-hide z-50 bottom-0 justify-center
        items-center flex bg-[#00000080]'>

            {/*Modal Section*/}
            <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
                <div className=" relative flex   justify-between w-full items-center">
                    <h1 className=" text-lg">{task.title}</h1>

                    <img
                        onClick={() => {
                            setElipsisMenuOpen((state) => !state);
                        }}
                        src={elipsis}
                        alt="elipsis"
                        className=" cursor-pointer h-6"
                    />
                    {elipsisMenuOpen && (
                        <ElipsisMenu
                            setOpenEditModal={setOpenEditModal}
                            setOpenDeleteModal={setOpenDeleteModal}
                            type="Task"
                        />
                    )}
                </div>
                <p className=" text-gray-500 font-[600] tracking-wide text-xs pt-6">
                    {task.description}
                </p>

                <p className=" pt-6 text-gray-500 tracking-widest text-sm">
                    Subtasks ({completed} of {subtasks.length})
                </p>
            </div>

        </div>
    );
};

export default TaskModal;