import React from 'react';
import './App.css';

import {Button, Form} from 'react-bootstrap';

class App extends React.Component {
    // Variables needed for saving state of the app
    state = {
        // ID of the new order
        post: '',
        // sandwichId of the newly created order/sandwich
        sandwichId: '',

        // Variables that save the information about the order/sandwich which status was checked
        fetchedOrderId: '-',
        fetchedSandwichId: '-',
        fetchedStatus: '-',

        // Variable that saves all the sandwiches so they can be shown to the user on a list
        allSandwiches: [],

        // Obj that is used to show the data of the newly created order to the user
        createdOrder: {id: "-", sandwichId: "-", status: "-"},
        createdOrderColor: 'white',

        // Text which is used to tell the user if the order creation was succesfull or not
        orderText: '-',
        orderTextColor: 'white'
    };

    // handleSubmit posts a new sandwich to the backend with the user given sandwich ID
    handleSubmit = async event => {
        event.preventDefault();
        let form_value = this.state.post;

        if (!isNaN(form_value) && form_value !== '' && form_value > 0) {
            const response = await fetch('/v1/order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"sandwichId": Number(form_value)}),
            });
            if (response.status !== 404) {
                const body = await response.json();
                this.setState({orderText: 'Order created succesfully! Order information:'});
                this.setState({createdOrder: body});
                this.setState({orderTextColor: 'DarkGreen'});
            } else {
                this.setState({orderText: 'Order creation failed!'});
                this.setState({createdOrder: {id: "-", sandwichId: "-", status: "-"}});
                this.setState({orderTextColor: 'DarkRed'});
            }

        } else {
            this.setState({orderText: 'Order creation failed!'});
            this.setState({createdOrder: {id: "-", sandwichId: "-", status: "-"}});
            this.setState({orderTextColor: 'DarkRed'});
            alert("Check input! Only numbers and no empty input!")
        }
    };

    // getById fetches only one orders/sandwiches info from the API to be shown on the page
    getById = async event => {
        event.preventDefault();
        let form_value = this.state.sandwichId;

        if (!isNaN(form_value) && form_value !== ''  && form_value > 0) {
            const response = await fetch(`/v1/order/${this.state.sandwichId}`);

            if (response.status !== 404) {
                const body = await response.json();
                this.setState({fetchedOrderId: body.id});
                this.setState({fetchedSandwichId: body.sandwichId});
                this.setState({fetchedStatus: body.status});

            } else {
                alert('There was no order with the given ID!');
            }
        } else {
            alert("Check input! Only numbers and no empty input!")
        }
    };

    // getAll handles fetching every order/sandwich from the API to be shown in a list
    getAll = async event => {
        event.preventDefault();
        const response = await fetch('/v1/order');
        const body = await response.json();
        this.setState({allSandwiches: body})
    };

    chooseStatusColor = (state) => {
        if (state === "ready") {
            return 'green';
        } else if (state === "inQueue") {
            return 'yellow';
        } else if (state === "failed") {
            return 'red';
        } else if (state === "ordered") {
            return 'Chartreuse';
        } else if (state === "received") {
            return 'DarkGoldenRod';
        }
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Make me a sandwich App</h1>
                    <div className="Order">
                        {/* Order new sandwich Form */}
                        <Form>
                            <Form.Group controlId="formOrder">
                                <h3 className='header3'>Order a new sandwich: </h3>
                                <input
                                    type="text"
                                    value={this.state.post}
                                    onChange={e => this.setState({post: e.target.value})}
                                />
                                <Button variant="primary" onClick={this.handleSubmit} type="submit" id="orderButton" className="btn cyan rounded">
                                    Order
                                </Button>
                            </Form.Group>
                            <h4 style={{ color: this.state.orderTextColor }}>{this.state.orderText}</h4>
                            <h4>Order ID: {this.state.createdOrder.id} | Sandwich ID: {this.state.createdOrder.sandwichId} | Status: <span style={{ color: this.chooseStatusColor(this.state.createdOrder.status) }}>{this.state.createdOrder.status}</span></h4>
                        </Form>
                    </div>

                    <h3 className='header3'>Check order status:</h3>
                    <Form>
                        <Form.Group controlId="formStatus">
                            <input
                                type="text"
                                value={this.state.sandwichId}
                                onChange={e => this.setState({sandwichId: e.target.value})}
                            />

                            <Button variant="primary" onClick={this.getById} type="submit" id="checkButton" className="btn cyan rounded">
                                Check
                            </Button>

                        </Form.Group>

                    </Form>

                    {/* Showing asked order status */}
                    <h4>
                        Order ID: {this.state.fetchedOrderId} | Sandwich ID: {this.state.fetchedSandwichId} | Status: <span style={{ color: this.chooseStatusColor(this.state.fetchedStatus) }}>{this.state.fetchedStatus}</span>
                    </h4>

                    {/* Listing of all of the orders (getAll) */}
                    <h3 className='header3'>List all orders:</h3>
                    <Button variant="primary" onClick={this.getAll} type="submit" id="getAllButton" className="btn cyan rounded">
                        Get all
                    </Button>
                    {
                        this.state.allSandwiches.map((order) => {
                            return <li key={order.id}>Order ID: {order.id} | Sandwich ID: {order.sandwichId} |
                                Status: <span style={{ color: this.chooseStatusColor(order.status) }}>{order.status}</span></li>
                        })
                    }
                </header>
            </div>
        );
    }
}

export default App;
