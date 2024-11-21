import React, { useState } from "react";
import Select from "react-select";
import './App.css';

function App() {
  const [inputData, setInputData] = useState(""); // JSON input field state
  const [selectedFilter, setSelectedFilter] = useState([]); // Dropdown filters state
  const [filteredResponse, setFilteredResponse] = useState(""); // Filtered response state
  const [isLoading, setIsLoading] = useState(false); // Loading state for better UX
  const [error, setError] = useState(""); // Error state for displaying error messages

  // Dropdown options
  const filterOptions = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
  ];

  // Update input data on change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous error
    setFilteredResponse(""); // Clear previous filtered data
    setIsLoading(true); // Show loading state

    try {
      const parsedData = JSON.parse(inputData); // Try parsing the input data
      const response = await fetch("http://localhost:8080/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedData }), // Send JSON data
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend.");
      }

      const result = await response.json();
      console.log(result); // Check the API response

      // Filtering based on selected options
      let filteredData = [];
      if (selectedFilter.some((filter) => filter.value === "numbers")) {
        filteredData = [...filteredData, ...result.numbers];
      }
      if (selectedFilter.some((filter) => filter.value === "alphabets")) {
        filteredData = [...filteredData, ...result.alphabets];
      }

      setFilteredResponse(filteredData.join(", ")); // Update filtered response
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid input data or error from the backend.");
    } finally {
      setIsLoading(false); // Hide loading state once done
    }
  };

  return (
    <div className="App">
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h2>API Input</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="3"
            cols="50"
            placeholder='{"data":["M","1","334","4","B"]}'
            value={inputData}
            onChange={handleInputChange}
            required
            style={{ padding: "10px", marginBottom: "10px", display: "block" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>

        <h3>Multi Filter</h3>
        <Select
          options={filterOptions}
          isMulti
          onChange={setSelectedFilter}
          placeholder="Select Filter"
        />

        {isLoading && <p>Loading...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <h3>Filtered Response:</h3>
        <p>{filteredResponse}</p>
      </div>
    </div>
  );
}

export default App;
