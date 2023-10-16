import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import useDarkMode from "../Hooks/useDarkMode";

const SideBar = ({isSideBarOpen, setIsSideBarOpen}) => {
   /* const dispatch = useDispatch();

    const [colorTheme, setTheme] = useDarkMode();
    const [darkSide, setDarkSide] = useState(
        colorTheme === "light" ? true : false
    );

    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

    const boards = useSelector((state) => state.boards);*/

    return (
        <div>
            Sidebar
         {/*   <div
                className={isSideBarOpen ? 'min-w-[261px] bg-white dark:bg-[#2b2c37] fixed top-[#72px] h-screen items-center left-0 z-20'
                    : 'bg-[#635fc7] dark:bg-[#2b2c37]  dark:hover-bg[#635fc7] top-auto bottom-10 justify-center items-center  hover:opacity-80 cursor-pointer p-0 transition duration-300 transform fixed w-[56px] h-[48px] rounded-r-full'}
            >
                <div>
                    Rewrite Modal
                    {isSideBarOpen && (
                        <div className='bg-white  dark:bg-[#2b2c37] w-full py-4 rounded-xl'>
                            <h3 className='dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8'>
                                ALL BOARDS ({boards.length})
                            </h3>


                        </div>
                    )}
                </div>

            </div>*/}
        </div>
    );
};

export default SideBar;