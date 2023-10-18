import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import crossIcon from '../assets/icon-cross.svg'
import {useDispatch, useSelector} from "react-redux";
import boardsSlice from "../redux/boardsSlice";

const AddEditTaskModal = ({type, device, setIsTaskModalOpen, setIsAddTaskModalOpen, taskIndex, prevColIndex = 0}) => {
    const dispatch = useDispatch();
    const [isFirstLoad, setIsFirstLoad] = useState(true);


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const board = useSelector((state) => state.boards).find(
        (board) => board.isActive
    );

    const columns = board.columns;
    const col = columns.find((col, index) => index === prevColIndex);
    const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];
    const [status, setStatus] = useState(columns[prevColIndex].name);
    const [newColIndex, setNewColIndex] = useState(prevColIndex);
    const [subtasks, setSubtasks] = useState([
        {title: "", isCompleted: false, id: uuidv4()},
    ]);

    const onChangeSubtasks = (id, newValue) => {
        setSubtasks((prevState) => {
            const newState = [...prevState];
            const subtask = newState.find((subtask) => subtask.id === id);
            subtask.title = newValue;
            return newState;
        });
    };

    const onChangeStatus = (e) => {
        setStatus(e.target.value);
        setNewColIndex(e.target.selectedIndex);
    };
    /*    const [isValid, setIsValid] = useState(true);
        const [errors, setErrors] = useState({
            title: false,
            subtask.title
        });*/

    const [errors, setErrors] = useState({
        title: false,
        subtasks: subtasks.map(() => false), // Додайте помилки для кожної підзадачі
    });

    const validate = () => {
        const newErrors = {
            title: !title.trim(),
            subtasks: subtasks.map((subtask) => !subtask.title.trim()),
        };

        setErrors(newErrors);

        return !newErrors.title && !newErrors.subtasks.includes(true);
    };

    /*

        const validate = () => {
            setIsValid(false);
            if (!title.trim()) {
             return false
            }

            for (let i = 0; i < subtasks.length; i++) {
                if (!subtasks[i].title.trim()) {
                    return false;
                    console.log('not valid subtask');
                }
            }
            setIsValid(true);
            return true;
        };*/


    if (type === "edit" && isFirstLoad) {
        setSubtasks(
            task.subtasks.map((subtask) => {
                return {...subtask, id: uuidv4()};
            })
        );
        setTitle(task.title);
        setDescription(task.description);
        setIsFirstLoad(false);
    }

    const onDelete = (id) => {
        setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
    };

    const onSubmit = (type) => {
        if (type === "add") {
            dispatch(
                boardsSlice.actions.addTask({
                    title,
                    description,
                    subtasks,
                    status,
                    newColIndex,
                })
            );
        } else {
            dispatch(
                boardsSlice.actions.editTask({
                    title,
                    description,
                    subtasks,
                    status,
                    taskIndex,
                    prevColIndex,
                    newColIndex,
                })
            );
        }
    };

    return (
        <div
            className={
                device === "mobile"
                    ? "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0 dropdown "
                    : "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0 dropdown "
            }
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }
                setIsAddTaskModalOpen(false);
            }}
        >
            {/* Modal Section */}

            <div
                className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl"
            >
                <h3 className=" text-lg ">
                    {type === "edit" ? "Edit" : "Add New"} Task
                </h3>

                {/* Task Name */}

                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Task Name
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="task-name-input"
                        type="text"
                        onBlur={validate}
                        required
                        className={errors.title ? `bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] 
                            border-red-500 focus:outline-red-500 outline-1  ring-0  `
                            : `bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm
                        border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0 `}
                        /*   className={ `bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm
                           border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0 `}*/
                        placeholder=" e.g Take coffee break"
                    />
                    {errors.title && (
                        <div className=' text-xs text-red-500'>Enter task name</div>
                    )}
                </div>

                {/* Description */}
                <div className="mt-8 flex flex-col space-y-1">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="task-description-input"
                        className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px] "
                        placeholder="e.g. It's always good to take a break. This
            15 minute break will  recharge the batteries
            a little."
                    />
                </div>

                {/* Subtasks */}

                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Subtasks
                    </label>

                    {subtasks.map((subtask, index) => (
                        <div key={index}>
                            <div  className=" flex items-center w-full ">
                            <input
                                onChange={(e) => {
                                    onChangeSubtasks(subtask.id, e.target.value);
                                }}
                                type="text"
                                value={subtask.title}

                                // className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                                placeholder=" e.g Take coffee break"
                                onBlur={validate}
                                required
                                className={errors.subtasks[index] ? `bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px]  outline-[1px]
                            border-red-500 focus:outline-red-500    `
                                    : `bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  `}
                            />
                            <img
                                src={crossIcon}
                                onClick={() => {
                                    onDelete(subtask.id);
                                }}
                                className=" m-4 cursor-pointer "
                            />
                            </div>
                             {errors.subtasks[index] && (
                                 <div className=' text-xs text-red-500'>Enter subtask name or delete it</div>
                             )}
                        </div>
                    ))}

                    <button
                        className=" w-full items-center dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full "
                        onClick={() => {
                            setSubtasks((state) => [
                                ...state,
                                {title: "", isCompleted: false, id: uuidv4()},
                            ]);
                        }}
                    >
                        + Add New Subtask
                    </button>
                </div>

                {/* current Status  */}
                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Current Status
                    </label>
                    <select
                        value={status}
                        onChange={onChangeStatus}
                        className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
                    >
                        {columns.map((column, index) => (
                            <option key={index}>{column.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            const isValid = validate();
                            console.log('validate')
                            if (isValid) {
                                console.log('is valid')
                                onSubmit(type);
                                setIsAddTaskModalOpen(false);
                                type === "edit" && setIsTaskModalOpen(false);
                            }
                        }}
                        className=" w-full items-center text-white bg-[#635fc7] py-2 rounded-full "
                    >
                        {type === "edit" ? "Save edit" : "Create task"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddEditTaskModal;