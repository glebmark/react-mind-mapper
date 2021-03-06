import {Node} from './element.js';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import CurvedArrow from "react-curved-arrow";
import './styles/mainStyles.css';
import './styles/buttonStyle.scss';


function Area(props){

    // console.log("THIS IS PROPS")
    // console.log(props)

        const currentNodes = props.nodes.map((v, nodeNumber) => {
            return (
                <Node 
                    id={"node" + nodeNumber}
                    key={"node" + nodeNumber}
                    // nodeNumber={nodeNumber}
                    // value={props.nodes[i]}
                    // clientY={props.nodes[nodeNumber].clientY}
                    // clientX={props.nodes[nodeNumber].clientX}
                    clientY={v.clientY}
                    clientX={v.clientX}
                    // htmlOutputFromEditor={props.nodes[nodeNumber].htmlOutputFromEditor}
                    htmlOutputFromEditor={v.htmlOutputFromEditor}
                    onClick={(clickEvent) => props.onClick(clickEvent)}
                    // onClick={props.onClick}
                    onDrag={dragEvent => props.onDrag(nodeNumber, dragEvent)}
                    onDragStart={(dragStartEvent, textChange) => props.onDragStart(nodeNumber, dragStartEvent, textChange)}
                    onDragEnd={(dragEndEvent, textChange) => props.onDragEnd(nodeNumber, dragEndEvent, textChange)}
                    onTextChange={textChange => props.onTextChange(nodeNumber, textChange)}
                />
            );
        });

        const currentArrows = props.arrows.map((v, arrowNumber) => {
            return (
                <CurvedArrow 
                    fromSelector={"#" + v.fromSelector} 
                    toSelector={"#" + v.toSelector} 
                    dynamicUpdate="true"
                    width="1"
                    middleY={(v.fromSelector.includes("bottom") || v.toSelector.includes("bottom")) ? "-60" : "60"}
                    id={"arrow" + arrowNumber}
                    key={"arrow" + arrowNumber}
                    />
            );
        });


        const styleArea = {
            // width: "3000px",
            width: "100%",
            height: "100%",
            // height: "2000px",
            backgroundColor: "#796385",
            zIndex: "2"
        };

        
        return (  
            <div
                id='area' 
                style={styleArea} 
                onDoubleClick={mouseEvent => props.onDoubleClick(mouseEvent)} // creation of new nodes
            >
                {currentNodes}
                {currentArrows}
            </div>
        );
}


function MindMap() {
    const [history, setHistory] = useState([{nodes: [], arrows: []}]);
    const [arrowBuffer, setArrowBuffer] = useState([]); // for temporarily record the pairs of points between which arrow is located
    const [moveNumber, setMoveNumber] = useState(0);


    function jumpTo(moveNumber) {
        setMoveNumber(moveNumber)
    }

    const handleUndoRedo = useCallback(keyEvent => {
        // console.log(keyEvent)
        // console.log("history.length: " + history.length)
        // console.log("moveNumber: " + moveNumber)
        
        if((keyEvent.ctrlKey || keyEvent.metaKey) && !keyEvent.shiftKey && keyEvent.key === 'z' && moveNumber !== 0) {
            console.log("ctrl+Z")
            setMoveNumber(moveNumber - 1) // undo
        }
        
        if(history.length - 1 > moveNumber) {
            if (keyEvent.ctrlKey && keyEvent.key === 'y') { // Windows Linux
                setMoveNumber(moveNumber + 1) // redo
            } else if (keyEvent.metaKey && keyEvent.shiftKey && (keyEvent.key === 'z' || keyEvent.key === 'Z')) { // macOS
                setMoveNumber(moveNumber + 1) // redo
            }
            console.log("meta shift Z")
            // } else if (keyEvent.keyCode === 90) { // macOS
            //     console.log("meta shift Z")
            //     setMoveNumber(moveNumber + 1) // redo
            // }
        }

        setArrowBuffer([])

    }, [moveNumber]); // to catch update of moveNumber

    useEffect(() => {
        window.addEventListener("keydown", handleUndoRedo);

        return() => {
            window.removeEventListener("keydown", handleUndoRedo);
        }
    }, [handleUndoRedo])

    useEffect(() => {
        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];
        const arrows = [...current.arrows];
        const arrowBufferCopy = [...arrowBuffer];


        if (arrowBuffer.length >= 2) {
            console.log("added new arrow")
            let arrow = {
                fromSelector: arrowBufferCopy[0],
                toSelector: arrowBufferCopy[1],
            }
    
            arrows[arrows.length] = arrow;
    
    
            setHistory(historyCopy.concat([{nodes: nodes, arrows: arrows}]));
            setMoveNumber(historyCopy.length)
            setArrowBuffer([])
        }

        return() => {
            // setArrowBuffer([])
        }
    }, [arrowBuffer])


    function handleClickArrow(clickEvent) {
        const arrowBufferCopy = [...arrowBuffer];

        if (arrowBufferCopy.length >= 2) {
            setArrowBuffer([])
        } else {
            setArrowBuffer(arrowBufferCopy.concat(clickEvent.target.id))            
        }
    }


    function handleDoubleClick(mouseEvent) {
        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice; .slice instead of ... should be used because we have to truncate up to moveNumber to discard all needn't moves (it's for undo)
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];
        const arrows = [...current.arrows];


        if ((mouseEvent.clientY <= 30 || 
            mouseEvent.clientX <= 30 || 
            mouseEvent.clientX >= mouseEvent.target.offsetWidth - 50 ||
            mouseEvent.clientY >= mouseEvent.target.offsetHeight - 50
            ) && mouseEvent.target !== "area") {
            return
        } else {
            
            let node = {
                clientY: mouseEvent.clientY,
                clientX: mouseEvent.clientX,
                htmlOutputFromEditor: '',
            }
            nodes[nodes.length] = node;
    
            setHistory(historyCopy.concat([{nodes: nodes, arrows: arrows}])); // concat in needed only when we need add new move (for undo & redo)
            setMoveNumber(historyCopy.length)
        }
    }


    function handleOnDrag(nodeNumber, dragEvent) { // this whole function needed to change coordinates of nodes on drag
        const clientY = dragEvent.clientY;
        const clientX = dragEvent.clientX;


        if (clientY === 0 && clientX === 0) {
            console.log("zero")
            return
        }

        const historyCopy = [...history]; // there .slice isn't used as there no need to store new moves (because there only coordinates changed)
        historyCopy[historyCopy.length - 1].nodes[nodeNumber].clientX = clientX - dragEvent.target.offsetWidth / 2;
        historyCopy[historyCopy.length - 1].nodes[nodeNumber].clientY = clientY - dragEvent.target.offsetHeight / 2;

        setHistory(historyCopy)
    }

    function handleOnTextChange(nodeNumber, textChange) {
        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];
        const arrows = [...current.arrows];
        // console.log(textChange)

        let nodeAlikeState = {
            clientY: nodes[nodeNumber].clientY, // it's needed for copying last position of edited node
            clientX: nodes[nodeNumber].clientX, // it's needed for copying last position of edited node
            htmlOutputFromEditor: textChange,
        }
        nodes[nodeNumber] = nodeAlikeState; // it's not new node as in handeDoubleClick, it's rather state (new coordinates) of previous one
        
        setHistory(historyCopy.concat([{nodes: nodes, arrows: arrows}])); // concat in needed only when we need add new move (for undo & redo)
        setMoveNumber(historyCopy.length)
    }


    // this handle serves several goals:
    // 1) it hides draggable shadow
    // 2) it adds new move for making history of states
    function handleOnDragStart(nodeNumber, dragStartEvent, textChange) { // this whole function needed NOT to change coordinates on drag, but to store coordinates and record new move (for undo & redo)
        let dragImg = new Image(0,0);
        dragImg.src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // empty image
        dragStartEvent.dataTransfer.setDragImage(dragImg, 0, 0);

        // console.log(textChange)

        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];
        const arrows = [...current.arrows];
        
        let nodeAlikeState = {
            clientY: dragStartEvent.clientY,
            clientX: dragStartEvent.clientX,
            htmlOutputFromEditor: textChange,
        }
        nodes[nodeNumber] = nodeAlikeState; // it's not new node as in handeDoubleClick, it's rather state (new coordinates) of previous one

        setHistory(historyCopy.concat([{nodes: nodes, arrows: arrows}]));
        setMoveNumber(historyCopy.length)
    }


    function handleOnDragEnd(nodeNumber, dragEndEvent, textChange) { // this whole function needed NOT to change coordinates on drag, but to store coordinates and record new move (for undo & redo)
        // let dragImg = new Image(0,0);
        // dragImg.src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // empty image
        // dragStartEvent.dataTransfer.setDragImage(dragImg, 0, 0);
        // console.log(textChange)

        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];
        const arrows = [...current.arrows];
        
        let nodeAlikeState = {
            clientY: dragEndEvent.clientY,
            clientX: dragEndEvent.clientX,
            htmlOutputFromEditor: textChange,
        }
        nodes[nodeNumber] = nodeAlikeState; // it's not new node as in handeDoubleClick, it's rather state (new coordinates) of previous one

        setHistory(historyCopy.concat([{nodes: nodes, arrows: arrows}]));
        setMoveNumber(historyCopy.length)
    }

    const styleMindmap = {
        width: "100%",
        height: "100%",
    };

    const styleMovesListWrapper = {
        position: "absolute",
        top: "40px",
        right: "15px",
        // color: "white",
        zIndex: "10",
        height: "100px",
        padding: "20px",
        overflow: "scroll",
        };

    const styleMovesList = {
        zIndex: "10",
        listStyleType: "none",
        };

    const styleJumpsListItem = {
        // color: "white",
        listStyleType: "none",
        // height: "22px",
        };
    
    const styleButtonOfMovesList = {
        // backgroundColor: "white",
        // fontFamily: "Arial",
        // minWidth: "135px",
        // textAlign: "left"
        };

    const movesListRef = useRef(null);

    useEffect(() => {
        movesListRef.current.scrollIntoView({ behavior: 'smooth', block: "end" });
      }, [moveNumber]);
        

    const moves = history.map((step, moveNumber) => {
        return (
            <li style={styleJumpsListItem} key={moveNumber}>
                <button
                    className="material-bubble"
                    style={styleButtonOfMovesList}  
                    // class="effect effect-5"
                    onClick={() => jumpTo(moveNumber)
                    }
                    >
                        Jump to move: {moveNumber}
                </button>
            </li>
        );
    });


    return (
        <div 
            className='mindmap'
            onKeyDown={(keyEvent) => handleUndoRedo(moveNumber, keyEvent)}
            style={styleMindmap} 
        >
                <Area 
                    nodes={history[moveNumber].nodes}
                    arrows={history[moveNumber].arrows}
                    // onClick={(i) => {this.handleClick(i), this.handleClick(i)}}
                    onClick={(clickEvent) => handleClickArrow(clickEvent)}
                    onDoubleClick={mouseEvent => handleDoubleClick(mouseEvent)}
                    onDrag={(nodeNumber, dragEvent) => handleOnDrag(nodeNumber, dragEvent)}
                    onDragStart={(nodeNumber, dragStartEvent, textChange) => handleOnDragStart(nodeNumber, dragStartEvent, textChange)}
                    onDragEnd={(nodeNumber, dragEndEvent, textChange) => handleOnDragEnd(nodeNumber, dragEndEvent, textChange)}
                    onTextChange={(nodeNumber, textChange) => handleOnTextChange(nodeNumber, textChange)}
                />
            <div style={styleMovesListWrapper} id="movesListWrapper" >
                <ul style={styleMovesList} ref={movesListRef}>
                    {moves}
                </ul>
            </div>
        </div>
        );
}


export default MindMap;


