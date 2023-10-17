import React, {useState} from "react";
import Home from "./components/Home";
import Header from "./components/Header";
import "./index.css";
import {useDispatch, useSelector} from "react-redux";
import boardsSlice from "./redux/boardsSlice";
import EmptyBoard from "./components/EmptyBoard";

function App() {
    const dispatch = useDispatch();

    const boards = useSelector((state) => state.boards);
    const activeBoard = boards.find(board => board.isActive);

    if (!activeBoard && boards.length > 0) {
        dispatch(boardsSlice.actions.setBoardActive({index: 0}))
    }
    const [boardModalOpen, setBoardModalOpen] = useState(false);

    return (
        <div className='overflow-hidden overflow-x-scroll'>
            <>
                {boards.length > 0 ?
                    <>
                        {/* Header Section*/}
                        <Header boardModalOpen={boardModalOpen} setBoardModalOpen={setBoardModalOpen}/>
                        {/*Home Section*/}
                        <Home boardModalOpen={boardModalOpen} setBoardModalOpen={setBoardModalOpen}/>
                    </>
                    :
                    <>
                        <EmptyBoard type='add'/>
                    </>
                }

            </>
        </div>
    )

}

export default App;
