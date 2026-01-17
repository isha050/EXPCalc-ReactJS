import React, { useState, Component } from 'react';
import './App.css';

function ResultDisplay({ result, error }) {
  return (
    <div className="result-section">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {result !== null && !error && (
        <div className="result-display">
          <span className="result-label">Result:</span>
          <span className="result-value">{result}</span>
        </div>
      )}
    </div>
  );
}

function InputField({ label, id, value, onChange, placeholder, extraInfo }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {extraInfo && <span className="computed-value">{extraInfo}</span>}
    </div>
  );
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: '',
      bInput: '',
      expression: '',
      operation: 'add',
      result: null,
      error: null
    };
  }

  componentDidMount() {
    console.log('Calculator component mounted');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.result !== this.state.result) {
      console.log('Result updated to:', this.state.result);
    }
  }

  calculateB = () => {
    const bInputNum = parseFloat(this.state.bInput);
    return isNaN(bInputNum) ? NaN : bInputNum;
  };

  validateInputs = () => {
    const aNum = parseFloat(this.state.a);
    const b = this.calculateB();
    
    if (isNaN(aNum) || this.state.a === '') {
      this.setState({ 
        error: 'Please enter a valid number for "a"',
        result: null 
      });
      return null;
    }
    if (isNaN(b) || this.state.bInput === '') {
      this.setState({ 
        error: 'Please enter a valid number for "bInput"',
        result: null 
      });
      return null;
    }
    
    return { aNum, b };
  };

  handleCalculate = () => {
    this.setState({ error: null, result: null });
    
    const values = this.validateInputs();
    if (!values) return;
    
    let calculatedResult;
    
    switch(this.state.operation) {
      case 'add':
        calculatedResult = values.aNum + values.b;
        break;
      case 'subtract':
        calculatedResult = values.aNum - values.b;
        break;
      case 'multiply':
        calculatedResult = values.aNum * values.b;
        break;
      case 'divide':
        if (values.b === 0) {
          this.setState({ error: 'Division by zero is not allowed!' });
          return;
        }
        calculatedResult = values.aNum / values.b;
        break;
      case 'expression':
        if (!this.state.expression || this.state.expression.trim() === '') {
          this.setState({ error: 'Please enter an expression to evaluate' });
          return;
        }

        try {
          let processedExpression = this.state.expression
            .replace(/a/g, `(${values.aNum})`)
            .replace(/b/g, `(${values.b})`);
          
          const evaluator = new Function('return ' + processedExpression);
          calculatedResult = evaluator();
          
          if (!isFinite(calculatedResult)) {
            this.setState({ error: 'Expression resulted in infinity or invalid result' });
            return;
          }
        } catch (err) {
          this.setState({ error: 'Invalid expression. Please check your syntax.' });
          return;
        }
        break;
      default:
        calculatedResult = 0;
    }
    
    this.setState({ result: calculatedResult });
  };

  handleSumOfSquares = () => {
    this.setState({ error: null, result: null });
    const aNum = parseFloat(this.state.a);
    
    if (isNaN(aNum) || this.state.a === '') {
      this.setState({ error: 'Please enter a valid number for "a"' });
      return;
    }
    
    const absValue = Math.abs(aNum);
    const digits = Math.floor(absValue).toString().split('');
    
    const sum = digits.reduce((acc, digit) => {
      const digitNum = parseInt(digit);
      return acc + (digitNum * digitNum);
    }, 0);
    
    this.setState({ result: sum });
  };

  handleEvenOdd = () => {
    this.setState({ error: null, result: null });
    const aNum = parseFloat(this.state.a);
    
    if (isNaN(aNum) || this.state.a === '') {
      this.setState({ error: 'Please enter a valid number for "a"' });
      return;
    }
    
    if (!Number.isInteger(aNum)) {
      this.setState({ error: 'Please enter an integer for even/odd check' });
      return;
    }
    
    const evenOddResult = aNum % 2 === 0 ? 'Even' : 'Odd';
    this.setState({ result: evenOddResult });
  };

  render() {
    const b = this.calculateB();

    return (
      <div className="calculator-content">
        <div className="input-section">
          <InputField
            label="Number a:"
            id="inputA"
            value={this.state.a}
            onChange={(e) => this.setState({ a: e.target.value })}
            placeholder="Enter number a"
          />
          
          <InputField
            label="Number bInput:"
            id="inputB"
            value={this.state.bInput}
            onChange={(e) => this.setState({ bInput: e.target.value })}
            placeholder="Enter number bInput"
            extraInfo={`b = ${this.state.bInput ? (isNaN(b) ? 'Invalid' : b) : '...'}`}
          />
        </div>

        <div className="operations-section">
          <div className="input-group">
            <label htmlFor="operation">Select Operation:</label>
            <select 
              id="operation" 
              value={this.state.operation} 
              onChange={(e) => this.setState({ operation: e.target.value })}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="divide">Divide</option>
              <option value="expression">Expression</option>
            </select>
          </div>

          {this.state.operation === 'expression' && (
            <InputField
              label="Expression:"
              id="inputExpression"
              value={this.state.expression}
              onChange={(e) => this.setState({ expression: e.target.value })}
              placeholder="e.g., (a+b)/(a-b)*(a+b)"
            />
          )}
          
          <button onClick={this.handleCalculate} className="btn btn-primary">
            Calculate
          </button>
        </div>

        <div className="special-operations">
          <button onClick={this.handleSumOfSquares} className="btn btn-accent">
            MoD_Sum_square
          </button>
          <button onClick={this.handleEvenOdd} className="btn btn-accent">
            Even_ODD
          </button>
        </div>

        <ResultDisplay result={this.state.result} error={this.state.error} />
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>React Calculator</h1>
        <Calculator />
      </div>
    </div>
  );
}

export default App;