import { useState } from 'react';
import './App.css';

function App() {
  const [a, setA] = useState('');
  const [bInput, setBInput] = useState('');
  const [expression, setExpression] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Calculate b from bInput
  const calculateB = () => {
    const bInputNum = parseFloat(bInput);
    return isNaN(bInputNum) ? NaN : bInputNum;
  };

  // Validate inputs for basic operations
  const validateInputs = () => {
    const aNum = parseFloat(a);
    const b = calculateB();
    
    if (isNaN(aNum) || a === '') {
      setError('Please enter a valid number for "a"');
      setResult(null);
      return null;
    }
    if (isNaN(b) || bInput === '') {
      setError('Please enter a valid number for "bInput"');
      setResult(null);
      return null;
    }
    
    return { aNum, b };
  };

  // Handle Calculate button - unified for all operations
  const handleCalculate = () => {
    setError(null);
    setResult(null);
    
    const values = validateInputs();
    if (!values) return;
    
    let calculatedResult;
    
    switch(operation) {
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
          setError('Division by zero is not allowed!');
          return;
        }
        calculatedResult = values.aNum / values.b;
        break;
      case 'expression':
        // Handle expression evaluation
        if (!expression || expression.trim() === '') {
          setError('Please enter an expression to evaluate');
          return;
        }

        try {
          // Replace a and b in the expression with actual values
          let processedExpression = expression
            .replace(/a/g, `(${values.aNum})`)
            .replace(/b/g, `(${values.b})`);
          
          // Use Function constructor to safely evaluate
          const evaluator = new Function('return ' + processedExpression);
          calculatedResult = evaluator();
          
          if (!isFinite(calculatedResult)) {
            setError('Expression resulted in infinity or invalid result');
            return;
          }
        } catch (err) {
          setError('Invalid expression. Please check your syntax.');
          return;
        }
        break;
      default:
        calculatedResult = 0;
    }
    
    setResult(calculatedResult);
  };

  // Handle MoD_Sum_square (Part B)
  const handleSumOfSquares = () => {
    setError(null);
    setResult(null);
    const aNum = parseFloat(a);
    
    if (isNaN(aNum) || a === '') {
      setError('Please enter a valid number for "a"');
      return;
    }
    
    // Use absolute value for negative numbers
    const absValue = Math.abs(aNum);
    // Convert to string and remove decimal point if present
    const digits = Math.floor(absValue).toString().split('');
    
    // Square each digit and sum them
    const sum = digits.reduce((acc, digit) => {
      const digitNum = parseInt(digit);
      return acc + (digitNum * digitNum);
    }, 0);
    
    setResult(sum);
  };

  // Handle Even_ODD (Part C)
  const handleEvenOdd = () => {
    setError(null);
    setResult(null);
    const aNum = parseFloat(a);
    
    if (isNaN(aNum) || a === '') {
      setError('Please enter a valid number for "a"');
      return;
    }
    
    // Check if the number is an integer
    if (!Number.isInteger(aNum)) {
      setError('Please enter an integer for even/odd check');
      return;
    }
    
    const evenOddResult = aNum % 2 === 0 ? 'Even' : 'Odd';
    setResult(evenOddResult);
  };

  const b = calculateB();

  return (
    <div className="App">
      <div className="container">
        <h1>React Calculator</h1>
        
        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="inputA">Number a:</label>
            <input
              id="inputA"
              type="text"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="Enter number a"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="inputB">Number bInput:</label>
            <input
              id="inputB"
              type="text"
              value={bInput}
              onChange={(e) => setBInput(e.target.value)}
              placeholder="Enter number bInput"
            />
            <span className="computed-value">b = {bInput ? (isNaN(b) ? 'Invalid' : b) : '...'}</span>
          </div>
        </div>

        {/* Operations Section */}
        <div className="operations-section">
          <div className="input-group">
            <label htmlFor="operation">Select Operation:</label>
            <select 
              id="operation" 
              value={operation} 
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="divide">Divide</option>
              <option value="expression">Expression</option>
            </select>
          </div>

          {/* Conditional Expression Input - Only show when Expression is selected */}
          {operation === 'expression' && (
            <div className="input-group">
              <label htmlFor="inputExpression">Expression:</label>
              <input
                id="inputExpression"
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g., (a+b)/(a-b)*(a+b)"
              />
            </div>
          )}
          
          <button onClick={handleCalculate} className="btn btn-primary">
            Calculate
          </button>
        </div>

        {/* Special Operations */}
        <div className="special-operations">
          <button onClick={handleSumOfSquares} className="btn btn-accent">
            MoD_Sum_square
          </button>
          <button onClick={handleEvenOdd} className="btn btn-accent">
            Even_ODD
          </button>
        </div>

        {/* Result Display */}
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
      </div>
    </div>
  );
}

export default App;