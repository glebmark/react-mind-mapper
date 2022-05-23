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
    

    
    // const editor = useRef(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    
    const editorStateBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const editorStateValue = editorStateBlocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');


    const boldText = (e) => {        
        // onMouseDown and e.preventDefault because editor losses focus if you use onClick
        e.preventDefault();
        let nextState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        setEditorState(nextState);
    }
    const underlineText = (e) => {        
        // onMouseDown and e.preventDefault because editor losses focus if you use onClick
        e.preventDefault();
        let nextState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
        setEditorState(nextState);
    }

    const italicText = (e) => {        
        // onMouseDown and e.preventDefault because editor losses focus if you use onClick
        e.preventDefault();
        let nextState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
        setEditorState(nextState);
    }

    const alignmentRight = (e) => {        
        // onMouseDown and e.preventDefault because editor losses focus if you use onClick
        e.preventDefault();
        let nextState = RichUtils.toggleInlineStyle(editorState, 'RIGHT');
        setEditorState(nextState);
    }

    const handleKeyCommand = command => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
        //   onChange(newState);
            setEditorState(newState)
            return "handled";
        }
        return "not-handled";
      };
    

    const innerRef = useRef(null);  

    // let isLoggedIn = false;
    let [isHover, setIsHover] = React.useState(false);

    const handleClick = () => {
        console.log("focus")
        // isHover = true;
        setIsHover(true)
    }
    
    useEffect(() => {
        const div = innerRef.current;
        div.addEventListener("click", handleClick);
        return() => {
            div.removeEventListener("click", handleClick);
        }
    }, [handleClick])
    

    console.log(isHover)
    switch (isHover) {
        case true:
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
                    <div className='editor'>
                        {/* <button onMouseDown = {boldText}>B</button>
                        <button onMouseDown = {italicText}>I</button>
                        <button onMouseDown = {underlineText}>U</button>
                        <button onMouseDown = {alignmentRight}>R1</button> */}
                        {/* <button onMouseDown={() => applyAlignment('left')}>L</button>
                        <button onMouseDown={() => applyAlignment('center')}>C</button>
                        <button onMouseDown={() => applyAlignment('right')}>R</button> */}
                        
                        <Editor 
                            editorState={editorState} 
                            onChange={(e) => {
                                // setEditorState(e);
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
                </div>
                );
          break;
        case false:
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
                </div>
                );
          break;
        default:
          return null;
      }
    



    
}
