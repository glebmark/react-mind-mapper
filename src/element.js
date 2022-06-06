import React, { useState, useEffect, useCallback, useRef } from 'react';
import {EditorState, ContentState, RichUtils, Modifier} from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw,} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';


export function Node(props) {    
    // console.log(props)
    
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const editorStateBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const editorStateValue = editorStateBlocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    let html = stateToHTML(editorState.getCurrentContent());
    // console.log(html)


    const innerRef = useRef(null);  
    let [isClicked, setIsClicked] = useState(false);

    const handleClick = (event) => {
        // console.log(event.target)
    
        // console.log(props.nodeNumber)
        // console.log(innerRef.current)

        if (event.target.id === "area" || (event.target.className === "node" && event.target.id !== props.id)) {
            setIsClicked(false)
            } else if ((event.target.id === props.id || event.target.id === props.id + "editorWrapper" )&& event.target.id !== "area") {
                // console.log(props.id)
                // console.log(event.target.id)
                setIsClicked(true)
            }
    }

    useEffect(() => {
        const div = innerRef.current;
        const area = document.getElementById("area")
        
        // console.log(div)
        div.focus()
        
        div.addEventListener("click", handleClick);
        area.addEventListener("click", handleClick);
        return() => {
            area.removeEventListener("click", handleClick);
            div.removeEventListener("click", handleClick);
        }
    }, [handleClick])

    

    const editorFocusRef = useRef(null);
    useEffect(() => {
        console.log(editorState.getSelection().getHasFocus())
        if (editorFocusRef.current) {
            editorFocusRef.current.focus();
        }
    }, [editorFocusRef]);




    const styleNode = {
        // minWidth: "20px",
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
        minWidth: "20px",
        // width: "30px",
        // height: "50px",
        minHeight: "20px",
        // minWidth: "80%",
        // minHeight: "80%",
        backgroundColor: "green",
        opacity: "0.5",
        zIndex: "11",
        };

        
    const styleEditor = {
        width: "420px",
        zIndex: "11",
        position: "absolute",
        top: "-185px",
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
                                zIndex={11}
                                // handleKeyCommand={handleKeyCommand}
                                // plugins={plugins}
                                // ref={editor}
                                // blockStyleFn={blockStyleFn}
                                // placeholder='dsfdsf'
                                />
                    </div>
    
    const stylePointTop = {
        width: "10px",
        height: "10px",
        backgroundColor: "blue",
        zIndex: "11",
        position: "absolute",
        top: "-15px",
        left: "calc(50% - (10px / 2))",
        alignSelf: "center"
    }
    
    const stylePointRight = {
        width: "10px",
        height: "10px",
        backgroundColor: "blue",
        zIndex: "11",
        position: "absolute",
        right: "-15px",
        top: "calc(50% - (10px / 2))",
    }

    const stylePointBottom = {
        width: "10px",
        height: "10px",
        backgroundColor: "blue",
        zIndex: "11",
        position: "absolute",
        bottom: "-15px",
        left: "calc(50% - (10px / 2))",
    }

    const stylePointLeft = {
        width: "10px",
        height: "10px",
        backgroundColor: "blue",
        zIndex: "11",
        position: "absolute",
        left: "-15px",
        top: "calc(50% - (10px / 2))",
    }
            
    return (
            <div
                id={props.id}
                style={styleNode}
                className="node" 
                // onClick={props.onClick} 
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
                
                ref={innerRef}
                
            >
                <div id={props.id + "top"} style={stylePointTop}></div>
                <div id={props.id + "right"} style={stylePointRight}></div>
                <div id={props.id + "bottom"} style={stylePointBottom}></div>
                <div id={props.id + "left"} style={stylePointLeft}></div>

                {isClicked ? divEditor : null}
                <div
                    style={styleEditorWrapper}
                    id={props.id + "editorWrapper"}
                >
                    <div dangerouslySetInnerHTML={isClicked ? null : {__html: props.htmlOutputFromEditor}}></div>
                </div>
            </div>
        );
}
