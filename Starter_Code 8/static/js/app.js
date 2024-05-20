// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleNumber = metaData.filter(sampleObj => sampleObj.id == sample);
    let idNumber = sampleNumber[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for(i in idNumber){
      PANEL.append("h6").text(`${i.toUpperCase()}:${idNumber[i]}`);
      console.log(idNumber)
    };
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultsArray = samples.filter(sampleObj => sampleObj.id == sample);
    let results = resultsArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;
    let sample_values = results.sample_values;

    // Build a Bubble Chart
    let bubbleLayer = {
      title: "Bubble Chart",
      margin: {t:30},
      hovermode: "closest",
      xaxis: {titles:"OTU IDS"}
    };

    // Render the Bubble Chart
    let bubbleData = [{
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode:"markers",
      marker:{size:sample_values,color:otu_ids,colorscale:"rainbow"}
    }];

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    Plotly.newPlot("bubble",bubbleData,bubbleLayer);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      y:otu_ids.slice(0,10).map(otuIDS => `OTU ${otuIDS}`).reverse(),
      x:sample_values.slice(0,10).reverse(),
      text:otu_labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"
    }];

    // Render the Bar Chart
    let barLayer = {
      title:"Bar Chart",
      margin:{t:30,l:150}
    };

    Plotly.newPlot("bar",barData,barLayer);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selecter = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i=0;i<sampleNames.length;i++){
      selecter.append("option").text(sampleNames[i]).property("value",sampleNames[i]);
    };

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
