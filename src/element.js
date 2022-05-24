import React, { useState, useEffect, useCallback, useRef } from 'react';
import {EditorState, ContentState, RichUtils, Modifier} from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw,} from 'draft-js';

import { unmountComponentAtNode, render } from "react-dom";


export function Node(props) {    
    // console.log(props)

    const styleSquare = {
        minWidth: "20px",
        // width: "30px",
        // height: "50px",
        minHeight: "20px",
        position: "absolute",
        top: props.clientY,
        left: props.clientX,
        color: "white",
        backgroundColor: "DodgerBlue",
        fontFamily: "Arial",
        // display : "flex",
        // flexDirection : "row",
        // flexWrap : "wrap",
        zIndex: "10",
        };
    

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    
    const editorStateBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const editorStateValue = editorStateBlocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');


    const innerRef = useRef(null);  
    let [isClicked, setIsClicked] = React.useState(false);

    const handleClick = () => {
        console.log("focus")
        // isClicked = true;
        setIsClicked(true)
    }

    useEffect(() => {
        const div = innerRef.current;
        div.addEventListener("click", handleClick);
        return() => {
            div.removeEventListener("click", handleClick);
        }
    }, [handleClick])
    
    let divEditor = <div className='editor'>  
                        <Editor 
                            editorState={editorState} 
                            onChange={(e) => {
                                props.onTextChange(editorStateValue);
                                }}
                            onEditorStateChange={setEditorState}
                            // handleKeyCommand={handleKeyCommand}
                            // plugins={plugins}
                            // ref={editor}
                            // blockStyleFn={blockStyleFn}
                            // placeholder='dsfdsf'
                            />
                    </div>

    console.log(isClicked)

    return (
            <div
                style={styleSquare}
                className="node" 
                // onClick={props.onClick} 
                // onClick={handleOnClick} 
                draggable="true"
                onDrag={props.onDrag}
                onDragStart={props.onDragStart}
                // onInput={(e) => props.onTextChange(e)}
                // overflow="visible"
                // disabled="true"
                // onPointerMove={props.onDrag}
                
                // contentEditable="true"
                // suppressContentEditableWarning={true}
                ref={innerRef}
                value = {props.innerText}
            >
                {isClicked ? divEditor : null}
            </div>
        );
}
