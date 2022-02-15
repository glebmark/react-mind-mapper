import './App.css';
import React from 'react';


function Node(props) {    
    const styleSquare = {
        minWidth: "20px",
        width: "30px",
        minHeight: "20px",
        position: "absolute",
        top: props.posY,
        left: props.posX,
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
        >
            {props.value} 
        </div>
        );
  }


class Area extends React.Component {

    componentDidMount() {
        let area = document.getElementById("area");
        area.addEventListener("dblclick", (e) => {
            this.props.onDoubleClick(e); // send Mouse Event to handler
        })
    }

    render() { 
        const currentNodes = this.props.nodes.map((v, nodeNumber) => {
            console.log("THIS IS this.props.nodes: " + this.props.nodes)
            return (
                <Node 
                    key={nodeNumber}
                    // value={this.props.nodes[i]}
                    posY={this.props.nodes[nodeNumber].clientY}
                    posX={this.props.nodes[nodeNumber].clientX}
                    onClick={() => {
                        this.props.onClick(nodeNumber);
                        // this.handleClick();
                    }} 
                />
            );
        });

        
        return (  
            <div>
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
    

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.moveNumber + 1); // +1 because end not included in slice
        const current = history[history.length - 1]; 
        const nodes = [...current.nodes];


        this.setState({
            history: history.concat([{
                nodes: nodes,
            }]),
            moveNumber: history.length,
        })
    }


    handleDoubleClick(mouseEvent) {
        const history = this.state.history.slice(0, this.state.moveNumber + 1); // +1 because end not included in slice
        const current = history[history.length - 1]; 
        const nodes = [...current.nodes];

        nodes[current.nodes.length] = mouseEvent;

        this.setState({
            history: history.concat([{
                nodes: nodes,
            }]),
            moveNumber: history.length,
        })
    }


    jumpTo(moveNumber) {
        this.setState({
            moveNumber: moveNumber,
        })
      }


    render() {
        console.log(this.state.history)
        const styleArea = {
            minWidth: "300px",
            // width: "100%",
            // height: "100%",
            minHeight: "300px",
            backgroundColor: "green",
        };
        
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
                <div id='area' style={styleArea}>
                    <Area 
                        // nodes={current.nodes}
                        nodes={current.nodes}
                        // onClick={(i) => {this.handleClick(i), this.handleClick(i)}}
                        onClick={i => {
                            this.handleClick(i);
                        }}
                        onDoubleClick={(e) => {
                            this.handleDoubleClick(e);
                        }}
                        // onDblClick={i => this.handleDoubleClick(i)}
                    />
                </div>
                <ul>
                    {moves}
                </ul>
            </div>
          );
    }
}

export default MindMap;
