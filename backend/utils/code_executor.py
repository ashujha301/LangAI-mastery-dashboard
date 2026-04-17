import subprocess
import json
from typing import List, Dict, Any

def execute_code(code: str, test_cases: List[Any], language: str = "python") -> List[Dict]:
    """Execute user code against test cases"""
    results = []
    
    if language == "python":
        results = execute_python(code, test_cases)
    elif language == "javascript":
        results = execute_javascript(code, test_cases)
    
    return results

def execute_python(code: str, test_cases: List[Any]) -> List[Dict]:
    """Execute Python code"""
    results = []
    
    for test_case in test_cases:
        try:
            # Create execution environment
            exec_env = {"__builtins__": {}}
            exec(code, exec_env)
            
            # Get the main function (usually 'solve' or 'main')
            func = exec_env.get("solve") or exec_env.get("main")
            
            if not func:
                return [{
                    "passed": False,
                    "error": "No solve() or main() function found"
                }]
            
            # Execute with test input
            input_data = test_case.input_data
            args = input_data if isinstance(input_data, list) else [input_data]
            output = func(*args)
            
            # Check against expected output
            passed = output == test_case.expected_output
            results.append({
                "passed": passed,
                "expected": test_case.expected_output,
                "actual": output
            })
        except Exception as e:
            results.append({
                "passed": False,
                "error": str(e)
            })
    
    return results

def execute_javascript(code: str, test_cases: List[Any]) -> List[Dict]:
    """Execute JavaScript code"""
    results = []
    
    for test_case in test_cases:
        try:
            # Similar execution for JavaScript using Node.js
            # Implementation depends on Node.js availability
            pass
        except Exception as e:
            results.append({
                "passed": False,
                "error": str(e)
            })
    
    return results
