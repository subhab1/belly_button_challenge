// define url as variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// initiliaze the function
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // creates an array
        let sampleNames = data.names;

        // Iterate through the Array of samplenames retrieved from the json data
        sampleNames.forEach((name) => {
            // appends each value to populate dropdown menu 
            
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first sample name to firstname variable
        let firstname = sampleNames[0];

        // Call the functions to make the demographic panel, bar chart, and bubble chart
        BarPlot(firstname);
        BubblePlot(firstname);
        Metadata(firstname);
        Gauge(firstname);

    });
}

// Make the demographics panel
// creates function to build metadata panel 
function Metadata(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        //an arrow function used as the callback for the filter method. It checks if the id property of each sample object is equal to the given selectedvalue.
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]
        
        //  uses D3 to select the HTML element with the id "sample-metadata" and 
        //clears any existing child elements within it. This is done before populating it with new data.
        d3.select("#sample-metadata").html("");
  
        //  The Object.entries() method is applied to the obj object, creating an array of key-value pairs. 
        let entries = Object.entries(obj);
        
        // Iterate through the entries array
        // Add a h5 child element for each key-value pair to the div with id sample-metadata
        //This is a forEach loop that iterates through each key-value pair in the entries array.
        entries.forEach(([key,value]) => {
            //// Convert the key to uppercase using toUpperCase()
            let uppercasekey= key.toUpperCase();
            //for each key-value pair, an <h5> element is appended to the HTML element with the id "sample-metadata". 
            d3.select("#sample-metadata").append("h5").text(`${uppercasekey}: ${value}`);
        });

        // Log the entries Array
        console.log(entries);
    });
  }
  

// Make the bar chart
function BarPlot(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of sample objects
        let samples = data.samples;

        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // Assign the first object to obj variable
        let obj = filteredData[0];
        
        // Trace for the data for the horizontal bar chart
        let trace = [{
            // Slice the top 10 otus
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: " lightgreen"
            },
            orientation: "h"
        }];
        
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", trace);
    });
}
  
// Make the bubble chart
function BubblePlot(selectedValue) {
    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {

        // An array of sample objects
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        // Assign the first object to obj variable
        let obj = filteredData[0];
        
        // Trace for the data for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        // Apply the x-axis lengend to the layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Use Plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Make the gauge chart 
function Gauge(selectedValue) {
    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        // An array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        //The filter method is used to find the object where the id property matches the selectedValue
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        //This object now contains the metadata for the selected sample, including the washing frequency (obj.wfreq).
        // Assign the first object to obj variable
        let obj = filteredData[0]

        // Trace for the data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "black"},
                steps: [
                    { range: [0, 1], color: "rgb(233,245,248)" },
                    { range: [1, 2], color: "rgb(218,237,244)" },
                    { range: [2, 3], color: "rgb(203,230,239)" },
                    { range: [3, 4], color: "rgb(188,223,235)" },
                    { range: [4, 5], color: "rgb(173,216,230)" },
                    { range: [5, 6], color: "rgb(158,209,225)" },
                    { range: [6, 7], color: "rgb(143,202,221)" },
                    { range: [7, 8], color: "rgb(128,195,216)" },
                    { range: [8, 9], color: "rgb(113,187,212)" },
                    { range: [9, 10], color: "rgb(98,180,207)" }
                ]
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    Metadata(selectedValue);
    BarPlot(selectedValue);
    BubblePlot(selectedValue);
    Gauge(selectedValue)
}

init();