/*
TODO:
    Add an answer storing variable
*/

(function() {
  'use strict';
  // Shortcut to get elements
  var el = function(element) {
    if (element.charAt(0) === '#') {
      // If passed an ID...
      return document.querySelector(element); // ... returns single element
    }
    return document.querySelectorAll(element); // Otherwise, returns a nodelist
  };

  // Variables
  var viewer = el('#viewer'), // Calculator screen where result is displayed
    warning = el('#warning'), //Warning or Error message
    formulaDisplay = el('#formulaDisplay'), //Formula Display Message
    formulaList = el('#formulaList'), //List of Formulae
    check = el('#check'), //Check Formula Button
    equals = el('#equals'), // Equal button
    nums = el('.num'), // List of numbers
    ops = el('.ops'), // List of operators
    prevAns = el('#prevAns'),
    currentNum = '', // Current number
    oldNum = '', // First number
    resultNum = '', // Result
    prevAnsNum = '', // Previous Answer
    operator; // Operand

  // When: Number is clicked. Get the current number selected
  var setNum = function() {
    if (resultNum) {
      // If a result was displayed, reset number
      currentNum = this.getAttribute('data-num');
      resultNum = '';
    } else {
      // Otherwise, add digit to previous number
      currentNum += this.getAttribute('data-num');
    }
    viewer.innerHTML = currentNum; // Display current number
  };

  // When: Previous Answer is clicked, get the previous result.
  var setPrevAns = function() {
    if (prevAnsNum == '') {
      currentNum = '0';
    } else {
      currentNum = prevAnsNum;
    }
    viewer.innerHTML = currentNum;
  };

  // When: Operator is clicked. Pass number to oldNum and save operator
  var moveNum = function() {
    oldNum = currentNum;
    currentNum = '';
    operator = this.getAttribute('data-ops');
    equals.setAttribute('data-result', ''); // Reset result in attr
  };

  // When: Equals is clicked. Calculate result
  var displayResults = function() {
    // Convert string input to numbers
    oldNum = parseFloat(oldNum);
    currentNum = parseFloat(currentNum);

    // Perform operation
    switch (operator) {
      case 'plus':
        resultNum = oldNum + currentNum;
        break;
      case 'minus':
        resultNum = oldNum - currentNum;
        break;
      case 'times':
        resultNum = oldNum * currentNum;
        break;
      case 'divided by':
        resultNum = oldNum / currentNum;
        break;
      // If equal is pressed without an operator, keep number and continue
      default:
        resultNum = currentNum;
    }
    // If NaN or Infinity returned
    if (!isFinite(resultNum)) {
      if (isNaN(resultNum)) {
        resultNum = '';
        warning.innerHTML =
          'Warning: Please do not use two operands in a single calculation';
      } else {
        resultNum = '';
        warning.innerHTML = 'Warning: Please do not divide by 0';
      }
    }
    // Display result, finally!
    viewer.innerHTML = resultNum;
    equals.setAttribute('data-result', resultNum);
    // Now reset oldNum & keep result, set previous answer as result
    oldNum = 0;
    currentNum = resultNum;
    prevAnsNum = resultNum;
  };

  // When: Clear button is pressed. Clear everything, except previous answer
  var clearAll = function() {
    oldNum = '';
    currentNum = '';
    viewer.innerHTML = '0';
    equals.setAttribute('data-result', resultNum);
  };

  /* The click events */
  // Add click event to numbers
  for (var i = 0, l = nums.length; i < l; i++) {
    nums[i].onclick = setNum;
  }

  // Add click event to operators
  for (var i = 0, l = ops.length; i < l; i++) {
    ops[i].onclick = moveNum;
  }

  // Add click event to equal sign
  equals.onclick = displayResults;

  // Ass click event to previous answer
  prevAns.onclick = setPrevAns;

  // Add click event to clear button
  el('#clear').onclick = clearAll;

  // Showing formula on the calculator based on user choice
  var changeFormula = function() {
    if (formulaList.value == 'BMI') {
      formulaDisplay.innerHTML = 'Weight / (Height * Height)';
    } else if (formulaList.value == 'AreaCircle') {
      formulaDisplay.innerHTML = '3.142 * (radius * radius)';
    } else if (formulaList.value == 'PerimeterCircle') {
      formulaDisplay.innerHTML = '2 * 3.142 * radius';
    } else if (formulaList.value == 'Density') {
      formulaDisplay.innerHTML = 'Mass / Volume';
    } else if (formulaList.value == 'Velocity') {
      formulaDisplay.innerHTML = 'Distance / Time';
    } else if (formulaList.value == 'Momentum') {
      formulaDisplay.innerHTML = 'Mass * Velocity';
    } else {
      formulaDisplay.innerHTML = 'Pick a Formula';
    }
  };

  // Add click event for to GO! button
  check.onclick = changeFormula;
})();
