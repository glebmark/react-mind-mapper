import React, { useState, useEffect, useCallback } from 'react';
import {Editor, EditorState, ContentState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {convertToRaw,} from 'draft-js';


export function Node(props) {    
    console.log(props)

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


    const boldText = (e) => {        
        // onMouseDown and e.preventDefault because editor losses focus if you use onClick
        e.preventDefault();
        let nextState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
        setEditorState(nextState);
    }

    console.log(editorStateValue)


    return (
        <div
            style={styleSquare}
            className="node" 
            // onClick={props.onClick} 
            draggable="true"
            onDrag={props.onDrag}
            onDragStart={props.onDragStart}
            // onInput={(e) => props.onTextChange(e)}
            // overflow="visible"
            // disabled="true"
            // onPointerMove={props.onDrag}
            
            // contentEditable="true"
            // suppressContentEditableWarning={true}
            
            value = {props.innerText}
            
        >
            <div>
                <button onMouseDown = {boldText}>Bold</button>
                <Editor 
                    editorState={editorState} 
                    onChange={(e) => {
                        setEditorState(e);
                        props.onTextChange(editorStateValue);
                        }}
                    // placeholder='dsfdsf'
                    />
            </div>
        </div>
        );
}
