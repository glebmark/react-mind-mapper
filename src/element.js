import React, { useState, useEffect, useCallback, useRef } from 'react';
import {EditorState, ContentState, RichUtils, Modifier} from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw,} from 'draft-js';

import {stateToHTML} from 'draft-js-export-html';


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
    let html = stateToHTML(editorState.getCurrentContent());
    // console.log(html)


    const innerRef = useRef(null);  
    let [isClicked, setIsClicked] = React.useState(false);

    const handleClick = (event) => {
        // console.log(event.target)
        
        // isClicked ? setIsClicked(false) : setIsClicked(true)
        // event.target.id === "area" && props.id !== event.target.id ? setIsClicked(false) : setIsClicked(true)
        
        // console.log(props.nodeNumber)
        // console.log(innerRef.current)

        // if (document.getElementsByClassName("editor") !== event.target.className && (event.target.id === "area" || event.target.id !== props.id)) {
        if (event.target.id === "area" || (event.target.className === "node" && event.target.id !== props.id)) {
            setIsClicked(false)
            } else if (event.target.id === props.id && event.target.id !== "area") {
                // console.log(props.id)
                // console.log(event.target.id)
                setIsClicked(true)
            }
        
    }

    useEffect(() => {
        const div = innerRef.current;
        const area = document.getElementById("area")
        
        div.addEventListener("click", handleClick);
        area.addEventListener("click", handleClick);
        return() => {
            area.removeEventListener("click", handleClick);
            div.removeEventListener("click", handleClick);
        }
    }, [handleClick])

    
    let divEditor = <div className='editor'>  
                        <Editor 
                            editorState={editorState} 
                            onChange={(e) => {
                                props.onTextChange(html);
                                }}
                            onEditorStateChange={setEditorState}
                            zIndex={11}
                            // handleKeyCommand={handleKeyCommand}
                            // plugins={plugins}
                            // ref={editor}
                            // blockStyleFn={blockStyleFn}
                            // placeholder='dsfdsf'
                            />
                    </div>

    // console.log(isClicked)

    return (
            <div
                id={props.id}
                style={styleSquare}
                className="node" 
                // onClick={props.onClick} 
                // onClick={handleOnClick} 
                draggable="true"
                // onDrag={props.onDrag}


                // onDragStart={() => {props.onDragStart; html}}
                onDragStart={dragStartEvent => props.onDragStart(dragStartEvent, html)}
                onDragEnd={dragEndEvent => props.onDragEnd(dragEndEvent, html)}
                // onDragEnd={props.onDragEnd, html}


                // onInput={(e) => props.onTextChange(e)}
                // overflow="visible"
                // disabled="true"
                // onPointerMove={props.onDrag}
                
                // contentEditable="true"
                // suppressContentEditableWarning={true}
                ref={innerRef}
                // value = {props.htmlOutputFromEditor}
            >
                {isClicked ? divEditor : null}
                {/* {props.htmlOutputFromEditor} */}
                <div dangerouslySetInnerHTML={{__html: props.htmlOutputFromEditor}}>

                </div>
            </div>
        );
}
