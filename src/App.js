import './App.css';
import React from 'react';


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
        <div
            style={styleSquare}
            className="node" 
            onClick={props.onClick} 
            draggable="true"
            onDrag={props.onDrag}
            onDragStart={props.onDragStart}
            // onPointerMove={props.onDrag}
        >
            {props.value} 
        </div>
        );
  }


class Area extends React.Component {

    render() { 

        const currentNodes = this.props.nodes.map((v, nodeNumber) => {
            // console.log("THIS IS this.props.nodes: " + this.props.nodes)
            return (
                <Node 
                    key={nodeNumber}
                    // value={this.props.nodes[i]}
                    clientY={this.props.nodes[nodeNumber].clientY}
                    clientX={this.props.nodes[nodeNumber].clientX}
                    onClick={() => {this.props.onClick(nodeNumber);}} 
                    onDrag={dragEvent => this.props.onDrag(nodeNumber, dragEvent)}
                    onDragStart={dragStartEvent => this.props.onDragStart(nodeNumber, dragStartEvent)}
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
                onDoubleClick={mouseEvent => this.props.onDoubleClick(mouseEvent)}
            >
                {currentNodes}
            </div>
        );
    }
}


class MindMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              history: [
                {
                  nodes: [],
                }
              ],
              moveNumber: 0,
          }
      }
    
    jumpTo(moveNumber) {
        this.setState({
            moveNumber: moveNumber,
        })
    }


    handleClick(i) {
        console.log("one click")
        const history = this.state.history.slice(0, this.state.moveNumber + 1); // +1 because end not included in slice
        const historyCopy = [...this.state.history];
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];


        this.setState({
            history: historyCopy.concat([{
                nodes: nodes,
            }]),
            moveNumber: historyCopy.length,
        })
    }


    handleDoubleClick(mouseEvent) {
        const historyCopy = this.state.history.slice(0, this.state.moveNumber + 1); // +1 because end not included in slice; .slice instead of ... should be used because we have to truncate up to moveNumber to discard all needn't moves (it's for undo)
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];

        console.log(mouseEvent)
        
        if (mouseEvent.clientY <= 25 || mouseEvent.clientX <= 25) {
            return
        } else {
            
            let node = {
                clientY: mouseEvent.clientY,
                clientX: mouseEvent.clientX,
            }
            nodes[nodes.length] = node;
    
            this.setState({
                history: historyCopy.concat([{
                    nodes: nodes,
                }]),
                moveNumber: historyCopy.length,
            })
        }

    }


    handleOnDrag(nodeNumber, dragEvent) {
        const clientY = dragEvent.clientY;
        const clientX = dragEvent.clientX;

        if (clientY === 0 && clientX === 0) {
            console.log("zero")
            return
        }

        const historyCopy = [...this.state.history]; // there .slice isn't used as there no need to store new moves
        historyCopy[historyCopy.length - 1].nodes[nodeNumber].clientY = clientY;
        historyCopy[historyCopy.length - 1].nodes[nodeNumber].clientX = clientX;
        this.setState({
            history: historyCopy
        })
    }


    handleOnDragStart(nodeNumber, dragStartEvent) {
        let dragImg = new Image(0,0);
        dragImg.src ='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        dragStartEvent.dataTransfer.setDragImage(dragImg, 0, 0);

        const historyCopy = this.state.history.slice(0, this.state.moveNumber + 1); // +1 because end not included in slice
        const current = historyCopy[historyCopy.length - 1]; 
        const nodes = [...current.nodes];

        console.log(dragStartEvent)
        
        let nodeAlikeState = {
            clientY: dragStartEvent.clientY,
            clientX: dragStartEvent.clientX,
        }
        nodes[nodeNumber] = nodeAlikeState; // it's not new node as in handeDoubleClick, it's rather state (new coordinates) of previous one

        this.setState({
            history: historyCopy.concat([{
                nodes: nodes,
            }]),
            moveNumber: historyCopy.length,
        })
    }


    render() {
        // console.log(this.state.history)
        const history = this.state.history;
        const current = history[this.state.moveNumber];


        const moves = history.map((step, moveNumber) => {
            return (
                <li key={moveNumber}>
                    <button onClick={() => this.jumpTo(moveNumber)}>Jump to move: {moveNumber}</button>
                </li>
            );
        });

        
        return (
            <div className='mindmap'>

                    <Area 
                        nodes={current.nodes}
                        // onClick={(i) => {this.handleClick(i), this.handleClick(i)}}
                        onClick={i => {this.handleClick(i);}}
                        onDoubleClick={(mouseEvent) => {this.handleDoubleClick(mouseEvent);}}
                        onDrag={(nodeNumber, dragEvent) => this.handleOnDrag(nodeNumber, dragEvent)}
                        onDragStart={(nodeNumber, dragStartEvent) => this.handleOnDragStart(nodeNumber, dragStartEvent)}
                    />

                <ul>
                    {moves}
                </ul>
            </div>
          );
    }
}

export default MindMap;
