import React, { useState, useEffect, useCallback, useRef } from 'react';
import {EditorState, ContentState, RichUtils, Modifier} from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertFromRaw, convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import './mainStyles.css';



export function Node(props) {    
    // console.log(props)
    
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const editorStateBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const editorStateValue = editorStateBlocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    let html = stateToHTML(editorState.getCurrentContent());
    // console.log("This is HTML" + html)
    // console.log(editorState.getCurrentContent())
    // let htmlRaw = convertToRaw(editorState.getCurrentContent())
    // let htmlFromRawRestored = convertFromRaw(htmlRaw)
    // console.log(htmlFromRawRestored); 


    const innerRef = useRef(null);  
    let [isClicked, setIsClicked] = useState(false);

    const handleClick = (event) => {

        for (let i = 0; i < event.path.length; i++) { // can't use Array.map as I need "break" statement
            if (props.id === event.path[i].id && event.target.className !== "pointsOfNode") {
                setIsClicked(true)
                break;
            } else if (event.target.id === "area" || 
            event.target.className === "node" && event.target.id !== props.id
            ) {
                setIsClicked(false)    
            }
        }
    }

    useEffect(() => {
        const div = innerRef.current;
        const area = document.getElementById("area")
        
        // console.log(div)
        div.focus()
        
        // div.addEventListener("click", handleClick,);
        area.addEventListener("click", handleClick);

        return() => {
            // div.removeEventListener("click", handleClick);
            area.removeEventListener("click", handleClick);
        }
    }, [handleClick])

    

    const editorFocusRef = useRef(null);
    useEffect(() => {
        // console.log(editorState.getSelection().getHasFocus())
        if (editorFocusRef.current) {
            editorFocusRef.current.focus();
        }
    }, [editorFocusRef]);


    const htmlOutput = props.htmlOutputFromEditor ? props.htmlOutputFromEditor : "<p style='opacity: 0.3'>Type in</p>"




    const styleNode = {
        minWidth: "60px",
        // // width: "30px",
        // // height: "50px",
        // minHeight: "20px",
        width: "fit-content",
        height: "fit-content",
        position: "absolute",
        top: props.clientY,
        left: props.clientX,
        backgroundColor: isClicked ? "inherit" : "white",
        fontFamily: "Arial",
        zIndex: "10",
        };


    const styleEditorWrapper = {
        minWidth: "30px",
        // width: "30px",
        // height: "50px",
        minHeight: "20px",
        // minWidth: "80%",
        // minHeight: "80%",
        backgroundColor: "green",
        // opacity: "0.5",
        zIndex: "11",
        padding: "4px",
        };

    const topEditor = props.clientY - 185; // for Editors offset, added while solving problem with stacking context
    const styleEditor = {
        width: "420px",
        position: "absolute",
        // top: "-185px",
        top: topEditor,
        left: props.clientX,
        zIndex: "15",
        };


    let divEditor = <div 
                        className='editor' 
                        style={styleEditor} 
                        ref={editorFocusRef}
                        >  
                            <Editor 
                                editorState={editorState} 
                                onChange={(e) => {
                                    props.onTextChange(html);
                                    }}
                                onEditorStateChange={setEditorState}
                                // handleKeyCommand={handleKeyCommand}
                                // plugins={plugins}
                                // ref={editor}
                                // blockStyleFn={blockStyleFn}
                                // placeholder='dsfdsf'
                                />
                    </div>
    
    const stylePointTop = {
        top: "-22px",
        left: "calc(50% - (15px / 2))",
    }
    
    const stylePointRight = {
        right: "-22px",
        top: "calc(50% - (15px / 2))",
    }

    const stylePointBottom = {
        bottom: "-22px",
        left: "calc(50% - (15px / 2))",
    }

    const stylePointLeft = {
        left: "-22px",
        top: "calc(50% - (15px / 2))",
    }
            
    return (
        <div>
            {isClicked ? divEditor : null} {/* had to place there to solve stacking context problem */}
            <div
                id={props.id}
                style={styleNode}
                className="node" 
                // onClick={handleOnClick} 
                draggable="true"
                onDrag={props.onDrag}
                
                // onDragStart={() => {props.onDragStart; html}}
                onDragStart={dragStartEvent => props.onDragStart(dragStartEvent, html)}
                // onDragEnd={dragEndEvent => props.onDragEnd(dragEndEvent, html)}
                // onDragEnd={props.onDragEnd, html}

                // onInput={(e) => props.onTextChange(e)}
                // disabled="true"
                // onPointerMove={props.onDrag}
                data-placeholder='data'
                
                ref={innerRef}
                
            >
                <div id={props.id + "top"} className="pointsOfNode" style={stylePointTop} onClick={props.onClick} ></div>
                <div id={props.id + "right"} className="pointsOfNode" style={stylePointRight} onClick={props.onClick} ></div>
                <div id={props.id + "bottom"} className="pointsOfNode" style={stylePointBottom} onClick={props.onClick} ></div>
                <div id={props.id + "left"} className="pointsOfNode" style={stylePointLeft} onClick={props.onClick} ></div>

                <div
                    style={styleEditorWrapper}
                    id={props.id + "editorWrapper"}
                    className={"nodesEditorWrapper"}
                    
                >
                    <div dangerouslySetInnerHTML={isClicked ? null : {__html: htmlOutput}}></div>
                </div>
            </div>
                
        </div>
        );
}
