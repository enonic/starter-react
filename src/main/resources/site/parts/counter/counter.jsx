import React from 'react';

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.startCount
        }
        this.tick.bind(this);
    }

    tick(count) {
        setTimeout(()=>{
            this.setState({count});
            if (count > 0) {
                this.tick(count - 1);
            }
        },
        75);
    }


    componentDidMount() {
        this.tick(this.state.count);
    }


    render() {
        const self = this;
        const theArray = Array.from(Array(self.state.count).keys()); //i );
        return (<ul>
            { theArray.map(c => <li key={c}>{self.state.count - c}</li>) }
        </ul>);
    }
}

export default (props) => <Counter {...props} />;
