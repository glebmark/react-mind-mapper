import './App.css';
import React, { useState, useEffect, useCallback } from 'react';


function Node(props) {    
    const styleSquare = {
        minWidth: "20px",
        width: "30px",
        minHeight: "20px",
        position: "absolute",
        top: props.clientY,
        left: props.clientX,
        color: "white",
        backgroundColor: "DodgerBlue",
        fontFamily: "Arial",
        display : "flex",
        flexDirection : "row",
        flexWrap : "wrap",
        zIndex: "10",
        };
    
    return (
        <textarea
            style={styleSquare}
            className="node" 
            onClick={props.onClick} 
            draggable="true"
            onDrag={props.onDrag}
            onDragStart={props.onDragStart}
            overflow="visible"
            // disabled="true"
            // onPointerMove={props.onDrag}

            // contentEditable="true"
        >
            {props.value} 
        </textarea>
        );
  }


function Area(props){

        const currentNodes = props.nodes.map((v, nodeNumber) => {
            // console.log("THIS IS this.props.nodes: " + this.props.nodes)
            return (
                <Node 
                    key={nodeNumber}
                    // value={props.nodes[i]}
                    clientY={props.nodes[nodeNumber].clientY}
                    clientX={props.nodes[nodeNumber].clientX}
                    onClick={() => {props.onClick(nodeNumber);}} 
                    onDrag={dragEvent => props.onDrag(nodeNumber, dragEvent)}
                    onDragStart={dragStartEvent => props.onDragStart(nodeNumber, dragStartEvent)}
                />
            );
        });


        const styleArea = {
            minWidth: "300px",
            // width: "100%",
            // height: "100%",
            minHeight: "300px",
            backgroundColor: "green",
        };

        
        return (  
            <div
                id='area' 
                style={styleArea} 
                onDoubleClick={mouseEvent => props.onDoubleClick(mouseEvent)}
            >
                {currentNodes}
            </div>
        );
}



function MindMap() {
    const [history, setHistory] = useState([{nodes: []}]);
    const [moveNumber, setMoveNumber] = useState(0);
        
    

    // useEffect(() => {
    //     document.addEventListener("keydown", handleUndoRedo(moveNumber, keyEvent));
    //     return() => {
    //         document.removeEventListener("keydown", handleUndoRedo(moveNumber, keyEvent));
    //     }
    // })
    


    function jumpTo(moveNumber) {
        setMoveNumber(moveNumber)
    }

    const handleUndoRedo = useCallback(keyEvent => {
        console.log(keyEvent)
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
    }, [moveNumber]); // on update of moveNumber

    useEffect(() => {
        window.addEventListener("keydown", handleUndoRedo);
        return() => {
            window.removeEventListener("keydown", handleUndoRedo);
        }
    }, [handleUndoRedo])

    function handleClick(i) {
        // console.log("one click")
        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];

        setHistory(historyCopy.concat([{nodes: nodes}]));
        setMoveNumber(historyCopy.length)
    }


    function handleDoubleClick(mouseEvent) {
        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice; .slice instead of ... should be used because we have to truncate up to moveNumber to discard all needn't moves (it's for undo)
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];

        // console.log(mouseEvent)
        
        if (mouseEvent.clientY <= 25 || mouseEvent.clientX <= 25) {
            return
        } else {
            
            let node = {
                clientY: mouseEvent.clientY,
                clientX: mouseEvent.clientX,
            }
            nodes[nodes.length] = node;
    
            setHistory(historyCopy.concat([{nodes: nodes}]));
            setMoveNumber(historyCopy.length)
        }
    }


    function handleOnDrag(nodeNumber, dragEvent) {
        const clientY = dragEvent.clientY;
        const clientX = dragEvent.clientX;

        if (clientY === 0 && clientX === 0) {
            console.log("zero")
            return
        }

        const historyCopy = [...history]; // there .slice isn't used as there no need to store new moves
        historyCopy[historyCopy.length - 1].nodes[nodeNumber].clientY = clientY;
        historyCopy[historyCopy.length - 1].nodes[nodeNumber].clientX = clientX;

        setHistory(historyCopy)
    }


    // this handle serves several goals:
    // 1) it hides draggable shadow
    // 2) it adds new move for making history of states
    function handleOnDragStart(nodeNumber, dragStartEvent) {
        let dragImg = new Image(0,0);
        dragImg.src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        dragStartEvent.dataTransfer.setDragImage(dragImg, 0, 0);

        const historyCopy = history.slice(0, moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];

        // console.log(dragStartEvent)
        
        let nodeAlikeState = {
            clientY: dragStartEvent.clientY,
            clientX: dragStartEvent.clientX,
        }
        nodes[nodeNumber] = nodeAlikeState; // it's not new node as in handeDoubleClick, it's rather state (new coordinates) of previous one

        setHistory(historyCopy.concat([{nodes: nodes}]));
        setMoveNumber(historyCopy.length)
    }


    const moves = history.map((step, moveNumber) => {
        return (
            <li key={moveNumber}>
                <button onClick={() => jumpTo(moveNumber)}>Jump to move: {moveNumber}</button>
            </li>
        );
    });


    return (
        <div 
            className='mindmap'
            onKeyDown={(keyEvent) => handleUndoRedo(moveNumber, keyEvent)}
        >

                <Area 
                    nodes={history[moveNumber].nodes}
                    // onClick={(i) => {this.handleClick(i), this.handleClick(i)}}
                    // onClick={i => handleClick(i)}
                    onDoubleClick={mouseEvent => handleDoubleClick(mouseEvent)}
                    onDrag={(nodeNumber, dragEvent) => handleOnDrag(nodeNumber, dragEvent)}
                    onDragStart={(nodeNumber, dragStartEvent) => handleOnDragStart(nodeNumber, dragStartEvent)}
                />

            <ul>
                {moves}
            </ul>
        </div>
        );
}


export default MindMap;


