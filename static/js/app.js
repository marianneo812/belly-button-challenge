d3.json("samples.json").then(data => {
    console.log(data);
    init(data);
  });

  function init(data) {
    var selector = d3.select("#selDataset");
  
    data.names.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    const firstSample = data.names[0];
    buildCharts(firstSample, data);
    buildMetadata(firstSample, data);
  }
  function buildMetadata(sample, data) {
  var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
  var display = d3.select("#sample-metadata");

  display.html("");
  
  Object.entries(metadata).forEach(([key, value]) => {
    display.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
}

function buildCharts(sample, data) {
    var samples = data.samples.filter(sampleObj => sampleObj.id == sample)[0];
  
    var barData = [{
      x: samples.sample_values.slice(0, 10).reverse(),
      y: samples.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: samples.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
  
    var barLayout = {
      title: "Top 10 OTUs Found"
    };
  
    Plotly.newPlot("bar", barData, barLayout);
    var bubbleData = [{
        x: samples.otu_ids,
        y: samples.sample_values,
        text: samples.otu_labels,
        mode: 'markers',
        marker: {
          size: samples.sample_values,
          color: samples.otu_ids,
          colorscale: "Earth"
        }
      }];
    
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };
    
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }
 
function optionChanged(newSample) {
    d3.json("samples.json").then(data => {
    buildCharts(newSample, data);
    buildMetadata(newSample, data);
        });
      }
      