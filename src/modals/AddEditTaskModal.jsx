import React, {useState} from 'react';
import {v4 as uuidv4, validate} from 'uuid';
import crossIcon from '../assets/icon-cross.svg'
import {useDispatch, useSelector} from "react-redux";
import boardsSlice from "../redux/boardsSlice";

const AddEditTaskModal = ({type, device, setOpenAddEditTask, prevColIndex = 0,}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [status, setStatus] = useState(columns[prevColIndex].name);
    const [newColIndex, setNewColIndex] = useState(prevColIndex);

    const [subtasks, setSubtasks] = useState(
        [
            {title: '', isCompleted: false, id: uuidv4()},
            {title: '', isCompleted: false, id: uuidv4()}
        ]
    );

    const board = useSelector((state) => state.boards.find((board) => board.isActive));
    const dispatch = useDispatch();
    const columns = board.columns;
    const col = columns.find((col, index) => index === prevColIndex);

    const onDelete = (id) => {
        setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
    };

    const validate = () => {
        setIsValid(false);
        if (!title.trim()) {
            return false;
        }

        for (let i = 0; i < subtasks.length; i++) {
            if (!subtasks[i].name.trim()) {
                return false;
            }

            setIsValid(true);
            return true;
        }
    };

    const onSubmit = (type) => {
        if (type === 'add') {
            dispatch(boardsSlice.actions.addTask({
                title,
                description,
                subtasks,
                status
            }))
        }
    }


    const onChange = (id, newValue) => {
        setSubtasks((prevState) => {
            const newState = [...prevState];
            const subtask = newState.find((subtask) => subtask.id === id);
            subtask.title = newValue;
            return newState;
        })
    };

    const onChangeStatus = (e) => {
        setStatus(e.target.value);
        setNewColIndex(e.target.selectedIndex)
    };


    return (
        <div
            onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return
                }
                setOpenAddEditTask(false);
            }}
            className={device === 'mobile' ? 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 ' +
                'bottom-[-100vh] top-0 bg-[#00000080]' : 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 ' +
                'bottom-0 top-0 bg-[#00000080]'}>


            {/*    Modal Section*/}
            <div className='scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black
        dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl'>
                <h3 className='text-lg'>
                    {type === 'edit' ? 'Edit' : 'Add New'} Task
                </h3>

                {/*    Task Name*/}
                <div className='mt-8 flex flex-col space-y-1'>
                    <label className='text-sm dark:text-white text-gray-500'>
                        Task Name
                    </label>
                    <input type="text" value={title} onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                           className='bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border border-gray-600
            focus:outline-[#635fc7] ring-0' placeholder="e.g. Take coffee break"/>
                </div>

                {/*    Description*/}
                <div className='mt-8 flex flex-col space-y-1'>
                    <label className='text-sm dark:text-white text-gray-500'>
                        Description
                    </label>
                    <textarea value={description} onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                              className='bg-transparent px-4 py-2 outline-none focus:border-0 min-h-[200px] rounded-md text-sm
                        border border-gray-600
            focus:outline-[#635fc7] ring-0' placeholder="e.g. It is always a good idea to take a break"/>
                </div>


                {/*    Subtask Section*/}

                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Subtasks
                    </label>

                    {subtasks.map((subtask, index) => (
                        <div key={index} className=" flex items-center w-full ">
                            <input
                                onChange={(e) => {
                                    onChangeSubtasks(subtask.id, e.target.value);
                                }}
                                type="text"
                                value={subtask.title}
                                className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                                placeholder=" e.g Take coffee break"
                            />
                            <img
                                src={crossIcon}
                                onClick={() => {
                                    onDelete(subtask.id);
                                }}
                                className=" m-4 cursor-pointer "
                            />
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

                {/*Current Status Section*/}
                <div className="mt-8 flex flex-col space-y-3">
                    <label className="  text-sm dark:text-white text-gray-500">
                        Current Status
                    </label>
                    <select value={status} onChange={(e) => onChangeStatus(e)}
                            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent
                    focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none
                    "
                    >
                        {columns.map((column, index) => (
                            <option className="   dark:text-white text-gray-500 dark:bg-[#2b2c37] bg-white
                      "
                                    value={column.name} key={index}>
                                {column.name}
                            </option>
                        ))}
                    </select>

                    <button onClick={() => {
                        const isValid = validate();
                        if (isValid) {
                            onSubmit(type)
                        }
                    }}
                            className='w-full items-center text-white bg-[#635fc7] py-2 rounded-full'>
                        {type === 'edit' ? 'Save Edit' : 'Create Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditTaskModal;