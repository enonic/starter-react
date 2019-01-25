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
        let i = 0;
        const theArray = new (Array(self.state.count).map(_ => i++));
        console.log(JSON.stringify(theArray));
        return (<ul>
            { theArray.map(c => <li key={c}>{self.state.count - c}</li>) }
        </ul>);
    }
}

export default (props) => <Counter {...props} />;
